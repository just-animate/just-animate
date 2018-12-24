import { JustAnimatePlugin } from './types';

export const plugins: { [plugName: string]: JustAnimatePlugin } = {};

export function addPlugin(plugin: JustAnimatePlugin) {
  plugins[plugin.name] = plugin;
}

export function removePlugin(plugin: JustAnimatePlugin) {
  delete plugins[plugin.name];
}
