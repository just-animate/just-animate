import * as types from '../types'

const plugins: types.Plugin[] = []
export function getPlugins() {
  return plugins
}
export function addPlugin(plugin: types.Plugin) {
  return plugins.push(plugin)
}
