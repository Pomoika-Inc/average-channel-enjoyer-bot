import type { CommandContext } from 'grammy/web'
import type { Context } from '#root/bot/context.js'
import { createMiniAppLoginKeyboard } from '#root/bot/keyboards/mini-app.js'

export async function handleStartCommand(ctx: CommandContext<Context>) {
  if (ctx.session.user?.walletAddress === undefined) {
    return await ctx.reply(ctx.t('welcome'), {
      reply_markup: createMiniAppLoginKeyboard(ctx),
    })
  }
  return await ctx.reply(ctx.t('welcome-back'), { reply_markup: undefined })
}

export async function handleWebAppData(ctx: Context) {
  let responseKey
  if (ctx.session.user) {
    if (ctx.session.user.walletAddress === undefined) {
      // TODO: check if the wallet address is valid
      ctx.session.user.walletAddress = ctx.message?.web_app_data?.data
      responseKey = 'login-successfully'
    }
    responseKey = 'login-duplicate'
    return await ctx.reply(ctx.t(responseKey), { reply_markup: undefined })
  }
}
