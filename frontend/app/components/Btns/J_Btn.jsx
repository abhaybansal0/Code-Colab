import React from 'react'

const J_Btn = ({ children, disabeled }) => {
  return (
    <button type='Submit' className='btn-white rounded-xl hover:animate-pulse '
      disabled={disabeled}
      >
        { children }
    </button>
  )
}

export default J_Btn
