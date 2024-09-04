import { Composer } from 'grammy'
import { createMiniAppLoginKeyboard } from '../keyboards/mini-app.js'
import type { Context } from '#root/bot/context.js'
import { logHandle } from '#root/bot/helpers/logging.js'

const composer = new Composer<Context>()

const feature = composer.chatType('private')

feature.command('start', logHandle('command-start'), (ctx) => {
  return ctx.reply(ctx.t('welcome'), {
    reply_markup: createMiniAppLoginKeyboard(ctx),
  })
})

export { composer as welcomeFeature }
