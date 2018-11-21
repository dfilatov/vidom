import babel from 'rollup-plugin-babel';

export default {
    input : 'src/vidom.js',
    plugins : [
        babel({
            babelrc : false,
            presets : [['@babel/preset-env', { loose : true }]]
        })
    ]
};
