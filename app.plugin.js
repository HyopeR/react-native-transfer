const {
  withAndroidManifest,
  withInfoPlist,
  createRunOncePlugin,
} = require('@expo/config-plugins');
const {Android, Ios} = require('./app.plugin.utils');
const pack = require('./package.json');

/**
 * @param {import("@expo/config-plugins").ExportedConfigWithProps} config
 * @param {Record<String, any>} props
 */
function withTransferAndroid(config, props = {}) {
  return withAndroidManifest(config, resource => {
    const manifest = resource.modResults.manifest;

    return resource;
  });
}

/**
 * @param {import("@expo/config-plugins").ExportedConfigWithProps} config
 * @param {Record<String, any>} props
 */
function withTransferIos(config, props = {}) {
  return withInfoPlist(config, resource => {
    const info = resource.modResults;
    return resource;
  });
}

/**
 * @type {import("@expo/config-plugins").ConfigPlugin<Record<string, any>>}
 */
const withTransfer = (config, props) => {
  config = withTransferAndroid(config, props);
  config = withTransferIos(config, props);
  return config;
};

module.exports = createRunOncePlugin(withTransfer, pack.name, pack.version);
