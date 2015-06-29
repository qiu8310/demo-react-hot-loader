var path = require('path');
var webpack = require('webpack');

var ENV = (process.env.NODE_ENV || 'development').toLowerCase();
var PRODUCTION = /^prod/i.test(ENV);

var appScripts = ['./scripts/index'];
var plugins = [
  // `webpack -p` 会将这些无法执行到的代码删除 ( dead-code elimination )
  // FIXME 测试好像代码没有被删除
  new webpack.DefinePlugin({ __DEBUG__: JSON.stringify(PRODUCTION ? false : true)}),
  new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
];

if (!PRODUCTION) {
  appScripts.unshift(
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server'
  );
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );
}

module.exports = {
  devtool: 'eval',
  entry: {
    app: appScripts,
    vendor: ['react']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.js',
    publicPath: '/static/'
  },
  plugins: plugins,
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: (PRODUCTION ? [] : ['react-hot']).concat('babel'),
      include: path.join(__dirname, 'scripts')
    }]
  }
};
