const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        app: './public/scripts/app.js',
        vendor: './public/scripts/vendor.js'
    },
    output: {
        path: __dirname + '/public/bundle/',
        filename: "app.bundle.js"
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
//        new CopyWebpackPlugin({ from: path.resolve(__dirname, './node_modules/'), to: path.resolve(__dirname, './public/bundle/css') }
        new CopyWebpackPlugin([
            { from: './node_modules/angular-ui-grid/ui-grid.css', to: './css/ui-grid.css' },
            { from: './node_modules/bootstrap/dist/css/bootstrap.css', to: './css/bootstrap.css' },
            { from: './node_modules/angular-loading-bar/build/loading-bar.css', to: './css/loading-bar.css' }
            ]
        )
    ]
};