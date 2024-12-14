'use client'
import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import '../verification/utils.css'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'



const page = () => {


    const router = useRouter();

    const [verifystatus, setVerifystatus] = useState('nill')

    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    // console.log(token)



    const verifyMe = async (e) => {
        try {
            e.preventDefault()
            setVerifystatus('verifing')


            const response = await axios.post(`api/verifypassword/forgot?token=${token}`)

            // console.log("Signup success!", response.data.message)
            const id = response.data._id

            setTimeout(() => {
                setVerifystatus('verified')
                toast.success("Verified Successfully!")

            }, 2000);

            setTimeout(() => {
                router.push(`/passverify/changepassword?id=${id}`);
            }, 3000);

        } catch (error) {
            console.log('Error Singingup', error)
            setVerifystatus('nill')
            toast.error("Verification Failed")

        }
    }






    return (
        <div className='w-scree h-screen flex justify-center items-center'>

            <div className="signup flex flex-col items-center justify-center
            px-16  p-4 border-gray rounded-2xl">

                <h1 className='text-2xl text-center '>Verification</h1>

                <p className='mt-2 mb-6  text-8a8a93'>Please Verify in order to change your credentials</p>

                <button
                    className={`btn-white verify-btn mt-6 rounded-xl !px-8 
                        ${verifystatus === 'verifing'? 'animate-pulse' : '' }`} 
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

export default page
