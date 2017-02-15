var webpack = require('webpack');

module.exports = {
    entry : __dirname + '/index.js',
    output : {
        path : __dirname,
        filename : 'index.bundle.js',
        publicPath : '/playground'
    },
    module : {
        loaders: [
            { test : /\.js$/, loader : 'babel' },
            { test: /\.css$/, loaders : ['style', 'css'] }
        ]
    },
    resolve : {
        alias : {
            'vidom' : __dirname + '/../src/vidom.js'
        }
    },
    plugins : [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': `"${process.env.NODE_ENV || 'development'}"`
        })
    ]
};
