import { InlineKeyboard } from 'grammy'
import type { Context } from '#root/bot/context.js'

export function createLoginButton(ctx: Context) {
  return new InlineKeyboard().webApp('Login', `${ctx.config.webAppBaseUrl}?login=true`)
}
