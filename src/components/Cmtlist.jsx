// 导入
import React from 'react'
import Cmtitem from '@/components/Cmtitem.jsx'

export default class Cmtlist extends React.Component {
    constructor() {
       super()
       this.state = {
          list: [
             {
                id: 0,
                user: '张三',
                content: '别说了，冲冲冲~~'
             },
             {
                id: 1,
                user: '张四',
                content: '别说了，冲冲冲~~'
             }
          ]
       }
    }
    render() {
       return <div>
          <h1 style={{color:'skyblue'}}>评论列表</h1>
          {this.state.list.map(item =>
             // <div key={item.id}>
             //    <h2>评审员{item.user}</h2>
             //    <h3>评审内容{item.content}</h3>
             // </div>
 
             <Cmtitem {...item} key={item.id}></Cmtitem>
          )}
       </div>
 
    }
 }