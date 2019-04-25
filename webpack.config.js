const webpack = require("webpack")
const HtmlWebpackPlugin = require('html-webpack-plugin')
//const uglify = require('uglifyjs-webpack-plugin') //压缩js插件
const extractTextPlugin = require("extract-text-webpack-plugin")

const path = require('path')
const extractCSS = new extractTextPlugin("css/[name].[hash:6].css")//
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');//压缩css插件
module.exports = {
	//注意这里是exports不是
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname + "/dist"),
		//打包后的js文件存放的地方
		filename: "js/[name].[hash:6].js"//打包后的js文件名
	},
	plugins: [
		extractCSS,
		new OptimizeCssAssetsPlugin(),//压缩css
		new webpack.optimize.UglifyJsPlugin(),//new uglify(),//压缩js
		new HtmlWebpackPlugin({
			filename: 'index.html',
			title: '九宫格抽奖',
      		template: "./src/index.html",
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
		//处理css中的loader
		{
			test: /\.css$/,
			use: extractTextPlugin.extract({
				fallback: "style-loader",
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
		/*{
            test: /.scss$/,
            loader: extractTextPlugin.extract("style-loader", "css-loader!sass-loader"),
            exclude: /node_modules/
       	},*/
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
                test: /\.(png|jpg|jpeg|gif|ttf)$/,
                use:{
                    loader: "url-loader",
                    options: {
                        name: "img/[name].[ext]"
                    }
                }
        }]
	}
};