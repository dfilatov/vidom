import baseConfig from './rollup.base';

export default Object.assign(
    {},
    baseConfig,
    {
        format : 'cjs',
        dest : 'lib/vidom.js'
    });
