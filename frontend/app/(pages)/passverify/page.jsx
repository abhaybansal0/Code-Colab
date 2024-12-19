'use client'
import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import '../verification/utils.css'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import LoadingScreen from '@/app/components/LoadingScreen'



const Page = () => {


    const router = useRouter();

    const [loading, setLoading] = useState(false)

    const [verifystatus, setVerifystatus] = useState('nill')


    // console.log(token)



    const verifyMe = async (e) => {
        try {
            setLoading(true)
            e.preventDefault()
            setVerifystatus('verifing')

            const searchParams = new URLSearchParams(window.location.search);
            const token = searchParams.get("token");

            const response = await axios.post(`api/verifypassword/forgot?token=${token}`)

            // console.log("Signup success!", response.data.message)
            const id = response.data._id

            setTimeout(() => {
                setVerifystatus('verified')
                toast.success("Verified Successfully!")
                setLoading(false)
            }, 1500);

            setTimeout(() => {
                router.push(`/passverify/changepassword?id=${id}`);
            }, 2000);

        } catch (error) {
            console.log('Error Singingup', error)
            setVerifystatus('nill')
            toast.error("Verification Failed")

        }
    }






    return (
        <div className='w-scree h-screen flex justify-center items-center'>

            <LoadingScreen showLoading={loading} />

            <div className="signup flex flex-col items-center justify-center
            px-16  p-4 border-gray rounded-2xl">

                <h1 className='text-2xl text-center '>Verification</h1>

                <p className='mt-2 mb-6  text-8a8a93'>Please Verify in order to change your credentials</p>

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
