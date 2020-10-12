import React from 'react'
import ReactDOM from 'react-dom'

// 创建组件的第一种方式
function Hello(props) {
    // 组件中的props永远是只读的
return <div>这是一个组件 -- {props.name} -- {props.age}</div>
}

// 导出组件
export default Hello