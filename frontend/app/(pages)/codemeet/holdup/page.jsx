'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const Page = () => {


  const router = useRouter();



  const [userinfo, setUserinfo] = useState({
    guestName: ""
  })

  // const [meetid, setMeetid] = useState(link)

  const [buttondisabled, setButtondisabled] = useState(true)
  const [loading, setLoading] = useState(false)

  const OnChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUserinfo({ ...userinfo, [name]: value })
  }



  const joinTheMeet = async (e) => {

    try {
      const params = new URLSearchParams(window.location.search)
      const meetid = params.get("link")

      e.preventDefault()
      setLoading(true)
      setButtondisabled(true)

      router.push(`/codemeet/${meetid}?myname=${userinfo.guestName}`)


      setLoading(false)
      setButtondisabled(false)
    } catch (error) {


      toast.error(error)
      setLoading(false)
      setButtondisabled(false)
    }
  }

  useEffect(() => {
    if (userinfo.guestName.trim() === "") {
      setButtondisabled(true)
    }
    else {
      setButtondisabled(false)
    }
  }, [userinfo])








  return (
    <div className='w-scree h-screen flex justify-center items-center'>

      <div className="signup flex items-center justify-center
            px-16  p-4 border-gray rounded-2xl bg-black">


        <form onSubmit={joinTheMeet} className='flex flex-col gap-8'>

          <h1 className='text-2xl text-center'> Code Colab</h1>

          <div className='flex flex-col gap-0.5'>
            <label htmlFor="username" className='text-8a8a93'>Your Name</label>
            <input type="text" id='guestName' className='inputField'
              placeholder='Enter your guest name'
              name='guestName'
              value={userinfo.guestName}
              onChange={OnChange}

            />

          </div>


          <button className={`btn-white mt-6 rounded-xl ${loading ? 'animate-pulse' : ''}
                        flex items-center justify-center gap-4
                        `}
            disabled={buttondisabled}
            type='submit'
          >{loading ? (
            <>
              <img src="../loading.svg" alt="" className='animate-spin !invert' />
              Loading...
            </>
          ) : 'Join'}</button>
        </form>

      </div>

    </div>
  )
}


export default Page
