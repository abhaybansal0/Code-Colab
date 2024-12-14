import React from 'react'
import { memo } from 'react'
import './page.css'

const Defaulttext = () => {
  return (
    <h4 className='text-8a8a93'>Click 'Run' to see the output Here</h4>
  )
}


const Terminal = ({ Output }) => {
  return (
    <div className='terminal border-0 rounded-2xl  h-1/2 text-white '>

      <span className="inputtext text-8a8a93  rounded-2xl rounded-es-none rounded-ee-none p-2 px-4 bg-black">
        Output.txt
      </span>

      <div className=' bg-black border-0 rounded-2xl rounded-ss-none  p-6 !h-5/6 max-h-5/6 min-h-5/6 text-white overflow-y-scroll'>
        {Output ? <pre>{Output}</pre> : <Defaulttext />}
      </div>
    </div>
  )
}

export default Terminal
