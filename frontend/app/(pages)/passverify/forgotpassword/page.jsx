'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'

const page = () => {


    const router = useRouter();

    const [userinfo, setUserinfo] = useState({
        userEmail: ""
    })

    const [buttondisabled, setButtondisabled] = useState(true)
    const [loading, setLoading] = useState(false)

    const OnChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setUserinfo({ ...userinfo, [name]: value })
    }

    const forgotmypassword = async (e) => {
        try {
            e.preventDefault()
            setLoading(true)
            setButtondisabled(true)



            const sendDetails = {
                "usernameEmail": userinfo.userEmail
            }
            const response = await axios.post("/api/forgotpass", sendDetails)

            toast.success("Found User!")
            setTimeout(() => {

                router.push('/signup/gotoEmail')

            }, 2000);


            setLoading(false)
            setButtondisabled(false)
        } catch (error) {


            toast.error("Invalid Credentials!")
            console.log(error)
            setLoading(false)
            setButtondisabled(false)
        }
    }

    useEffect(() => {
        if (userinfo.userEmail.trim() === "") {
            setButtondisabled(true)
        }
        else {
            setButtondisabled(false)
        }
    }, [userinfo])






    return (
        <div className='w-scree h-screen flex justify-center items-center'>

            <div className="signup flex items-center justify-center
            px-16  p-4 border-gray rounded-2xl">

                <form onSubmit={forgotmypassword} className='flex flex-col gap-8'>

                    <h1 className='text-2xl text-center'>Forgot Password</h1>

                    <div className='flex flex-col gap-0.5'>
                        <label htmlFor="username">New Password</label>
                        <input type="text" id='username' className='inputField'
                            placeholder='Username or Email Id'
                            name='userEmail'
                            value={userinfo.userEmail}
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

export default page
