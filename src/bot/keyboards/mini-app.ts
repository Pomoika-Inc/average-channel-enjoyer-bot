import { Keyboard } from 'grammy'
import type { Context } from '#root/bot/context.js'

export function createMiniAppKeyboard(ctx: Context) {
  return new Keyboard().webApp('Login', `${ctx.config.webAppBaseUrl}?login=true`)
}
