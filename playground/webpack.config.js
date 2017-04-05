var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry : __dirname + '/index.js',
    output : {
        path : __dirname,
        filename : 'index.bundle.js',
        publicPath : '/playground'
    },
    module : {
        loaders: [
            { test : /\.js$/, loader : 'babel-loader' },
            { test: /\.css$/, loaders : ['style-loader', 'css-loader'] }
        ]
    },
    resolve : {
        alias : {
            'vidom' : __dirname + '/../src/vidom.js'
        }
    },
    plugins : [
        new UglifyJSPlugin()
    ]
};
