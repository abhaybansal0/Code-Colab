'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import LoadingScreen from '@/app/components/LoadingScreen'

const Page = () => {

    const router = useRouter();

    const [userinfo, setUserinfo] = useState({
        username: "",
        email: "",
        password: ""
    })

    const [buttondisabled, setButtondisabled] = useState(true)
    const [loading, setLoading] = useState(false)

    const OnChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setUserinfo({ ...userinfo, [name]: value })
    }

    const signMeUp = async (e) => {
        try {
            e.preventDefault()
            setLoading(true)
            setButtondisabled(true)


            const response = await axios.post("/api/signup/verify", userinfo)
            router.push('/signup/gotoEmail')


            setLoading(false)
            setButtondisabled(false)
        } catch (error) {

            if(error.response.data.message === 'Username already Exists'){
                toast.error("User Already Exists")
            }

            if(error.response.data.message === 'Username Not Available!'){
                toast("Username Not Available!")
            }
            setLoading(false)
            setButtondisabled(false)
        }
    }

    useEffect(() => {
        if (userinfo.username.trim() === "" ||
            userinfo.email.trim() === "" ||
            userinfo.password.trim() === "") {
            setButtondisabled(true)
        }
        else {
            setButtondisabled(false)
        }
    }, [userinfo])






    return (
        <div className='w-scree h-screen flex justify-center items-center'>

            <LoadingScreen showLoading={loading} />

            <div className="signup flex items-center justify-center
            px-16  p-4 border-gray rounded-2xl bg-black">

                <form onSubmit={signMeUp} className='flex flex-col gap-4'>

                    <h1 className='text-2xl text-center'>Sign Up</h1>

                    <div className='flex flex-col gap-0.5'>
                        <label htmlFor="username">Username</label>
                        <input type="text" id='username' className='inputField'
                            placeholder='Enter your username'
                            name='username'
                            value={userinfo.username}
                            onChange={OnChange}

                        />

                    </div>

                    <div className='flex flex-col gap-0.5'>

                        <label htmlFor="email">Email</label>
                        <input type="email" id='email' className='inputField'
                            placeholder='Enter your email'
                            name='email'
                            value={userinfo.email}
                            onChange={OnChange}


                        />
                    </div>

                    <div className='flex flex-col gap-0.5'>

                        <label htmlFor="password">Password</label>
                        <input type="password" id='password' className='inputField'
                            placeholder='Enter your password'
                            name='password'
                            value={userinfo.password}
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
                    ) : 'Continue'}</button>
                </form>
            </div>

        </div>
    )
}

export default Page
