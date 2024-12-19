'use client'
import React from 'react';
import { io } from 'socket.io-client';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import dynamic from 'next/dynamic';
import CodemeetLayout from '../layout';
import Canvas from './_comps/Canvas';
import Terminal from './_comps/Terminal';
import InputTerminal from './_comps/InputTerminal';
import ExecuteCode from './_comps/runapi'
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Navbarmeet from './_comps/Navbarmeet';



const CodeEditor = dynamic(() => import('./_comps/CodeEdittor'), { ssr: false });


const Page = () => {


  const router = useRouter()


  // const myname = useRef(currname)


  // States //
  const [meetid, setMeetid] = useState('');
  const [Output, setOutput] = useState('');
  const [inputtext, setInputtext] = useState('');
  const [Code, setCode] = useState('console.log("Hello World!");');
  const [currlanguage, setCurrlanguage] = useState('javascript');
  const [loading, setLoading] = useState(false)
  const [disableSave, setDisableSave] = useState(false)

  // socket states
  const [socket, setSocket] = useState(null);




  // Functions

  const onCodeChange = (value) => {
    // console.log(value);
    // value.preventDefault();
    setCode(value);
    console.log('I am editting the code', meetid)
    const Outgoingdetails = {
      slug: meetid,
      code: value,
      input: inputtext,
      output: Output
    }
    socket.emit('coding', Outgoingdetails)

  }

  const onLanguageChange = (e) => {
    e.preventDefault()
    setCurrlanguage(e.target.value);
  }

  const onInputchange = (e) => {
    e.preventDefault()
    const input = e.target.value;
    setInputtext(input);
  }

  const RunCode = async (code) => {

    // console.log(code);
    const input = inputtext;
    const language = currlanguage;
    setLoading(true)

    try {
      const { run: result } = await ExecuteCode(code, language, input);
      console.log(meetid);
      setOutput(result.output);

      const Runningdetails = {
        slug: meetid,
        code: Code,
        input: inputtext,
        output: result.output
      }
      socket.emit('Running', Runningdetails)

    } catch (error) {
      console.log('Error:', error.message)

    }
    setLoading(false)

  }

  const SaveCode = async () => {

    try {

      setDisableSave(true)

      const userdetail = {
        "meetId": meetid,
        "codebase": Code
      }
      const response = await axios.post('/api/meetings/updatemeet', userdetail);

      console.log(response.data)
      toast.success('Code Saved Successfully! ')
      const reres = await axios.post('/api/meetings/updatemeet', userdetail);

      setTimeout(() => {
        setDisableSave(false)
      }, 4000);


    } catch (error) {
      console.log(error.message)
      toast.error('Only Admin Can Save The Codebase! ')
    }
  }

  const FetchCode = async (slug) => {

    try {

      const response = await axios.post('/api/meetings/fetchmeet', { meetId: slug })
      const meeting_Previous_Code = response.data.savedCode.codebase;
      setCode(meeting_Previous_Code)

    } catch (error) {
      toast.error("Could Not Fetch From Codebase")
    }

  }

  const bringCanvas = (e) => {
    e.preventDefault()
    if (currlanguage !== 'HTML') {

      setCurrlanguage('HTML')
      if(Code === "" || Code === `console.log("Hello World!");`){
        setCode(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Preview Default Template</title>
    <style>
        :root {
            --bg-color: #0f0f0f;
            --text-color: #d4d4d8;
            --accent-color: #7c3aed;
            --muted-color: #71717a;
            --card-bg: #1a1a1a;
            --card-border: #2c2c2e;
            --rounded-md: 0.375rem;
        }

        body {
            margin: 0;
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
        }

        .card {
            background-color: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: var(--rounded-md);
            padding: 2rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            width: 100%;
        }

        .card h1 {
            font-size: 1.5rem;
            color: var(--accent-color);
            margin-bottom: 1rem;
        }

        .card p {
            font-size: 0.875rem;
            color: var(--muted-color);
            margin-bottom: 1.5rem;
        }

        .card code {
            background-color: rgba(124, 58, 237, 0.1);
            color: var(--accent-color);
            padding: 0.25rem 0.5rem;
            border-radius: var(--rounded-md);
            font-family: 'Source Code Pro', monospace;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>Welcome to Code Colab</h1>
        <p>Start editing to see live changes in your project.</p>
        <p>Example code: <code>&lt;h2&gt;Hello, World!&lt;/h2&gt;</code></p>
    </div>
</body>
</html>
`)
      }
    }
  }
  const bringEdittor = (e) => {
    e.preventDefault()
    if (currlanguage === 'HTML') {

      setCurrlanguage('javascript')
    }
  }






  // USE EFFECTS

  useEffect(() => {
    // Connect to the Socket.IO server
    const params = new URLSearchParams(window.location.search);
    const currname = params.get("myname");


    const socketInstance = io(process.env.NEXT_PUBLIC_BACKEND_DOMAIN); // Backend URL

    const slug = window.location.pathname.split('/')[2]
    setMeetid(slug)

    socketInstance.emit('JoinRoom', { slug: slug, myname: currname });
    setSocket(socketInstance);


    // Listen for messages
    socketInstance.on('IncomingCode', (IncomingCode) => {
      // console.log('A codeupdate is being detected');
      setCode(IncomingCode.code);
      setInputtext(IncomingCode.input);
      setOutput(IncomingCode.output);
      // toast('Bello')
      // console.log(IncomingCode.input);
    })

    socketInstance.emit('Ijoined', { slug: slug, name: currname })


    socketInstance.on('someoneJoined', (name) => {
      if (name.myname) {

        toast(`${name.myname} has Joined!`)
      }
    })



    FetchCode(slug)

    // Clean up socket on unmount
    return () => {
      console.log('Disconnecting socket');
      socketInstance.disconnect();
    };
  }, []);








  // Components
  const Runbtn = () => {
    return (
      <button className='btn-black rounded-lg  !px-4 flex items-center justify-center gap-2 !py-2 text-center'
        onClick={() => RunCode(Code)}>
        <img src="../run.svg" alt="" className='w-6' />
        Run
      </button>
    )
  }
  const LoadingBtn = () => {
    return (
      <button className='btn-black rounded-lg !px-4  animate-pulse flex items-center justify-center
      cursor-not-allowed gap-2 transition-all' disabled={true}>
        <img src="../loading.svg" alt="loading" className='w-4 h-4 animate-spin' /> Loading...
      </button>
    )
  }





  return (

    <CodemeetLayout>
      <div className='min-w-screen min-h-screen h-screen flex p-2 gap-3 overflow-y-hidden
      '>

        <div className="content_container w-full h-screen flex gap-3 ">


          <Canvas >

            <div className='flex justify-between items-center px-4'>

              <div className='flex items-center justify-center gap-8'>
                <select name="language" id="langauge" onChange={onLanguageChange}
                  className='text-8a8a93 bg-black p-2 px-4 border-gray rounded-lg' >
                  <option value="javascript" >Javascript</option>
                  <option value="c++">C++</option>
                  <option value="c">C</option>
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="go">Go</option>
                  <option value="php">Php</option>
                  <option value="HTML">HTML</option>
                </select>


                <button onClick={SaveCode} disabled={disableSave} className={`
                  ${disableSave ? 'animate-pulse' : ''}
                `}>

                  <img src="../save.svg" alt="save img" className='w-8 invert-1 save-btn' />
                </button>
              </div>





              {currlanguage === 'HTML' ? (
                <button className='btn-black rounded-lg !px-4'
                  onClick={null}>
                  Build
                </button>
              ) : (
                loading ? <LoadingBtn /> : (<Runbtn />)
              )}

            </div>
            <CodeEditor onChange={onCodeChange} Code={Code} language={currlanguage} />

          </Canvas >

          {currlanguage === 'HTML' ? (
            <Canvas value={'HTML'}>
              <iframe
                className="w-full h-full border-gray rounded-xl"
                srcDoc={Code}
                sandbox="allow-scripts"
                title="Live Preview"
              ></iframe>
            </Canvas >
          ) : (

            <Canvas >
              <Terminal Output={Output} />
              <InputTerminal handlechange={onInputchange} inputtext={inputtext} />
            </Canvas >
          )}

        </div>



      </div>


      <Navbarmeet bringpreview={bringCanvas} bringEdittor={bringEdittor} meetid={meetid} />
    </CodemeetLayout>

  )
}

export default Page

