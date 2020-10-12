// 导入
import React from 'react'
import ReactDOM from 'react-dom'

import Cmtlist from '@/components/Cmtlist.jsx'


// 渲染到页面
// 参数一：要渲染的那个虚拟dom
// 参数二：制定页面上一个容器,dom元素
ReactDOM.render(<div>
   123
   <Cmtlist></Cmtlist>
</div>, document.getElementById('app'))