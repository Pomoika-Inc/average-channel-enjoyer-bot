import type { Middleware } from 'grammy'
import type { UpdateX } from '@grammyjs/hydrate/out/data/update.js'
import type { Context } from '#root/bot/context.js'

export function getUpdateInfo(ctx: Context): Omit<UpdateX, 'update_id'> {
  const { update_id, ...update } = ctx.update

  return update
}

export function logHandle(id: string): Middleware<Context> {
  return (ctx, next) => {
    ctx.logger.info({
      msg: `Handle "${id}"`,
      ...(id.startsWith('unhandled') ? { update: getUpdateInfo(ctx) } : {}),
    })

    return next()
  }
}
