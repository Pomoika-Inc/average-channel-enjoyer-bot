import type { CommandContext } from 'grammy/web'
import { Address } from '@ton/core'
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
  let responseKey = 'login-duplicate'
  if (ctx.session.user && ctx.message?.web_app_data?.data) {
    if (ctx.session.user.walletAddress === undefined) {
      const address = Address.parse(ctx.message?.web_app_data?.data)
      if (address.workChain !== ctx.config.tonChainId) {
        responseKey = 'login-wrong-chain'
      }
      else {
        ctx.session.user.walletAddress = address.toString()
        responseKey = 'login-successfully'
      }
    }
    return await ctx.reply(ctx.t(responseKey), { reply_markup: undefined })
  }
}
