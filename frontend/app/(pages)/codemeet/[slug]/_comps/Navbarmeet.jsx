import React from 'react';
import Link from 'next/link';
import './page.css'
import toast from 'react-hot-toast';


const Navbarmeet = ({ bringpreview, bringEdittor, meetid }) => {


    const handleCopy = async () => {
        try {
            // Copy the provided text to the clipboard
            await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN}/codemeet/holdup?link=${meetid}`);

            // Update the state to show success message or change button text
            toast.success("Link Copied!")

        } catch (err) {
            // console.error('Failed to copy: ', err);
            toast.error("Failed to Copy!")
        }
    }

    return (
        <nav >

            <div className={` text-sm w-full   flex fixed bottom-0 edittorNavbar   transition-all
                 flex-col z-20 items-center 
                 `}>
                <div className=' navbar flex gap-5    border-0 rounded-2xl '>

                    <Link href="/">
                        <div className="logo flex items-center justify-center">
                            <img src="../logo.svg" alt="logo" />
                        </div>
                    </Link>

                    <div className="navcontent h-full pb-2">

                        <ul className='flex gap-4 h-full'>

                            <button onClick={bringEdittor}>

                                <li>Edittor</li>
                            </button>

                            <button onClick={bringpreview}>
                                <li>Cavas</li>
                            </button>
                            <Link href="">
                                <li>
                                    <img src="../chat.svg" alt="fh" />
                                </li>
                            </Link>
                            <button onClick={handleCopy}>
                                <li>
                                    <img src="../addpeople.svg" alt="h" className='invert' />
                                </li>
                            </button>
                        </ul>

                    </div>
                </div>


            </div>


        </nav >
    )
}

export default Navbarmeet
