// 导入
import React from 'react'

import cssojb from '@/css/cmtlist.css'

const userStyle={
    border:'1px solid #28b682'
}

export default function Cmtitem(props) {
    return <div>
       <h2 style={userStyle}>评审员{props.user}</h2>
       <h3 className={cssojb.title}>评审内容:{props.content}</h3>
    </div>
 }