import React from 'react'
import MeetBtn from '../Btns/MeetBtn'
import './BlurrBg.css'

const Start_Popup = ({ show_Popup, startAMeet }) => {
  return (
    <>
      <div className={`animateme absolute w-screen h-screen filter  flex justify-center items-center
         ${ show_Popup === 'Startpop' ? ' opacity-1 backdrop-blur-md visible' : ' opacity-0 backdrop-blur-0 invisible'}`}>

        <div className={`animateme px-36 border-gray h-2/5 bg-black border-0 rounded-xl p-4 flex  flex-col justify-center items-center text-center gap-6 shadow-2xl
          ${ show_Popup === 'Startpop' ? ' translate-y-0 scale-1' : 'translate-y-72 scale-0'}`}>
         
          <h1 className='text-8a8a93'>Start A Code Meet</h1>
          <MeetBtn startAMeet={startAMeet} />
        
        </div>
      </div>
    </>
  )
}

export default Start_Popup
