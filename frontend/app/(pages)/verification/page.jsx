'use client'
import React, { Suspense } from 'react'
import { useState } from 'react'
import axios from 'axios'
import './utils.css'
import { useRouter } from 'next/navigation'



const Page = () => {

    const router = useRouter();

    const [verifystatus, setVerifystatus] = useState('nill')



    const verifyMe = async (e) => {
        try {

            const searchParams = new URLSearchParams(window.location.search);
            const token = searchParams.get("token");

            e.preventDefault()
            setVerifystatus('verifing')
            // console.log('till here')

            const response = await axios.post(`/api/verifyemail/verifyme?token=${token}`)

            console.log("Signup success!", response.data)

            setTimeout(() => {
                setVerifystatus('verified')
            }, 5000);

            setTimeout(() => {
                router.push('/login');

            }, 6500);

        } catch (error) {
            console.log('Error Singingup', error)
        }
    }






    return (
        <div className='w-scree h-screen flex justify-center items-center'>

            <div className="signup flex flex-col items-center justify-center
            px-16  p-4 border-gray rounded-2xl bg-black">

                <h1 className='text-2xl text-center '>Verification</h1>

                <p className='mt-2 mb-6  text-8a8a93'>Click the below button to verfy your Email Id</p>

                <button
                    className={`btn-white verify-btn mt-6 rounded-xl !px-8 
                            ${verifystatus === 'verifing' ? 'animate-pulse' : ''}`}
                    onClick={verifyMe}>
                    {
                        verifystatus === 'nill' ? 'Verify Me' : (
                            verifystatus === 'verifing' ? 'Processing...' : '✔ Verified'
                        )
                    }
                </button>
            </div>

        </div>
    )
}



export default Page
