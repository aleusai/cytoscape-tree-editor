var HtmlWebpackChangeAssetsExtensionPlugin = require('html-webpack-change-assets-extension-plugin')
var webpack = require('webpack');
var mousetrap = require('mousetrap');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");
//var HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const CompressionPlugin = require("compression-webpack-plugin");
//const BrotliPlugin = require('brotli-webpack-plugin'); //brotli
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
	mode: "production",
	entry: './src/mainIndex.js',
	devtool: 'source-map',
	  resolve: {
    // ...
    alias: {
      // ...
      'react-dom$': 'react-dom/profiling',
      'scheduler/tracing': 'scheduler/tracing-profiling',
    },
    // ...
  },
	  optimization: {
//		  minimize: false,
		  mergeDuplicateChunks: true,
    minimizer: [new TerserPlugin({ /* additional options here */ })]
  },
	module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
	include: path.resolve(__dirname, 'src'),
        exclude: [/node_modules/, /lib/],
        use: {
          loader: "babel-loader"
        }
      },
      //{
       // test: /\.html$/,
      //  use: [
      //    {
      //      loader: "html-loader"
      //    }
      //  ]
      //},
      {
test: /\.scss$/,
	      use: ['style-loader', 'css-loader', 
		      "sass-loader"],
      },

      {

	      	      	      	            test: /\.css$/,  	
	      use: ['style-loader', 'css-loader' 
		      ],
      }
    ],
	},
	devtool: 'source-map',
  output: {
    publicPath: './static/'
  },
  plugins: [
	  new webpack.DefinePlugin({
  "process.env.NODE_ENV": JSON.stringify("development")
}),
//	  new HtmlWebpackChangeAssetsExtensionPlugin(),
	      new webpack.DefinePlugin({ // <-- key to reducing React's size
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.AggressiveMergingPlugin(),//Merge chunks
	      new CompressionPlugin(),
	  new BundleAnalyzerPlugin({
    analyzerMode: 'disabled',
    generateStatsFile: true,
    statsOptions: { source: false }
  }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
	    jsExtension: '.gz'
    }),
  //  new HtmlWebpackTagsPlugin({ tags: ['a.js', 'b.css'], append: true })
  ]
};
