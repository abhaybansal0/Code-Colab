import React from 'react'
import { memo } from 'react'

const Defaulttext = () => {
    return (
        <h4 className='text-888888'>Click 'Run Code' to see the output Here</h4>
    )
}


const Terminal = ({ Output }) => {
  return (
    <div className='bg-black border-0 rounded-2xl p-6 h-1/2 text-white overflow-y-scroll'>
        { Output? <pre>{ Output }</pre> : <Defaulttext /> }
    </div>
  )
}

export default Terminal
