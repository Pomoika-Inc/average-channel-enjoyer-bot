import type { Context } from '#root/bot/context.js'
import { InlineKeyboard } from 'grammy'

export function createLoginButton(ctx: Context) {
  return new InlineKeyboard().webApp('Login', `${ctx.config.webAppBaseUrl}?login=true`)
}
