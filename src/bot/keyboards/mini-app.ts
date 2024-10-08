import type { Other } from '@grammyjs/hydrate'
import { Keyboard } from 'grammy'
import type { Context } from '#root/bot/context.js'

export function createMiniAppLoginKeyboard(ctx: Context) {
  return new Keyboard().webApp('Login', `${ctx.config.webAppBaseUrl}/login`)
}

export function removeKeyboard(): Other<'sendMessage', 'chat_id' | 'text'> {
  return { reply_markup: { remove_keyboard: true } }
}
