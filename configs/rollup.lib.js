import baseConfig from './rollup.base';

export default Object.assign(
    {},
    baseConfig,
    {
        output : {
            format : 'cjs',
            file : 'lib/vidom.js'
        }
    });
