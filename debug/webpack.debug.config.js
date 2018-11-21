module.exports = {
    mode : 'development',
    entry : __dirname + '/vidom.js',
    output : {
        path : __dirname + '/debug',
        filename : 'vidom.bundle.js',
        publicPath : '/debug/'
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
