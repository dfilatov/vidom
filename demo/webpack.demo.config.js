module.exports = {
    entry : __dirname + '/demo.js',
    output : {
        path : __dirname + '/demo',
        filename : 'demo.bundle.js',
        publicPath : '/demo/'
    },
    module : {
        loaders: [
            { test : /\.js$/, loader : 'babel-loader' }
        ]
    },
    resolve : {
        alias : {
            'vidom' : '../src/vidom'
        }
    }
};
