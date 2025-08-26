import React from 'react'
import { memo } from 'react'
import './page.css'

const Defaulttext = () => {
  return (
    <h4 className='text-8a8a93'>Click &apos;Run&apos; to see the output Here</h4>
  )
}


const Terminal = ({ Output }) => {
  return (
    <div className='terminal border-0 rounded-2xl  h-1/2 text-white '>

      <span className="inputtext  text-hover  rounded-2xl rounded-es-none rounded-ee-none p-2 px-4 bg-0D0D0D">
        Output.txt
      </span>

      <div className=' bg-0D0D0D border-0 rounded-2xl rounded-ss-none  p-6 !h-5/6 max-h-5/6 min-h-5/6 text-white overflow-y-scroll'>
        {Output ? <pre>{Output}</pre> : <Defaulttext />}
      </div>
    </div>
  )
}

export default Terminal
