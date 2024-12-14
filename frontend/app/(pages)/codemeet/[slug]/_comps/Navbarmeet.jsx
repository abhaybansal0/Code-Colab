import React from 'react';
import Link from 'next/link';
import './page.css'


const Navbarmeet = ({ bringpreview }) => {


    return (
        <nav >

            <div className={` text-sm w-full   flex fixed bottom-0 edittorNavbar   transition-all
                 flex-col z-20 items-center 
                 `}>
                <div className=' navbar flex gap-5    border-0 rounded-2xl '>

                    <Link href="/">
                        <div className="logo">
                            <img src="homo" alt="logo" />
                        </div>
                    </Link>

                    <div className="navcontent h-full pb-2">

                        <ul className='flex gap-4 h-full'>

                            <Link href=''><li>Edittor</li></Link>
                            <button onClick={bringpreview}>
                                <li>Cavas</li>
                            </button>
                            <Link href="">
                                <li>
                                    <img src="../chat.svg" alt="fh" />
                                </li>
                            </Link>
                        </ul>

                    </div>
                </div>


            </div>


        </nav >
    )
}

export default Navbarmeet
