import baseConfig from './rollup.base';
import replace from 'rollup-plugin-replace';
import { terser } from "rollup-plugin-terser";

const isProduction = process.env.NODE_ENV === 'production';

export default Object.assign(
    {},
    baseConfig,
    {
        name : 'vidom',
        output : {
            file : 'dist/vidom' + (isProduction? '.min' : '') + '.js',
            format : 'umd'
        },
        plugins : baseConfig.plugins.concat(isProduction?
            [
                replace({
                    'process.env.NODE_ENV': '\'production\''
                }),
                terser()
            ] :
            [
                replace({
                    'process.env.NODE_ENV': '\'development\''
                })
            ])
    });
