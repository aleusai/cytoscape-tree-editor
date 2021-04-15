var path = require('path');
var config = require('./config');
var ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
    context: config.build.context,
    entry: {
        app: "./js/main.js",
    },
    output: {
        path: config.build.assetsPath,
        filename: 'js/[name].[chunkhash].js',
        publicPath: config.build.assetsURL
    },
    plugins: [
        new ManifestPlugin({
            fileName: 'manifest.json',
            stripSrc: true,
            publicPath: config.build.assetsURL
        })
    ]
}
