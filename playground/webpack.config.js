module.exports = {
    mode : 'development',
    entry : __dirname + '/index.js',
    output : {
        path : __dirname,
        filename : 'index.bundle.js',
        publicPath : '/playground'
    },
    module : {
        rules : [
            { test : /\.js$/, loader : 'babel-loader' },
            { test: /\.css$/, loaders : ['style-loader', 'css-loader'] }
        ]
    },
    resolve : {
        alias : {
            'vidom' : '../src/vidom.js'
        }
    }
};
