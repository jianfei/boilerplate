const { resolve } = require('path');
const { existsSync } = require('fs');
const { cpus } = require('os');
const webpack = require('webpack');
const HappyPack = require('happypack');
const entry = require('./entry');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const defaultEjsPath = './src/app/index.ejs';
const isDevelopment = process.env.NODE_ENV === 'development';
const minify = isDevelopment ? false : {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
};

const htmlWebpackPluginInstances = Object.keys(entry).map(name => {
    const ejsPath = resolve(entry[name], './index.ejs');
    const ejsExists = existsSync(ejsPath);

    return new HtmlWebpackPlugin({
        template: ejsExists ? ejsPath : defaultEjsPath,
        filename: `${name === 'app' ? 'index' : name}.html`,
        chunks: [name, 'vendor'],
        isDev: isDevelopment,
        minify,
    });
});
const providePluginInstance = new webpack.ProvidePlugin({
    React: 'react',
    ReactDOM: 'react-dom',
    ReactRouter: 'react-router-dom',
    Loadable: 'react-loadable',
    Mobx: 'mobx',
    MobxReact: 'mobx-react',
    Rx: 'rxjs/Rx',
    Transition: 'react-transition-group/Transition',
    CSSTransition: 'react-transition-group/CSSTransition',
    TransitionGroup: 'react-transition-group/TransitionGroup',

    axios: 'axios',
    classnames: 'classnames',
    i18n: ['i18n', 'default'],
    // _: 'lodash', // 按需加载
    log: ['utils/logger', 'default'],
    qs: 'qs',
    switcher: 'switch-js',
    template: 'string-template',
});
const definePluginInstance = new webpack.DefinePlugin({
    IS_DEV: isDevelopment,
});
const happyThreadPool = HappyPack.ThreadPool({ size: cpus().length });
const happypackInstances = [
    new HappyPack({
        id: 'babel',
        threadPool: happyThreadPool,
        loaders: ['babel-loader?cacheDirectory'],
    }),
];

const plugins = [];
const commonPlugins = [
    ...happypackInstances,
    ...htmlWebpackPluginInstances,
    providePluginInstance,
    definePluginInstance,
    new ExtractTextPlugin('[name].css'),
    new CopyWebpackPlugin([{ context: './src', from: 'lib/*' }]),
];

if (isDevelopment) {
    plugins.push(
        ...commonPlugins,
        new webpack.HotModuleReplacementPlugin(),
    );
}
else {
    plugins.push(
        new CleanWebpackPlugin(['dist'], { root: resolve('.') }),
        ...commonPlugins,
        new ImageminPlugin({ test: /\.(jpe?g|png|gif)$/i }),
        new BundleAnalyzerPlugin(),
    );
}

module.exports = plugins;
