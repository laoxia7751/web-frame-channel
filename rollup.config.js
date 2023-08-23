// import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

export default {
    input: './src/index.js',
    output: [
        {
            file: './dist/web-frame-channel.umd.js',
            format: 'umd',
            name: 'webFrameChannel',
            globals: {
                'rd-web-logger': 'log'
            }
        }
        // {
        //     file: './dist/index.js',
        //     format: 'umd',
        //     name: 'webMetadata',
        // },
    ],
    external: ['rd-web-logger'],
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**'
        })
    ]
}
