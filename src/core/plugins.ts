import * as types from '../types'

const plugins: types.Plugin[] = []

export const getPlugins = () => plugins
export const addPlugin = (plugin: types.Plugin) => plugins.push(plugin)
