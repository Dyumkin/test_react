const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require(`./config/${process.env.NODE_ENV || 'default'}.js`);

module.exports = {
  context: __dirname,
  entry: ['babel-polyfill', './src/main.js'],
  output: {
    path: __dirname + '/dist',
    filename: 'assets/js/[name].js',
    publicPath: '/'
  },
  module: {
    preLoaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'eslint'}
    ],
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel'},
      {test: /\.(png|jpg|gif)$/, loader: 'file?name=assets/img/[name]-[hash].[ext]'},
      {test: /\.(woff2?|ttf|svg|eot)([\?]?.*)$/, loader: "file?name=assets/fonts/[ext]/[name].[ext]"},
      {test: /config\.js$/, loader: 'string-replace', query: {
        multiple: [
          {search: '${api-url-webpack}', replace: config.webpack.apiUrl}
        ]
      }},
      {test: /\.css$/, loader: ExtractTextPlugin.extract("css-loader")}
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `${__dirname}/src/index.html`
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin("assets/css/[name].css"),
    new CopyWebpackPlugin([
      {from: 'src/.htaccess'}
    ])
  ],
  devServer: {
    colors: true,
    historyApiFallback: true,
    inline: true,
    hot: true,
    port: process.env.PORT || 8080
  }
};
