import resolve from 'rollup-plugin-node-resolve'
export default {
  input: './src/index.js', // 入口文件
  output: [
    {
      format: 'cjs', // 打包为commonjs格式
      file: 'dist/yfykf-vue-base.cjs.js', // 打包后的文件路径名称
      name: 'yfykf-vue-base' // 打包后的默认导出文件名称
    },
    {
      format: 'esm', // 打包为esm格式
      file: 'dist/yfykf-vue-base.esm.js',
      name: 'yfykf-vue-base'
    },
    {
      format: 'umd', // 打包为umd通用格式
      file: 'dist/yfykf-vue-base.umd.js',
      name: 'yfykf-vue-base',
      minifyInternalExports: true
    }
  ],
  plugins: [resolve()]
}