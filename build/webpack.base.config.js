// 文件解析
const path = require('path');
const webpack = require('webpack');
const pkg = require('../package.json');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    css: [
                        'vue-style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                            },
                        }
                    ],
                    less: [
                        'vue-style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                    ]
                },
                sourceMap: true,
            }
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            options: {
                sourceMap: true,
            },
            exclude: /node_modules/,
            include: [path.resolve(__dirname, "./src"), path.resolve(__dirname, "./examples")],
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                publicPath: '../',
                fallback: "style-loader",
                use: "css-loader"
            })
        }, {
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                publicPath: '../',
                fallback: "style-loader",
                use: [{
                    loader: "css-loader"
                }, {
                    loader: "less-loader",
                    options: {
                        javascriptEnabled: true
                    }
                }]
            })
        }, {
            test: /\.(gif|jpg|png)\??.*$/,
            loader: 'url-loader',
            options: {
                esModule: false,
                limit: 8192,
                name: 'images/[name].[ext]'
            }
        }, {
            test: /\.(woff|svg|eot|ttf)\??.*$/,
            loader: 'url-loader',
            options: {
                esModule: false,
                limit:1,
                name:path.posix.join('styles', 'fonts/[name].[ext]')
            }
        },
        {
            test: /\.(html|tpl)$/,
            loader: 'html-loader'
        },
        ]
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue': 'vue/dist/vue.esm.js',
            '@': resolve('src')
        }
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.DefinePlugin({
            'process.env.VERSION': `'${pkg.version}'`
        }),
        new ExtractTextPlugin({
            filename: 'styles/main.css',
            allChunks: true
        }),
        new OptimizeCSSPlugin()
    ]
}