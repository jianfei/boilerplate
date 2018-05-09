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
    // splitChunks: {
    //     cacheGroups: {
    //         default: false,
    //         commons: {
    //             test: /node_modules/,
    //             name: 'vendor',
    //             chunks: 'initial',
    //             minSize: 1,
    //         },
    //     },
    // },
};
