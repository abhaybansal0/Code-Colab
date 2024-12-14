'use client'
import React from 'react'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import J_Btn from '../Btns/J_Btn'
import './BlurrBg.css'



const Join_PopUp = ({ show_Popup, setShow_Popup }) => {

  const router = useRouter();

  const [disabeledBtn, setDisabeledBtn] = useState(true);
  const [inputvalue, setInputvalue] = useState('');

  const handleChange = (e) => {
    e.preventDefault();
    setInputvalue(e.target.value);

  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!inputvalue.includes('/codemeet/')) {
      alert('Invalid Link');
      return;
    }

    const link = inputvalue.split('/codemeet/')[1];
    router.push(`/codemeet/${link}/holdup`)
  }


  useEffect(() => {
    if (inputvalue.trim() === '') {
      setDisabeledBtn(true)
    } else {
      setDisabeledBtn(false)
    }
  }, [inputvalue])


  return (
    <>

      <div className={`animateme absolute w-screen h-screen filter  flex justify-center items-center
         ${show_Popup === 'Joinpop' ? ' opacity-1 backdrop-blur-md visible' : ' opacity-0 backdrop-blur-0 invisible '}`}>

        <div className={`animateme border-gray px-16 h-2/5 border-0 rounded-xl p-4 flex  flex-col justify-center items-center text-center gap-6 shadow-2xl
          ${show_Popup === 'Joinpop' ? ' translate-y-0 scale-1' : 'translate-y-72 scale-0'}   !bg-black `}>

          <h1 className='text-8a8a93'>Join a Code Meet</h1>

          <form className="inputarea flex justify-center items-center gap-4" onSubmit={handleSubmit}>

            <input type="text" placeholder='Your Meeting Link...' value={inputvalue} onChange={handleChange}
              className='text-8a8a93 bg-transparent border-gray p-2 border-0 rounded-xl px-4' />

            <J_Btn disabeled={disabeledBtn}> Join </J_Btn>
          </form>

        </div>
      </div>
    </>
  )
}

export default Join_PopUp
