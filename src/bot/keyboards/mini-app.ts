import type { Context } from '#root/bot/context.js'
import type { Other } from '@grammyjs/hydrate'
import { Keyboard } from 'grammy'

export function createMiniAppLoginKeyboard(ctx: Context) {
  return new Keyboard().webApp('Login', `${ctx.config.webAppBaseUrl}/login`)
}

export function createStoreMenuButton(ctx: Context) {
  if (!ctx.session.user?.active) {
    return
  }

  ctx.setChatMenuButton({
    chat_id: ctx.chat!.id,
    menu_button: {
      type: 'web_app',
      text: 'Store',
      web_app: {
        url: `${ctx.config.webAppBaseUrl}/channels`,
      },
    },
  })
}

export function removeKeyboard(): Other<'sendMessage', 'chat_id' | 'text'> {
  return { reply_markup: { remove_keyboard: true } }
}
