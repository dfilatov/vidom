import babel from 'rollup-plugin-babel';

export default {
    entry : 'src/vidom.js',
    plugins : [
        babel({
            babelrc : false,
            presets : ['es2015-loose-rollup'],
            plugins : ['transform-object-rest-spread']
        })
    ]
};
