"use client"
import { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import StartMeet from './components/Btns/MeetBtn';
import Start_PopUp from './components/Popup/Start_Popup';
import Join_Popup from './components/Popup/Join_PopUp';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';




export default function Home() {

    const router = useRouter();


    const [message, setMessage] = useState('');
    const [show_Popup, setShow_Popup] = useState('Nill');
    const [loggedIn, setLoggedIn] = useState(false);
    const [Error, setError] = useState(null)
    const [loaded, setLoaded] = useState(false)

    // Meeting Id
    const [codeid, setCodeid] = useState();


    const div = useRef()


    // Functions

    const generateALink = () => {
        const uuid = uuidv4().replace(/-/g, '');
        const len = 9;

        return uuid.slice(0, len)

    }

    useEffect(() => {

        async function getData() {
            try {
                const response = await axios.post('/api/me')
                const data = response.data;
                console.log(data)
                setLoggedIn(true)

            } catch (error) {
                setLoggedIn(false)
                setError(error)
                console.log(error)
            }
        }
        getData();

        setLoaded(true)

    }, []);



    const Join_Hide_Show = () => {
        // show_Popup === 'Nill' ? setShow_Popup('Joinpop') : setShow_Popup('Nill');
        if (show_Popup === 'Nill') setShow_Popup('Joinpop');
        else if (show_Popup == 'Startpop') {
            setShow_Popup('Nill');
            setShow_Popup('Joinpop');
        }
        else setShow_Popup('Nill');
    }
    const Start_Hide_Show = () => {
        // show_Popup === 'Nill' ? setShow_Popup('Startpop') : setShow_Popup('Nill');
        if (show_Popup === 'Nill') setShow_Popup('Startpop');
        else if (show_Popup == 'Joinpop') {
            setShow_Popup('Nill');
            setShow_Popup('Startpop');
        }
        else setShow_Popup('Nill');
    }

    const startAMeet = async () => {

        // () => router.push(`/codemeet/holdup/${codeid}`)
        try {

            // The admin id will be taken by my token
            // Sending Meet Data to be saved
            const link = generateALink();
            const meetDetails = {
                meetId: link,
                codebase: ''
            }

            const res2 = await axios.post('/api/meetings/addmeet', meetDetails)
            setCodeid(link);
            console.log(res2.data);

            router.push(`/codemeet/holdup?link=${link}`)



        } catch (error) {
            // console.log(error)
            if (error.response.data.message === 'Token expired. Please login again.') {
                console.log('Session Expired, Login Again')
            }
        }

    }

    const logmeout = async () => {
        try {
            const res = await axios.get('/api/logout')
            console.log('User Logged Out', res)
        } catch (error) {
            setError(error);
        }
    }




    return (

        <>
            <Join_Popup show_Popup={show_Popup} setShow_Popup={setShow_Popup} />
            <Start_PopUp show_Popup={show_Popup} startAMeet={startAMeet} />

            <Navbar Join_Hide_Show_Handler={Join_Hide_Show} Start_Hide_Show_Handler={Start_Hide_Show} />

            {/* <img src="./eyes.jpg" alt="and img" className='w-screen h-screen absolute -z-10 object-cover' /> */}





            <div className="text-center" id='home'>

                <div className="topbar w-screen flex justify-between p-8 px-16 text-sm">

                    {loggedIn ? (

                        <Link href="/login">
                            <button className={`btn-black !px-4 border rounded-3xl border-gray
                                ${!loaded ? '-scale-50' : ''}
                                `}>
                                Login
                            </button>
                        </Link>

                    ) : (

                        < Link href="/logout">
                            <button onClick={logmeout}
                                className={`btn-black !px-4 border rounded-3xl border-gray
                             ${!loaded ? '-scale-50' : ''}
                             `}>
                                Logout
                            </button>
                        </Link>
                    )
                    }

                    <button>
                        <img src="../logo.svg" alt="" />
                    </button>

                    <Link href="/signup">
                        <button className={`btn-black !px-4 border rounded-3xl border-gray
                            ${!loaded ? '-scale-50' : ''}
                            `}>
                            Signup
                        </button>
                    </Link>
                </div>


                <div className="home flex flex-col justify-center items-center gap-14">
                    <h1 className='text-5xl'>Code Colab</h1>

                    <div className='text-md text-8a8a93 mt-24'>
                        <p className='w-2/4 mx-auto text-center'>

                            Collaborate Anywhere! In Real-Time with Coders Across the Globe.
                            Bring your team into one virtual meeting room and code seamlessly together. Whether you're debugging, brainstorming, or building the next big thing, Code Colab
                        </p>
                    </div>
                    <StartMeet startAMeet={startAMeet} value={'Start Code Meet'} />
                </div>
            </div >


        </>
    );
}
