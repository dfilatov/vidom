module.exports = {
    mode : 'development',
    entry : __dirname + '/demo.js',
    output : {
        path : __dirname + '/demo',
        filename : 'demo.bundle.js',
        publicPath : '/demo/'
    },
    module : {
        rules : [
            { test : /\.js$/, loader : 'babel-loader' }
        ]
    },
    resolve : {
        alias : {
            'vidom' : '../src/vidom'
        }
    }
};
