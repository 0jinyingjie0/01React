// 导入
import React from 'react'
import ReactDOM from 'react-dom'

// 创建dom元素
// 参数一：创建的元素类型
// 参数二：是一个对象或null，表示当前dom元素的属性
// 参数三：子节点
function Hello(props) {
    // 组件中的props永远是只读的
    return <div>这是一个组件 -- {props.name}</div>
}

const dog = {
    name: 'dahuang',
    age: 22
}
// 渲染到页面
// 参数一：要渲染的那个虚拟dom
// 参数二：制定页面上一个容器,dom元素
ReactDOM.render(<div>
    <Hello name={dog.name}></Hello>
</div>, document.getElementById('app'))