import type { Context } from '#root/bot/context.js'
import { logHandle } from '#root/bot/helpers/logging.js'
import { Composer } from 'grammy'
import { handleStartCommand, handleWebAppData } from '../handlers/commands/start.js'

const composer = new Composer<Context>()

const feature = composer.chatType('private')

feature.command(
  'start',
  logHandle('command-start'),
  handleStartCommand,
)
feature.on('message:web_app_data', handleWebAppData)

export { composer as welcomeFeature }
