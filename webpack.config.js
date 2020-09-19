const path = require('path');

module.exports = {
	mode: 'development',
	entry: './src/index.ts',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist')
	},
	devServer: {
		contentBase: './dist'
	},
	// Currently we need to add '.ts' to the resolve.extensions array.
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx']
	},
	// Source maps support ('inline-source-map' also works)
	devtool: 'source-map',

	// Add the loader for .ts files.
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'awesome-typescript-loader'
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				loaders: [
				  'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
				  'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
				]
			  } 
		]
	}
};
