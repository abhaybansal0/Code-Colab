'use client'
import React from 'react';
import { io } from 'socket.io-client';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Canvas from './_comps/Canvas';
import Terminal from './_comps/Terminal';
import InputTerminal from './_comps/InputTerminal';
import ExecuteCode from './_comps/runapi'
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Navbarmeet from './_comps/Navbarmeet';
import ChatModal from './_comps/ChatModal';
import RoleRequestModal from './_comps/RoleRequestModal';

import Script from 'next/script';
import { Save } from 'lucide-react';



const CodeEditor = dynamic(() => import('./_comps/CodeEdittor'), { ssr: false });


const Page = () => {


  // const router = useRouter()


  // const myname = useRef(currname)

  
  const slug = window.location.pathname.split('/')[2];
  const [meetid, setMeetid] = useState(slug)

  // States //
  // const [meetid, setMeetid] = useState('');
  const [Output, setOutput] = useState('');
  const [inputtext, setInputtext] = useState('');
  const [Code, setCode] = useState('console.log("Hello World!");');
  const [currlanguage, setCurrlanguage] = useState('javascript');
  const [loading, setLoading] = useState(false)
  const [disableSave, setDisableSave] = useState(false)

  // socket states
  const [socket, setSocket] = useState(null);

  // chat states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  
  // role states
  const [userRole, setUserRole] = useState('viewer');
  const [isOwner, setIsOwner] = useState(false);
  const [roleRequests, setRoleRequests] = useState([]);
  const [isRoleRequestModalOpen, setIsRoleRequestModalOpen] = useState(false);
  const [showRoleRequestCard, setShowRoleRequestCard] = useState(false);
  const [showRoomNamePrompt, setShowRoomNamePrompt] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');




  // Functions

  const onCodeChange = (value) => {
    // Only editors can change code
    if (userRole !== 'editor' && userRole !== 'owner' && userRole !== 'viewer') {
      toast.error('Only editors can modify code!');
      return;
    }
    
    // console.log(value);
    // value.preventDefault();
    setCode(value);
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
    // Only editors can change language
    if (userRole !== 'editor' && userRole !== 'owner') {
      toast.error('Only editors can change language!');
      return;
    }
    setCurrlanguage(e.target.value);
  }

  const onInputchange = (e) => {
    e.preventDefault()
    // Only editors can change input
    if (userRole !== 'editor' && userRole !== 'owner') {
      toast.error('Only editors can modify input!');
      return;
    }
    const input = e.target.value;
    setInputtext(input);
  }

  const RunCode = async (code) => {
    // Only editors can run code
    if (userRole !== 'editor' && userRole !== 'owner') {
      toast.error('Only editors can run code!');
      return;
    }

    // console.log(code);
    const input = inputtext;
    const language = currlanguage;
    setLoading(true)

    try {
      const { run: result } = await ExecuteCode(code, language, input);
      // console.log(meetid);
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
    // Only editors can save code
    if (userRole !== 'editor' && userRole !== 'owner') {
      toast.error('Only editors can save code!');
      return;
    }

    try {

      setDisableSave(true)

      const userdetail = {
        "meetId": meetid,
        "codebase": Code,
        "username": currentUser
      }
      const response = await axios.post('/api/meetings/updatemeet', userdetail);

      console.log(response.data)
      toast.success('Code Saved Successfully! ');

      setTimeout(() => {
        setDisableSave(false)
      }, 4000);


    } catch (error) {
      setDisableSave(false)
      // console.log(error.message)
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
    // Only editors can switch to canvas
    if (userRole !== 'editor' && userRole !== 'owner' && userRole !== 'viewer') {
      toast.error('Only editors can switch to canvas!');
      return;
    }
    
    if (currlanguage !== 'HTML') {

      setCurrlanguage('HTML')
      if (Code === "" || Code === `console.log("Hello World!");`) {
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
    // Only editors can switch to editor
    if (userRole !== 'editor' && userRole !== 'owner' && userRole !== 'viewer') {
      toast.error('Only editors can switch to editor!');
      return;
    }
    
    if (currlanguage === 'HTML') {

      setCurrlanguage('javascript')
    }
  }

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setHasUnreadMessages(false); // Clear unread messages when opening chat
    }
  };

  const requestEditorRole = () => {
    if (userRole === 'viewer' && !isOwner) {
      if (socket) {
        socket.emit('requestEditorRole', { slug: meetid, requesterId: currentUser });
      }
      
      toast.success('Editor role requested!');
    }
  };

  const assignRole = (targetUserId, newRole) => {
    if (isOwner) {
      // Notify other users via socket
      socket.emit('assignRole', { slug: meetid, targetUserId, newRole });
      
      // Remove the request from the list
      setRoleRequests(prev => prev.filter(req => req.requester !== targetUserId));
      
      toast.success(`Role ${newRole === 'editor' ? 'approved' : 'denied'} successfully!`);
    }
  };

  const handleApproveRole = (username) => {
    assignRole(username, 'editor');
  };

  const handleDenyRole = (username) => {
    assignRole(username, 'viewer');
  };

  const handleUpdateRoomName = async () => {
    if (!newRoomName.trim()) {
      toast.error('Room name cannot be empty');
      return;
    }

    try {

      await axios.put('/api/meetings/updateroomname', {
        meetId: meetid,
        roomName: newRoomName.trim()
      }, {
        withCredentials: true
      });

      toast.success('Room name updated successfully!');
      setShowRoomNamePrompt(false);
      setNewRoomName('');
    } catch (error) {
      console.error('Error updating room name:', error);
      toast.error('Failed to update room name');
    }
  };






  // USE EFFECTS

  useEffect(() => {
    // Connect to the Socket.IO server
    const params = new URLSearchParams(window.location.search);
    const currname = params.get("myname");
    setCurrentUser(currname || 'Anonymous');
    console.log('currentUser: ', currname)
    const socketInstance = io(process.env.NEXT_PUBLIC_BACKEND_DOMAIN); // Backend URL

    const slug = window.location.pathname.split('/')[2]
    setMeetid(slug)
    let ownerForThisFunction = false

    // Get user role from database first
    const fetchUserRole = async () => {
      try {
        const response = await axios.post('/api/meetings/getmeetdetails', { 
          meetId: slug,
          username: currname 
        });
        console.log('response.data', response.data)
        const { userRole: role, isOwner: owner, meeting } = response.data;
        setUserRole(role);
        setIsOwner(owner);
        ownerForThisFunction = owner

        // Show room name prompt for owners if room doesn't have a name
        if (owner && (!meeting?.roomName || meeting.roomName === 'Untitled Room')) {
          setShowRoomNamePrompt(true);
        }
      } catch (error) {
        console.log('Error fetching user role:', error);
        // Default to viewer if API fails
        setUserRole('viewer');
        setIsOwner(false);
      }
    };

    fetchUserRole();

    socketInstance.emit('JoinRoom', { slug: slug, myname: currname, userId: currentUser }); // userId will be replaced with actual user ID
    setSocket(socketInstance);


    // Listen for messages
    socketInstance.on('IncomingCode', (IncomingCode) => {
      setCode(IncomingCode.code);
      setInputtext(IncomingCode.input);
      setOutput(IncomingCode.output);
    })

    socketInstance.emit('Ijoined', { slug: slug, name: currname })


    socketInstance.on('someoneJoined', (name) => {
      if (name.myname) {
        const Outgoingdetails = {
          slug: meetid,
          code: Code,
          input: inputtext,
          output: Output
        }
        console.log('Outgoingdetails', Outgoingdetails)
        socketInstance.emit('coding', Outgoingdetails)
        toast(`${name.myname} has Joined!`)
      }
    })

    // Listen for new message notifications (even when chat is closed)
    socketInstance.on('newMessageNotification', (data) => {
      if (!isChatOpen && data.user !== currentUser && currentUser) {
        setHasUnreadMessages(true);
      }
    });

    // Listen for incoming messages to updatje unread status
    socketInstance.on('chatMessage', (message) => {
      if (!isChatOpen) {
        setHasUnreadMessages(true);
      }
    });

    // Role management listeners
    socketInstance.on('roleRequest', (data) => {
      if (ownerForThisFunction) {
        // Check if request already exists to prevent duplicates
        setRoleRequests(prev => {
          const exists = prev.some(req => req.requester === data.requester);
          if (!exists) {
            return [...prev, data];
          }
          return prev;
        });
        
        // Only show toast and card if it's a new request
        const existingRequest = roleRequests.find(req => req.requester === data.requester);
        if (!existingRequest) {
          setShowRoleRequestCard(true);
        }
      }
    });

    socketInstance.on('userRoleChanged', (data) => {
      // console.log('I am running, Data: ', data);
      if (data.user === currname) {
        // console.log('Role assigned:', data.newRole);
        toast.success(`👤 You are now ${data.newRole}`);
        // Update the local user role state
        setUserRole(data.newRole);
        
        // Refresh the user's role from database to ensure consistency
        // setTimeout(() => {
        //   fetchUserRole();
        // }, 500);
      }
      else {
        console.log('currentUser', currname)
        toast.success(`👤 ${data.user} is now ${data.newRole}`);
      }
    });



    FetchCode(slug)

    // Clean up socket on unmount
    return () => {
      console.log('Disconnecting socket');
      socketInstance.off('IncomingCode');
      socketInstance.off('someoneJoined');
      socketInstance.off('newMessageNotification');
      socketInstance.off('chatMessage');
      socketInstance.off('roleRequest');
      socketInstance.off('userRoleChanged');
      socketInstance.disconnect();
    };
  }, []);








  // Components
  const Runbtn = () => {
    return (
      <button 
        className={`bg-black text-white px-6 py-2.5 rounded-lg border border-gray-700 flex items-center justify-center gap-3 font-medium transition-all duration-200 ${
          userRole !== 'editor' && userRole !== 'owner' 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-gray-900 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-900/20 active:scale-95'
        }`}
        onClick={() => RunCode(Code)}
        disabled={userRole !== 'editor' && userRole !== 'owner'}
      >
        <img src="../run.svg" alt="" className='w-5 h-5' />
        <span>Run</span>
      </button>
    )
  }
  const LoadingBtn = () => {
    return (
      <button className='bg-black text-white px-6 py-2.5 rounded-lg border border-gray-700 flex items-center justify-center gap-3 font-medium animate-pulse cursor-not-allowed opacity-75' disabled={true}>
        <img src="../loading.svg" alt="loading" className='w-4 h-4 animate-spin' />
        <span>Loading...</span>
      </button>
    )
  }





  return (
    <>




      <div className='min-w-screen min-h-screen h-screen flex p-2 gap-3 overflow-y-hidden md:overflow-auto
      '>

        <div className="content_container w-full h-screen flex gap-3 md:flex-col">


          <Canvas >

            <div className='flex justify-between items-center px-4'>
              {/* Role Management Section */}
              <div className='flex flex-col md:flex-row items-center gap-2'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-gray-400'>Role:</span>
                  <span className={`px-4 py-1 rounded-full text-xs font-medium ${
                    userRole === 'editor' ? 'bg-blue-600 text-white' : 
                    userRole === 'owner' ? 'bg-yellow-600 text-white' : 
                    userRole === 'viewer' ? 'bg-gray-600 text-white' : 
                    'bg-purple-600 text-white'
                  }`}>
                    {userRole === 'owner' ? '👑 Owner' : userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </span>
                </div>
                
                {userRole === 'viewer' && !isOwner && (
                  <button
                    onClick={requestEditorRole}
                    disabled={roleRequests.some(req => req.requester === currentUser)}
                    className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                      roleRequests.some(req => req.requester === currentUser)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {roleRequests.some(req => req.requester === currentUser) 
                      ? 'Request Pending...' 
                      : 'Request Editor Role'
                    }
                  </button>
                )}
                

              </div>

              <div className='flex items-center justify-center gap-8'>

                <div className="relative">
                  <select 
                    name="language" 
                    id="language" 
                    onChange={onLanguageChange}
                    disabled={userRole !== 'editor' && userRole !== 'owner'}
                    className={`appearance-none bg-black text-gray-300 px-4 py-2.5 pr-10 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 cursor-pointer text-sm font-medium ${
                      userRole !== 'editor' && userRole !== 'owner' ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-600'
                    }`}
                  >
                    <option value="javascript" className="bg-black text-gray-300">JavaScript</option>
                    <option value="c++" className="bg-black text-gray-300">C++</option>
                    <option value="c" className="bg-black text-gray-300">C</option>
                    <option value="java" className="bg-black text-gray-300">Java</option>
                    <option value="python" className="bg-black text-gray-300">Python</option>
                    <option value="go" className="bg-black text-gray-300">Go</option>
                    <option value="php" className="bg-black text-gray-300">PHP</option>
                    <option value="HTML" className="bg-black text-gray-300">HTML</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>


                <button 
                  onClick={SaveCode} 
                  disabled={disableSave || userRole !== 'editor' && userRole !== 'owner'} 
                  className={`
                    bg-black text-white px-6 py-2.5 rounded-lg border border-gray-700 flex items-center justify-center gap-3 font-medium transition-all duration-200 ${
                      disableSave || userRole !== 'editor' && userRole !== 'owner' 
                        ? 'animate-pulse cursor-not-allowed opacity-50' 
                        : 'hover:bg-gray-900 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-900/20 active:scale-95'
                    }
                  `}
                >

                  <Save className="w-5 h-5 text-white" />
                  <span>Save</span>
                </button>
              </div>





              {currlanguage === 'HTML' ? (
                <button 
                  className={`bg-black text-white px-6 py-2.5 rounded-lg border border-gray-700 flex items-center justify-center gap-3 font-medium transition-all duration-200 ${
                    userRole !== 'editor' && userRole !== 'owner' 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-gray-900 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-900/20 active:scale-95'
                  }`}
                  onClick={null}
                  disabled={userRole !== 'editor' && userRole !== 'owner'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Build</span>
                </button>
              ) : (
                loading ? <LoadingBtn /> : (<Runbtn />)
              )}

            </div>


            <CodeEditor onChange={onCodeChange} Code={Code} language={currlanguage} isEditable={userRole === 'editor' || userRole === 'owner'} />

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


      <Navbarmeet 
        bringpreview={bringCanvas} 
        bringEdittor={bringEdittor} 
        meetid={meetid} 
        toggleChat={toggleChat}
        hasUnreadMessages={hasUnreadMessages}
        userRole={userRole}
        isOwner={isOwner}
        roleRequests={roleRequests}
      />

      <ChatModal
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setHasUnreadMessages(false);
        }}
        socket={socket}
        meetid={meetid}
        currentUser={currentUser}
        userRole={userRole}
        isOwner={isOwner}
        roleRequests={roleRequests}
      />

      <RoleRequestModal
        isOpen={isRoleRequestModalOpen}
        onClose={() => setIsRoleRequestModalOpen(false)}
        roleRequests={roleRequests}
        onApprove={handleApproveRole}
        onDeny={handleDenyRole}
        currentUser={currentUser}
      />

      {/* Room Name Prompt Modal */}
      {showRoomNamePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Name Your Chatroom</h3>
              <p className="text-sm text-gray-600">
                Give your meeting room a memorable name so it&apos;s easier to find in your profile.
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-2">
                Room Name
              </label>
              <input
                type="text"
                id="roomName"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="e.g., Team Project, Code Review, Learning Session"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={50}
              />
              <p className="text-xs text-gray-500 mt-1">
                {newRoomName.length}/50 characters
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (newRoomName.trim()) {
                    handleUpdateRoomName();
                  } else {
                    setShowRoomNamePrompt(false);
                  }
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {newRoomName.trim() ? 'Save & Continue' : 'Skip for Now'}
              </button>
              {newRoomName.trim() && (
                <button
                  onClick={() => setShowRoomNamePrompt(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Role Request Notification Badge */}
      {isOwner && roleRequests && roleRequests.length > 0 && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setShowRoleRequestCard(true)}
            className="bg-black border border-gray-700 rounded-lg shadow-2xl p-3 hover:bg-gray-900 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {roleRequests.length}
                </span>
              </div>
              <span className="text-sm font-medium text-white">Role Requests</span>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
        </div>
      )}

      {/* Floating Role Request Card */}
      {isOwner && roleRequests && roleRequests.length > 0 && showRoleRequestCard && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-black border border-gray-700 rounded-lg shadow-2xl p-4 w-80">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <h3 className="text-sm font-medium text-white">Role Requests</h3>
              </div>
              <button
                onClick={() => setShowRoleRequestCard(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Request Count */}
            <div className="mb-3">
              <span className="text-xs text-gray-300 bg-gray-800 px-2 py-1 rounded-full">
                {roleRequests.length} pending request{roleRequests.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 mb-3">
              {roleRequests.slice(0, 2).map((request, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                  <p className="text-xs text-gray-300 mb-2">
                    {request.requester} wants editor role
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        handleApproveRole(request.requester);
                        setShowRoleRequestCard(false);
                      }}
                      className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors font-medium flex-1"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleDenyRole(request.requester);
                        setShowRoleRequestCard(false);
                      }}
                      className="px-3 py-1.5 bg-gray-600 text-white text-xs rounded-lg hover:bg-gray-700 transition-colors font-medium flex-1"
                    >
                      Deny
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Manage All Button */}
            <button
              onClick={() => {
                setIsRoleRequestModalOpen(true);
                setShowRoleRequestCard(false);
              }}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm border border-gray-700"
            >
              Manage All Requests
            </button>
          </div>
        </div>
      )}

    </>


  )
}

export default Page

