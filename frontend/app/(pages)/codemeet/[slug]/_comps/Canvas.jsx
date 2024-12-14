import React from 'react'
import './page.css'

const Canvas = ({ children, value }) => {
  return (
    <div className={`border-gray  w-1/2  border-0 rounded-2xl bg-0D0D0D
      flex flex-col gap-4 terminalcanvas 
     ${value? '!p-0' : 'p-4'}
     `}>
      { children }
    </div>
  )
}

export default Canvas
