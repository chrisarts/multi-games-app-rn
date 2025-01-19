const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');
// metro.config.js
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
// eslint-disable-next-line no-undef
const projectRoot = __dirname;

const workspaceRoot = path.resolve('../..');

const defaultConfig = getDefaultConfig(projectRoot);

defaultConfig.watchFolders = [workspaceRoot];

defaultConfig.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = wrapWithReanimatedMetroConfig(defaultConfig);
