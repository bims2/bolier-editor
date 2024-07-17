const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');


// // glob.sync('./src/**/*.js'), // src 디렉토리와 하위 디렉토리에 있는 모든 .js 파일을 진입점으로 설정
// production, development, none
module.exports = {
    entry: './src/js/editor/Editor.js', // 프로젝트의 진입점 파일,
    mode : 'production',
    output: {
        filename: 'bundle.js', // 번들된 파일의 이름
        path: path.resolve(__dirname, 'dist'), // 번들된 파일이 생성될 경로
        library: 'KPS',
        libraryTarget: "global",
    },
    module: {
        rules: [
            {
                test: /\.js$/, // .js 확장자를 가진 파일들을
                include: path.resolve(__dirname, 'src/css'), // src 폴더 내에서 찾아서
                exclude: /node_modules/, // node_modules 폴더는 제외하고
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                include: path.resolve(__dirname, 'src'),
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
        ],
    },
    optimization: {
        minimize: true, // 코드 최적화 여부
        minimizer: [
            new TerserPlugin({
                // TerserPlugin 설정
                terserOptions: {
                    // Terser 옵션 설정
                    mangle: true, // 변수 및 함수 이름을 난독화
                    compress: {
                        // 코드 압축 설정
                        warnings: false, // 압축 경고 출력 여부
                        drop_console: true // 콘솔 로그 제거
                    }
                }
            })
        ]
    }
};
