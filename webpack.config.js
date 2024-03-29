const path = require('path');
const autoprefixer = require('autoprefixer');
const extractCSS = require('extract-text-webpack-plugin');

const MODE = process.env.WEBPACK_ENV;
const ENTRY_FILE = path.resolve(__dirname, 'assets', 'js', 'main.js');
const OUTPUT_DIR = path.join(__dirname, 'static');

const config = {
	plugins : [ new extractCSS('styles.css') ],
	entry   : [ '@babel/polyfill', ENTRY_FILE ],
	mode    : MODE,
	module  : {
		rules : [
			{
				test : /\.(js)%/,
				use  : [
					{
						loader : 'babel-loader'
					}
				]
			},
			{
				test : /\.(scss|sass)$/,
				use  : extractCSS.extract([
					{
						loader : 'css-loader'
					},
					{
						loader  : 'postcss-loader',
						options : {
							plugins () {
								return [ autoprefixer({ overrideBrowserslist: 'cover 99.5%' }) ];
							}
						}
					},
					{
						loader : 'sass-loader'
					}
				])
			}
		]
	},
	output  : {
		path     : OUTPUT_DIR,
		filename : '[name].js'
	}
};

module.exports = config;
