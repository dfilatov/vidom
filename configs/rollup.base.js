import babel from 'rollup-plugin-babel';

export default {
    input : 'src/vidom.js',
    plugins : [
        babel({
            babelrc : false,
            presets : ['es2015-loose-rollup'],
            plugins : ['transform-object-rest-spread']
        })
    ]
};
