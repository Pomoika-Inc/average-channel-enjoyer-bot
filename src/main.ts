#!/usr/bin/env tsx

import type { BotOptions } from '#root/bot/index.js'
import type { PollingConfig, WebhookConfig } from '#root/config.js'
import type { GroupSessionData, UserInGroupSessionData, UserSessionData } from './bot/middlewares/session.js'
import process from 'node:process'
import { createBot } from '#root/bot/index.js'
import { config } from '#root/config.js'
import { logger } from '#root/logger.js'
import { run, type RunnerHandle } from '@grammyjs/runner'
import { MemorySessionStorage } from 'grammy'
import { createServer, createServerManager } from './server/index.js'

async function startPolling(config: PollingConfig) {
  const bot = createBot(config.botToken, {
    config,
    logger,
  }, createBotSessionStorage())
  let runner: undefined | RunnerHandle

  // graceful shutdown
  onShutdown(async () => {
    logger.info('Shutdown')
    await runner?.stop()
  })

  await Promise.all([
    bot.init(),
    bot.api.deleteWebhook(),
  ])

  // start bot
  runner = run(bot, {
    runner: {
      fetch: {
        allowed_updates: config.botAllowedUpdates,
      },
    },
  })

  logger.info({
    msg: 'Bot running...',
    username: bot.botInfo.username,
  })
}

function createBotSessionStorage(): BotOptions {
  return {
    botSessionStorage: {
      type: 'multi',
      user: { storage: new MemorySessionStorage<UserSessionData | undefined>() },
      userInGroup: { storage: new MemorySessionStorage<UserInGroupSessionData | undefined>() },
      group: { storage: new MemorySessionStorage<GroupSessionData | undefined>() },
    },
  }
}

async function startWebhook(config: WebhookConfig) {
  const bot = createBot(config.botToken, {
    config,
    logger,
  }, createBotSessionStorage())
  const server = createServer({
    bot,
    config,
    logger,
  })
  const serverManager = createServerManager(server, {
    host: config.serverHost,
    port: config.serverPort,
  })

  // graceful shutdown
  onShutdown(async () => {
    logger.info('Shutdown')
    await serverManager.stop()
  })

  // to prevent receiving updates before the bot is ready
  await bot.init()

  // start server
  const info = await serverManager.start()
  logger.info({
    msg: 'Server started',
    url: info.url,
  })

  // set webhook
  await bot.api.setWebhook(config.botWebhook, {
    allowed_updates: config.botAllowedUpdates,
    secret_token: config.botWebhookSecret,
  })
  logger.info({
    msg: 'Webhook was set',
    url: config.botWebhook,
  })
}

try {
  if (config.isWebhookMode)
    startWebhook(config)
  else if (config.isPollingMode)
    startPolling(config)
}
catch (error) {
  logger.error(error)
  process.exit(1)
}

// Utils

function onShutdown(cleanUp: () => Promise<void>) {
  let isShuttingDown = false
  const handleShutdown = async () => {
    if (isShuttingDown)
      return
    isShuttingDown = true
    await cleanUp()
  }
  process.on('SIGINT', handleShutdown)
  process.on('SIGTERM', handleShutdown)
}
