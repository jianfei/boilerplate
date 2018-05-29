const { resolve } = require('path');
const entry = require('./webpack/entry');
const modules = require('./webpack/module');
const plugins = require('./webpack/plugins');
const optimization = require('./webpack/optimization');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
    entry,
    module: modules,
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            app: resolve('./src/app'),
            components: resolve('./src/components'),
            config: resolve('./src/config'),
            extension: resolve('./src/extension'),
            i18n: resolve('./src/i18n'),
            models: resolve('./src/models'),
            pages: resolve('./src/pages'),
            services: resolve('./src/services'),
            utils: resolve('./src/utils'),
        },
        modules: ['node_modules'],
    },
    output: {
        path: `${__dirname}/dist`,
        publicPath: isDevelopment ? '/' : './',
        filename: '[name].js',
        chunkFilename: '[name].js',
    },
    plugins,
    devServer: {
        hot: true,
        noInfo: true,
        open: isDevelopment,
        host: '0.0.0.0',
        useLocalIp: true,
        port: 3000,
        historyApiFallback: {
            rewrites: [
                // { from: /^\/$/, to: '/index.html' },
                { from: /./, to: '/index.html' },
            ],
        },
    },
    devtool: isDevelopment ? 'cheap-module-eval-source-map' : false,
    optimization,
    mode: isDevelopment ? 'development' : 'production',
    performance: { hints: false },
};
