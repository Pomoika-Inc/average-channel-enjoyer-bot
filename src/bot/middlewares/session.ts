import { MemorySessionStorage, type Middleware, session } from 'grammy'
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

export function createSession(ctx: Context): Middleware<Context> {
  return session({
    type: 'multi',
    user: {
      getSessionKey: getUserSessionKey,
      storage: new MemorySessionStorage<UserSessionData | undefined>(),
      initial: () => {
        if (!ctx.from?.is_bot) {
          return {
            login: ctx.from?.username ?? '',
            active: true,
          }
        }
      },
    },
    userInGroup: {
      getSessionKey: getUserInGroupSessionKey,
      storage: new MemorySessionStorage<UserInGroupSessionData | undefined>(),
      initial: () => {
        if (!ctx.from?.is_bot && ctx.message?.reply_to_message?.sender_chat?.type === 'channel') {
          return {
            admin: false,
            presavedJettons: 0,
            active: true,
          }
        }
      },
    },
    group: {
      getSessionKey: getGroupSessionKey,
      storage: new MemorySessionStorage<GroupSessionData | undefined>(),
      initial: () => {
        if (ctx.message?.reply_to_message?.sender_chat?.type === 'channel') {
          return {
            channel: ctx.message.reply_to_message.sender_chat.id,
            adminReactionRatio: 0,
            badReactions: [],
            active: true,
          }
        }
      },
    },
  })
}
