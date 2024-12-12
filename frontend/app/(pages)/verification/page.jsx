'use client'
import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import './utils.css'
import { useRouter,useSearchParams } from 'next/navigation'



const page = () => {

    const router = useRouter();

    const [verifystatus, setVerifystatus] = useState('nill')

    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    
    
    
    const verifyMe = async (e) => {
        try {
            e.preventDefault()
            setVerifystatus('verifing')
            console.log('till here')
            
            
            const response = await axios.post(`/api/verifyemail/verifyme?token=${token}`)

            router.push('/login');

            console.log("Signup success!", response.data)
            setVerifystatus('verified')


        } catch (error) {
            console.log('Error Singingup', error)
        }
    }   






    return (
        <div className='w-scree h-screen flex justify-center items-center'>

            <div className="signup flex flex-col items-center justify-center
            px-16  p-4 border-gray rounded-2xl">

                <h1 className='text-2xl text-center '>Verification</h1>

                <p className='mt-2 mb-6  text-8a8a93'>Click the below button to verfy your Email Id</p>

                    <button className=' btn-white verify-btn mt-6 rounded-xl' onClick={verifyMe}>
                        {
                            verifystatus==='nill' ? 'Verify Me' : (
                                verifystatus==='verifing'? 'Loading...' : '✔ Verified'
                            )
                        }
                    </button>
            </div>

        </div>
    )
}

export default page
