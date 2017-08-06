import { JustAnimatePlugin } from './types'

const plugins: { [plugName: string]: JustAnimatePlugin } = {}

export function getPlugins() {
  return plugins
}

export function addPlugin(plugin: JustAnimatePlugin) {
  plugins[plugin.name] = plugin
}

export function removePlugin(plugin: JustAnimatePlugin) {
  delete plugins[plugin.name]
}
