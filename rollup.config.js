// import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

export default {
    input: './src/index.js',
    output: [
        {
            file: './dist/web-frame-channel.umd.js',
            format: 'umd',
            name: 'webFrameChannel'
        },
        {
            file: './dist/web-frame-channel.esm.js',
            format: 'esm'
        }
    ],
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**'
        })
    ]
}
