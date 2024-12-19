import React from 'react'
import { useState } from 'react'
import './page.css'

const InputTerminal = ({ handlechange, inputtext }) => {



  return (
    <div className='terminal border-0 rounded-2xl h-1/2 text-white '>


      <span className="inputtext text-8a8a93  rounded-2xl rounded-es-none rounded-ee-none p-2 px-4 bg-0D0D0D border-0">
        Input.txt
        </span>

      <div className='bg-0D0D0D border-0 rounded-2xl rounded-ss-none h-5/6 text-white overflow-y-scroll'>
        <textarea name="" id=""
          className='w-full h-full border-0 rounded-xl bg-transparent p-4 '
          onChange={handlechange} value={inputtext}>

        </textarea>
      </div>

    </div>
  )
}

export default InputTerminal
