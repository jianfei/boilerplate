module.exports = {
    runtimeChunk: {
        name: 'vendor',
    },
    splitChunks: {
        cacheGroups: {
            commons: {
                name: 'vendor',
                chunks: 'initial',
                minChunks: 2,
            },
        },
    },
    /* 将所有来自 node_modules  的模块打包到 vendor，不实用
    splitChunks: {
        cacheGroups: {
            default: false,
            commons: {
                test: /node_modules/,
                name: 'vendor',
                chunks: 'initial',
                minSize: 1,
            },
        },
    }, */
};
