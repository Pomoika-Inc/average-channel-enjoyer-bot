import { type Middleware, type MultiSessionOptions, session } from 'grammy'
import type { Context } from '#root/bot/context.js'

export interface SessionData {
  user?: UserSessionData
  userInGroup?: UserInGroupSessionData
  group?: GroupSessionData
}

export interface UserSessionData {
  login: string
  walletAddress?: string
  active: boolean
}

export interface UserInGroupSessionData {
  admin: boolean
  presavedJettons: number
  active: boolean
}

export interface GroupSessionData {
  login?: string
  channel: number
  adminReactionRatio: number
  badReactions: string[]
  active: boolean
}

export function getUserSessionKey(ctx: Omit<Context, 'session'>) {
  return userCondition(ctx) ? ctx.from?.id.toString() : undefined
}

export function getUserInGroupSessionKey(ctx: Omit<Context, 'session'>) {
  return userCondition(ctx) && groupCondition(ctx) ? `${ctx.from?.id.toString()}/${ctx.chat?.id.toString()}` : undefined
}

export function getGroupSessionKey(ctx: Omit<Context, 'session'>) {
  return groupCondition(ctx) ? ctx.chat?.id.toString() : undefined
}

function userCondition(ctx: Omit<Context, 'session'>): boolean {
  return !ctx.from?.is_bot
}

function groupCondition(ctx: Omit<Context, 'session'>): boolean {
  return ctx.message?.reply_to_message?.sender_chat?.type === 'channel'
}

export function createSession(ctx: Context, options: MultiSessionOptions<SessionData, Context>): Middleware<Context> {
  return session({
    type: 'multi',
    user: {
      getSessionKey: getUserSessionKey,
      storage: options.user?.storage,
      initial: () => ({
        login: ctx.from?.username ?? '',
        active: true,
      }),
    },
    userInGroup: {
      getSessionKey: getUserInGroupSessionKey,
      storage: options.userInGroup?.storage,
      initial: () => ({
        admin: false,
        presavedJettons: 0,
        active: true,
      }),
    },
    group: {
      getSessionKey: getGroupSessionKey,
      storage: options.group?.storage,
      initial: () => ({
        channel: ctx.message?.reply_to_message?.sender_chat?.id ?? -1,
        adminReactionRatio: 0,
        badReactions: [],
        active: true,
      }),
    },
  })
}
