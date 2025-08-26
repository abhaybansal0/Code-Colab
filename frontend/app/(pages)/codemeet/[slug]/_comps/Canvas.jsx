import React from 'react'
import './page.css'

const Canvas = ({ children, value }) => {
  return (
    <div className={`  w-1/2  border-0 rounded-2xl bg-transparent
      flex flex-col gap-4 terminalcanvas md:w-full md:min-h-screen
     ${value? '!p-0' : 'p-2'}
     `}>
      { children }
    </div>
  )
}

export default Canvas
