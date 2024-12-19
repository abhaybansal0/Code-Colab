'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
import LoadingScreen from '@/app/components/LoadingScreen'

const Page = () => {

    const router = useRouter();

    const [userinfo, setUserinfo] = useState({
        email: "",
        password: ""
    })
    const [showLoading, setShowLoading] = useState(false)

    const [buttondisabled, setButtondisabled] = useState(true)
    const [loading, setLoading] = useState(false)

    const OnChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setUserinfo({ ...userinfo, [name]: value })
    }

    const LogmeIn = async (e) => {
        try {
            setShowLoading(true)
            e.preventDefault()
            setLoading(true)
            setButtondisabled(true)
            
            
            const response = await axios.post("/api/login", userinfo)
            router.push('/')
            console.log("Signup success!", response.data)
            
            
            setLoading(false)
            setButtondisabled(false)
        } catch (error) {
            // console.log('Error Singingup', error)
            toast.error("Please Check Your Credentials!")
            setLoading(false)
            setButtondisabled(false)
            setShowLoading(false)
        }
    }

    useEffect(() => {
        if (userinfo.email.trim() === "" || userinfo.password.trim() === "") {
            setButtondisabled(true)
        }
        else {
            setButtondisabled(false)
        }
    }, [userinfo])






    return (
        <div className='w-scree h-screen flex justify-center items-center'>

            <LoadingScreen showLoading={showLoading} />

            <div className="signup flex flex-col items-center justify-center
            px-16  p-4 border-gray rounded-2xl bg-black">

                <form onSubmit={LogmeIn} className='flex flex-col gap-4'>

                    <h1 className='text-2xl text-center'>Log In</h1>



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

                    <button className={`btn-white mt-6 rounded-xl ${loading ? 'animate-pulse' : ''}`}
                        disabled={buttondisabled}
                        type='submit'
                    >{loading ? 'Loading...' : 'Continue'}</button>
                </form>

                <Link href="/passverify/forgotpassword">
                    <h1 className='mt-4 text-8a8a93 '>Forgot password</h1>
                </Link>
            </div>

        </div>
    )
}

export default Page
