import React from 'react'

const Canvas = ({ children }) => {
  return (
    <div className='w-1/2 min-h-full border-0 rounded-2xl bg-0D0D0D p-4 flex flex-col gap-4'>
      { children }
    </div>
  )
}

export default Canvas
