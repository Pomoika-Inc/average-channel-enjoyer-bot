import { Composer } from 'grammy'
import { createLoginButton } from '../buttons/login-app.js'
import { createMiniAppKeyboard } from '../keyboards/mini-app.js'
import type { Context } from '#root/bot/context.js'
import { logHandle } from '#root/bot/helpers/logging.js'

const composer = new Composer<Context>()

const feature = composer.chatType('private')

feature.command('start', logHandle('command-start'), (ctx) => {
  return ctx.reply(ctx.t('welcome'), {
    reply_markup: createLoginButton(ctx),
  })
})

feature.command('login', logHandle('command-login'), (ctx) => {
  return ctx.reply(ctx.t('login'), {
    reply_markup: createMiniAppKeyboard(ctx),
  })
})

export { composer as welcomeFeature }
