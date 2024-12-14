"use client"
import { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import StartMeet from './components/Btns/MeetBtn';
import Start_PopUp from './components/Popup/Start_Popup';
import Join_Popup from './components/Popup/Join_PopUp';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';




export default function Home() {

    const router = useRouter();


    const [message, setMessage] = useState('');
    const [show_Popup, setShow_Popup] = useState('Nill');
    const [loggedIn, setLoggedIn] = useState(false);
    const [Error, setError] = useState(null)

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

            } catch (error) {
                setError(error)
                console.log(error)
            }
        }
        getData();

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
            if(error.response.data.message ==='Token expired. Please login again.'){
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

            <div className="" id='home'>


                <div>{message ? message : 'Loading...'}</div>
                <StartMeet startAMeet={startAMeet} value={'Start Code Meet'} />
            </div>

            <button onClick={logmeout}>Log Out</button>

        </>
    );
}
