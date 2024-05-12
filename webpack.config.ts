import path from 'path';
import webpack, {Configuration} from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
// import ReactRefreshTypeScript  from 'react-refresh-typescript';

import 'webpack-dev-server';

type Mode = 'development' | "production"

interface EnvVariables {
  mode: Mode,
  port?: number,
  analyzer?:boolean,
}

const babelLoader = {
  test: /\.tsx?$/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        presets: [
          '@babel/preset-env', 
          '@babel/preset-typescript',
          ['@babel/preset-react', {
            runtime: 'automatic'
          }]
        ]
      }
    }
  ],
  exclude: /node_modules/,
}

module.exports = (env: EnvVariables) => {
  const isDev = env.mode === 'development';
  const openAnalyzer = !!env.analyzer

  const cssLoaderWithModule = {
    loader: 'css-loader',
    options: {
      modules: {
        localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64:8]'
      },
    }
  }

  const cssLoader = { 
    test:  /\.(sa|sc|c)ss$/,
    use: [isDev ? "style-loader" : MiniCssExtractPlugin.loader, cssLoaderWithModule, 'sass-loader']
  }

  const svgLoader = {
    test: /\.svg$/,
    use: {
      loader: '@svgr/webpack', 
      options: {
        icon: true,
        //Чтобы могли менять цвет через color, а не fill
        svgoConfig: {
          plugins: [
            {
              name: 'covertColors',
              params: {
                currentColor: true
              }
            }
          ]
        }
      }
    }

  }

  const picterLoader = {
    test: /\.(png|jpg|jpeg|gif)$/i,
    type: 'asset/resource',
  }

  // const tsLoasder = {
    //   ts-loader умеет работать с JSX 
    //   Если бы не использовали TS нужно подключать babel-loader
    //   test: /\.tsx?$/,
    //   use: [
    //     {
    //       loader: 'ts-loader',
    //       options: {
    //         transpileOnly: isDev,
    //         Перерисовка страницы после сохранения происходит без обновления
    //         getCustomTransformers: () => ({
    //           before: [isDev && ReactRefreshTypeScript()].filter(Boolean),
    //         }),
    //       }
    //     }
    //   ],
    //   exclude: /node_modules/,
    // },

  const config: Configuration = { 
    mode: env.mode ?? 'development',
    entry: path.resolve(__dirname, 'src', 'index.tsx'),
    output: {
      //Чтобы избежать кэширования
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      //Файл отчищается
      clean: true,
      
    },
    plugins: [
      new HtmlWebpackPlugin({template: path.resolve(__dirname, 'public', 'index.html')}),
      isDev && new webpack.ProgressPlugin(),
      !isDev && new MiniCssExtractPlugin(),
      //Анализ бандла
      openAnalyzer && new BundleAnalyzerPlugin(),
      //Перерисовка страницы после сохранения происходит без обновления
      isDev && new ReactRefreshWebpackPlugin()
      //Плагин, который выносит проверку типов в отдельный процесс
      //new ForkTSCheckerWebpackPlugin()
    ].filter(Boolean),
    module: {
      rules: [
        cssLoader,
        babelLoader,
        picterLoader,
        svgLoader
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        main: path.resolve(__dirname, 'src')
      }
    },
    devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',
    devServer: isDev ? {
      port: env.port ?? 3000,
      open: true,
      historyApiFallback: true,
      hot: true
    } : undefined
  }

    return config
 
};