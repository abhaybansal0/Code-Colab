import React from 'react'
import { useState } from 'react'

const InputTerminal = ({ handlechange, inputtext }) => {



  return (
    <div className='bg-black border-0 rounded-2xl p-6 h-1/2 text-white overflow-y-scroll'>
        <p className='text-888888'>Input</p>
        <textarea name="" id="" 
        className='w-full h-4/5 border-0 rounded-xl bg-transparent p-4 '
        onChange={handlechange} value = {inputtext}>
            
        </textarea>
    </div>
  )
}

export default InputTerminal
