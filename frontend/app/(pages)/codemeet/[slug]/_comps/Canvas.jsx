import React from 'react'
import './page.css'

const Canvas = ({ children, value }) => {
  return (
    <div className={`border-gra  w-1/2  border-0 rounded-2xl bg-transparent
      flex flex-col gap-4 terminalcanvas 
     ${value? '!p-0' : 'p-4'}
     `}>
      { children }
    </div>
  )
}

export default Canvas
