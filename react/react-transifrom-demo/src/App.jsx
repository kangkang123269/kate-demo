

import { CSSTransition } from 'react-transition-group'  // 导入css动画的组件模块
import { useState } from 'react'
import MyRouter from './router'

function App() {
  const [bool,setBool] = useState(true)
  return (
    <div className="App">
      <CSSTransition in={bool} timeout={2000} classNames="animate">
        <h1>这是动态显示的标签或组件</h1>
        <MyRouter />
      </CSSTransition>
    </div>
  )
}

export default App
