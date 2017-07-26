import { Plugin } from './types'

const plugins: Plugin[] = []
export function getPlugins() {
  return plugins
}
export function addPlugin(plugin: Plugin) {
  plugins.push(plugin)
  return plugin
}

export function removePlugin(plugin: Plugin) {
  var indexOfPlugin = plugins.indexOf(plugin)
  if (indexOfPlugin !== -1) {
    plugins.splice(indexOfPlugin, 1);
  }
}
