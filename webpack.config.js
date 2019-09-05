const webpack = require("webpack")
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
//const uglify = require('uglifyjs-webpack-plugin') //压缩js插件
const extractTextPlugin = require("extract-text-webpack-plugin")//css 分离
//const extractCSS = new extractTextPlugin("css/[name].[hash:6].css")
const extractCSS = new extractTextPlugin({
  filename: 'css/[name].min.css',
  allChunks: true
});
const extractSCSS = new extractTextPlugin({
  filename: 'css/[name].min.css',
  allChunks: true
});
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');//压缩css插件
module.exports = {
  //注意这里是exports不是
  entry: './src/js/index.js',
  output: {
    publicPath:"./",
    path: path.resolve(__dirname + "/dist"),
    //打包后的js文件存放的地方
    filename: "js/[name].min.js" //打包后的js文件名
  },
  plugins: [
    extractCSS,
    extractSCSS,
    new OptimizeCssAssetsPlugin(),//压缩css
    new webpack.optimize.UglifyJsPlugin(),//new uglify(),//压缩js
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template:'src/index.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'rule.html',
      template:'src/rule.html',
      chunks: [""]
    })
  ],
  module: {
    rules: [ //1.0的是loaders
      //处理js中的loader
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, '/src'),
        //指定打包的文件
        exclude: path.resolve(__dirname, '/node_modules') //排除打包的文件，加速打包时间
      },
      /*{
        test: /\.scss$/,
        use: [ 'style-loader', 'css-loader', 'sass-loader' ]
      }, //scss打包后在html里引入 */
      {
        test: /\.scss$/,
        use: extractTextPlugin.extract({
          fallback:'style-loader',
          publicPath: "../",
          use:[{
            loader:'css-loader'
          },{
            loader:'sass-loader'
          }]
        })
      },
      //处理css中的loader
      {
        test: /\.css$/,
        use: extractTextPlugin.extract({
          fallback: "style-loader",
          publicPath: "../",
          use: [
            {
              loader: 'css-loader',
              options:{
                minimize: true //css压缩
              }
            }
          ]
        })
      },
      //处理html模板中的loader
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      //处理ejs模板中的loader,以.tpl后缀结尾的
      {
        test: /\.tpl$/,
        loader: 'ejs-loader'
      },
      //处理图片中的loader,file-loader,url-loader,image-webpack-loader相互配合(图片格式转换base64 图片压缩)
      {
        test:/\.(jpg|png|gif|bmp|jpeg)$/,
        loader: 'url-loader?limit=8192&name=img/[hash:8].[name].[ext]'
      }
    ]
  }
};