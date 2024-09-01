import { MemorySessionStorage, type Middleware, session as createSession } from 'grammy'
import type { Context } from '#root/bot/context.js'

// type Options = Pick<SessionOptions<SessionData, Context>, 'getSessionKey' | 'storage'>

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
  return ctx.from?.id.toString()
}

export function getUserInGroupSessionKey(ctx: Omit<Context, 'session'>) {
  return `${ctx.from?.id.toString()}/${ctx.chat?.id.toString()}`
}

export function getGroupSessionKey(ctx: Omit<Context, 'session'>) {
  return ctx.chat?.id.toString()
}

export function session(): Middleware<Context> {
  return createSession({
    type: 'multi',
    user: {
      getSessionKey: getUserSessionKey,
      storage: new MemorySessionStorage<UserSessionData | undefined>(),
    },
    userInGroup: {
      getSessionKey: getUserInGroupSessionKey,
      storage: new MemorySessionStorage<UserInGroupSessionData | undefined>(),
    },
    group: {
      getSessionKey: getGroupSessionKey,
      storage: new MemorySessionStorage<GroupSessionData | undefined>(),
    },
  })
}

export function initSession(): Middleware<Context> {
  return (ctx) => {
    if (!ctx.from?.is_bot) {
      ctx.session.user = {
        login: ctx.from?.username ?? '',
        active: true,
      }
    }

    if (ctx.message?.reply_to_message?.sender_chat?.type === 'channel') {
      ctx.session.userInGroup = {
        admin: false,
        presavedJettons: 0,
        active: true,
      }
      ctx.session.group = {
        channel: ctx.message.reply_to_message.sender_chat.id,
        adminReactionRatio: 0,
        badReactions: [],
        active: true,
      }
    }
  }
}
