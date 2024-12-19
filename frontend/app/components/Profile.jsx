import React from 'react'
import Link from 'next/link'

const Page = ({ show_Profile, user_info }) => {
  //Userinfo should have, username, and teh array of meetings and this should be an object


  const meeting = (username) => {
    // console.log(username)
    return (
      <div className="meet flex flex-col items-center justify-center text-8a8a93">
        <img src="../task.svg" alt="" width={60} height={100} />
        <h4 className=''>{`${username}`}</h4>
      </div>
    )
  }



  return (
    <>
      <div className={`animateme absolute w-screen h-screen filter  flex justify-center items-center
         ${show_Profile ? ' opacity-1 backdrop-blur-md visible' : ' opacity-0 backdrop-blur-0 invisible'}`}>

        <div className={`animateme px-10 max-w-screen-md max-h-screen overflow-y-scroll border-gray  bg-black border-0 rounded-xl p-4 flex  flex-col justify-center items-center text-center gap-12 shadow-2xl
          ${show_Profile ? ' translate-y-0 scale-1' : 'translate-y-72 scale-0'}`}>

          {/* <h1 className='text-4xl '>Profile</h1> */}

          <div className='flex items-center justify-center gap-4 '>
            <div className=''>
              <img src="../user.svg" alt="" width={60} height={60} />
            </div>

            <div className='flex flex-col gap-2'>
              <h1 className='text-3xl'>
                {`${user_info.username}`}
              </h1>
              <p className='text-8a8a93'>
                {user_info.admin ? 'Admin' : 'Not Admin'}
              </p>
            </div>

          </div>

          <div className=' flex flex-col gap-4'>
            <h2 className='text-xl text-slate-600 text-left'>Your Meetings</h2>


            <div className='flex flex-wrap columns-4 gap-4'>

              {(user_info.meetings)?.map((meet, index) => {
                return (
                  <Link key={index} href={`${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN}/codemeet/${meet.meetId}?myname=${user_info.username}`}>
                    {meeting(meet.meetId)}
                  </Link>
                )
              })}
              
            </div>

          </div>

        </div>
      </div>
    </>
  )
}

export default Page
