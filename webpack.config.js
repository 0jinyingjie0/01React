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
    module:{
        rules:[
            {
                test:/\.js|jsx$/,use:'babel-loader',exclude:/node_modules/
            }
        ]
    }
}