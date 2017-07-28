import { Plugin } from './types'
import { push } from './lists';

const plugins: Plugin[] = []
export function getPlugins() {
  return plugins
}
export function addPlugin(plugin: Plugin) {
  return push(plugins, plugin)
}

export function removePlugin(plugin: Plugin) {
  var indexOfPlugin = plugins.indexOf(plugin)
  if (indexOfPlugin !== -1) {
    plugins.splice(indexOfPlugin, 1);
  }
}
