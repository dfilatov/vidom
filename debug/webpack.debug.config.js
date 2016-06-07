var jsLoaders = ['babel'];

module.exports = {
    entry : __dirname + '/vidom.js',
    output : {
        path : __dirname + '/debug',
        filename : 'vidom.bundle.js',
        publicPath : '/debug/'
    },
    module : {
        loaders: [
            { test : /\.js$/, loaders : jsLoaders }
        ]
    }
};
