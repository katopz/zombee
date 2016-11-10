const path = require('path');
const webpack = require('webpack');

const ENV = process.env.NODE_ENV || 'production';
const IS_DEV = ENV === 'development';

module.exports = {
	entry: path.resolve(__dirname, 'src'),
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'zombee.js',
		publicPath: './'
	},
	devtool: IS_DEV ? 'cheap-module-eval-source-map' : 'source-map',
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
				WEBPACK: true
			}
		}),
		// Avoid publishing files when compilation fails
		new webpack.NoErrorsPlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.AggressiveMergingPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				pure_getters: true,
				unsafe: true,
				unsafe_comps: true,
				screw_ie8: true,
				warnings: false,
				sequences: true,
				dead_code: true,
				conditionals: true,
				booleans: true,
				unused: true,
				if_return: true,
				join_vars: true,
				drop_console: true
			},
			comments: false,
			sourceMap: true
		})
	],
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel',
				include: path.resolve(__dirname, 'src')
			}
		]
	}
};
