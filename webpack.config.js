const path =require('path')
const HtmlWebpackPlugin=require('html-webpack-plugin')

const htmlplugin=new HtmlWebpackPlugin({
    template:path.join(__dirname,'./src/index.html'),
    filename:'index.html'
})

module.exports={
    mode:'development',
    plugins:[
        htmlplugin
    ],
    module:{ // 第三方的模块配置
        rules:[
            {
                test:/\.js|jsx$/,use:'babel-loader',exclude:/node_modules/
            }
        ]
    },
    resolve:{ //默认补全后缀
        extensions:['.js','.jsx','.json'],
        alias:{
            '@':path.join(__dirname, './src') //配置@符号，表示src根路径
        }
    }
}