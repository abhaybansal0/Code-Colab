import React from 'react';
import Link from 'next/link';
import './nav.css'

const Navbar = ({ Join_Hide_Show_Handler, Start_Hide_Show_Handler }) => {


    return (
        <nav className='w-full   flex fixed bottom-4 '>

            <div className=' navbar flex gap-5 mx-auto  bg-141B2B border-0 rounded-2xl'>

                <div className="logo">
                    <img src="homo" alt="logo" />
                </div>
                <div className="navcontent h-full">
                    <ul className='flex gap-4 h-full'>
                        <Link href=""><li>Home</li></Link>
                        <Link href=""><li>About</li></Link>
                        <Link href="/"><li>Edditor</li></Link>
                    </ul>
                </div>
                <div className="buttons flex gap-2 p-1.5">

                    <button className='btn join-btn ' onClick={() => Join_Hide_Show_Handler()}>
                        Join
                    </button>

                    <button className='btn start-btn' onClick={() => Start_Hide_Show_Handler()}>
                        Start
                    </button>

                </div>


            </div>
        </nav>
    )
}

export default Navbar
