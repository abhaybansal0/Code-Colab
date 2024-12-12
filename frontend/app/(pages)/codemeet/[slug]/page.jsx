'use client'
import React from 'react';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Canvas from './_comps/Canvas';
import Terminal from './_comps/Terminal';
import InputTerminal from './_comps/InputTerminal';
import ExecuteCode from './_comps/runapi'

const CodeEditor = dynamic(() => import('./_comps/CodeEdittor'), { ssr: false });

const page = () => {

  // States //
  const [meetlink, setMeetlink] = useState('');
  const [Output, setOutput] = useState('');
  const [inputtext, setInputtext] = useState('');
  const [Code, setCode] = useState('console.log("Hello World!");');
  const [currlanguage, setCurrlanguage] = useState('javascript');

  // socket states
  const [socket, setSocket] = useState(null);



  const onCodeChange = (value) => {
    // console.log(value);
    setCode(value);
    console.log('I am editting the code')
    const Outgoingdetails = {
      code: value,
      input: inputtext,
      output: Output
    }
    socket.emit('coding', Outgoingdetails)

  };

  const onLanguageChange = (e) => {
    setCurrlanguage(e.target.value);
  }


  const onInputchange = (e) => {
    const input = e.target.value;
    setInputtext(input);
  }

  const RunCode = async (code) => {
    console.log(code);
    const input = inputtext;
    const language = currlanguage;

    try {
      const { run: result } = await ExecuteCode(code, language, input);
      console.log(result);
      setOutput(result.output);

      const Runningdetails = {
        code: Code,
        input: inputtext,
        output: result.output
      }
      socket.emit('Running', Runningdetails)

    } catch (error) {
      console.log('Error:', error.message)

    }
  }

  const params = useParams();
  const slug = params?.slug;


  // USE EFFECTS

  useEffect(() => {
    // Connect to the Socket.IO server
    const socketInstance = io('http://localhost:5000'); // Backend URL
    setSocket(socketInstance);

    // Listen for messages
    socketInstance.on('IncomingCode', (IncomingCode) => {
      // console.log('A codeupdate is being detected');
      setCode(IncomingCode.code);
      setInputtext(IncomingCode.input);
      setOutput(IncomingCode.output);
      console.log(IncomingCode.input);
      console.log(IncomingCode.input);

    })

    // Cleanup on component unmount
    return () => socketInstance.disconnect();
  }, []);






  useEffect(() => {
    if (slug) {

      fetch(`/api/codemeet/${slug}`)
        .then((res) => res.json())
        .then((data) => setMeetlink(data.slug));
    }

  }, []);


  return (
    <div className='min-w-screen min-h-screen flex p-4 gap-5'>

      <div className="menu_container w-1/12">
        <nav>
          Hello
        </nav>
      </div>

      <div className="content_container w-11/12 flex gap-5">


        <Canvas >
          <button className='btn' onClick={() => RunCode(Code)}>Run Code</button>
          <select name="language" id="langauge" onChange={onLanguageChange}
          className='text-black' >
            <option value="javascript" >Javascript</option>
            <option value="c++">C++</option>
            <option value="c">C</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="go">Go</option>
            <option value="php">Php</option>
          </select>
          <CodeEditor onChange={onCodeChange} Code={Code} />
        </Canvas >

        <Canvas >
          <Terminal Output={Output} />
          <InputTerminal handlechange={onInputchange} inputtext={inputtext} />
        </Canvas >

      </div>



    </div>
  )
}

export default page


{/* the code meet link is {slug ? slug : 'Loading...'}
      <div>{meetlink ? meetlink : 'Loading...'}</div> */}

{/* <div className="menu_container">
        <div className="menu"></div>
      </div>

      <div className="code_edittor">

      </div>

        <div className="preview_Container">

        </div> */}