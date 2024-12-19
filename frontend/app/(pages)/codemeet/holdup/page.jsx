'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import LoadingScreen from '@/app/components/LoadingScreen'

const Page = () => {


  const router = useRouter();



  const [userinfo, setUserinfo] = useState({
    guestName: ""
  })

  const [id, setId] = useState(null)

  const [buttondisabled, setButtondisabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showLoading, setShowLoading] = useState(false)

  const OnChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUserinfo({ ...userinfo, [name]: value })
  }



  const joinTheMeet = async (e) => {

    try {
      setShowLoading(true)
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

  useEffect(() => {

    const params = new URLSearchParams(window.location.search)
    const link = params.get("link")

    setId(link);


  }, [])


  const handleCopy = async () => {
    try {
      // Copy the provided text to the clipboard
      await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN}/codemeet/holdup?link=${id}`);

      // Update the state to show success message or change button text
      toast.success("Link Copied!")

    } catch (err) {
      // console.error('Failed to copy: ', err);
      toast.error("Failed to Copy!")
    }
  }







  return (
    <div className='w-scree h-screen flex justify-center items-center'>

      <LoadingScreen showLoading={showLoading} />

      <div className="signup flex flex-col gap-10 items-center justify-center
            px-16  p-4 border-gray rounded-2xl bg-black ">


        <form onSubmit={joinTheMeet} className='flex flex-col gap-1'>

          <h1 className='text-2xl text-center mb-8'> Code Colab</h1>

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

        <div>

          <label htmlFor="meetinglink" className='text-8a8a93'>Invite others</label>
          <div id='meetinglink' className='flex border-gray border rounded-lg text-nowrap'>
            <button className='btn-black border-gray rounded-lg rounded-s-md'
              onClick={handleCopy}
            >
              Copy
            </button>

            <div className='text-center px-4 py-3 text-8a8a93 max-w-44 overflow-x-hidden'>
              {`${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN}/codemeet/holdup?link=${id}`}
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}


export default Page
