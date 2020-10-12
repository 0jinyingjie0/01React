// 导入
import React from 'react'
import ReactDOM from 'react-dom'

// 不做单独的配置不能省略.jsx
import Hello from "./Hello.jsx"
// import './class使用'

// 创建dom元素
// 参数一：创建的元素类型
// 参数二：是一个对象或null，表示当前dom元素的属性
// 参数三：子节点
// function Hello(props) {
//     // 组件中的props永远是只读的
// return <div>这是一个组件 -- {props.name} -- {props.age}</div>
// }
class Move extends React.Component {
   constructor(){
      super()
      this.state={
         msg:'hello world'
      } //相当于vue中的data
   }
  render(){
     this.state.msg='VUE'
   //   props只读
     return <div>
        我是类的组件--{this.props.name}
     </div>
  }
}

// 使用class关键字创建的组件有自己的私有数据和生命周期，有状态组件
// 使用function创建的函数没有自己的私有数据和生命周期，无状态组件
const user={
   name:'张三'
}
// 渲染到页面
// 参数一：要渲染的那个虚拟dom
// 参数二：制定页面上一个容器,dom元素
ReactDOM.render(<div>
   123
   {/* <Move name={user.name}></Move> */}
   <Move {...user}></Move>
</div>, document.getElementById('app'))