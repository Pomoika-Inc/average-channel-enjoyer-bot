import { Keyboard } from 'grammy'
import type { Context } from '#root/bot/context.js'

export function createMiniAppLoginKeyboard(ctx: Context) {
  return new Keyboard().webApp('Login', `${ctx.config.webAppBaseUrl}/login`)
}
