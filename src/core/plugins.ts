import { Plugin } from '../types'
import { push } from '../utils/lists'

const plugins: Plugin[] = []
export function getPlugins() {
  return plugins
}
export function addPlugin(plugin: Plugin) {
  return push(plugins, plugin)
}
