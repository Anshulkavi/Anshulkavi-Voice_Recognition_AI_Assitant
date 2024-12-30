const path = require('path');

module.exports = {
  // Entry point for your application
  entry: './src/index.js',

  // Output configuration
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },

  // Resolving module paths
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    preferRelative: true
  },

  // Module rules (e.g., for babel, typescript, etc.)
  module: {
    rules: [
      {
        test: /\.js|\.jsx|\.ts|\.tsx$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      // Add other loaders as needed
    ]
  },

  // Development server or other settings
  devServer: {
    contentBase: './dist',
    hot: true
  }
};
