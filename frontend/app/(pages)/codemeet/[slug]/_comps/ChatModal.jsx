'use client'
import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const ChatModal = ({ isOpen, onClose, socket, meetid, currentUser, userRole, isOwner, roleRequests, isChatOpen, setIsChatOpen }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;
    
    if (!socket) {
      toast.error('Connection not ready. Please wait a moment.');
      return;
    }

    // Load previous messages from database
    const loadPreviousMessages = async () => {
      try {
        const response = await axios.post('/api/meetings/getmeetdetails', { 
          meetId: meetid,
          username: currentUser 
        });
        const { meeting } = response.data;
        
        if (meeting.messages && meeting.messages.length > 0) {
          const formattedMessages = meeting.messages.map(msg => ({
            content: msg.content,
            user: msg.user,
            timestamp: msg.timestamp
          }));
          setMessages(formattedMessages);
        } else {
          // Add welcome message if no previous messages
          setMessages([{
            type: 'system',
            content: '👋 Welcome to the team chat! Start typing to collaborate with your team.',
            timestamp: new Date().toISOString()
          }]);
        }
      } catch (error) {
        console.log('Error loading messages:', error);
        // Add welcome message if API fails
        setMessages([{
          type: 'system',
          content: '👋 Welcome to the team chat! Start typing to collaborate with your team.',
          timestamp: new Date().toISOString()
        }]);
      }
    };

    loadPreviousMessages();

    // Listen for incoming messages
    socket.on('chatMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for user join/leave notifications
    socket.on('userJoined', (user) => {
      setMessages(prev => [...prev, {
        type: 'system',
        content: `👋 ${user.name} joined the chat`,
        timestamp: new Date().toISOString()
      }]);
    });

    socket.on('userLeft', (user) => {
      setMessages(prev => [...prev, {
        type: 'system',
        content: `👋 ${user.name} left the chat`,
        timestamp: new Date().toISOString()
      }]);
    });

    // Listen for typing indicators
    socket.on('typing', (data) => {
      if (data.user !== currentUser) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    // Listen for online users update
    socket.on('onlineUsers', (users) => {
      setOnlineUsers(users);
    });

    // Request online users
    socket.emit('getOnlineUsers', { slug: meetid });
    
    // Set loading to false after a short delay
    setTimeout(() => setIsLoading(false), 500);

    return () => {
      socket.off('chatMessage');
      socket.off('userJoined');
      socket.off('userLeft');
      socket.off('typing');
      socket.off('onlineUsers');
    };
  }, [socket, isOpen, meetid, currentUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) {
      toast.error('Connection not ready. Please wait a moment.');
      return;
    }

    const messageData = {
      content: newMessage.trim(),
      user: currentUser,
      timestamp: new Date().toISOString(),
      slug: meetid
    };

    // Save message to database
    try {
      await axios.post('/api/meetings/savemessage', {
        meetId: meetid,
        content: messageData.content,
        user: messageData.user,
        timestamp: messageData.timestamp
      });
    } catch (error) {
      console.log('Error saving message:', error);
      toast.error('Failed to save message');
    }

    socket.emit('sendMessage', messageData);
    
    // Add the message to local state immediately for instant feedback
    setMessages(prev => [...prev, messageData]);
    setNewMessage('');
  };

  const handleTyping = () => {
    if (socket) {
      socket.emit('typing', { user: currentUser, slug: meetid });
    }
  };

  const assignRoleToUser = (username, newRole) => {
    if (!isOwner) return;
    
    // Notify other users via socket
    socket.emit('assignRole', { slug: meetid, targetUserId: username, newRole });

    
          // Refresh online users to show updated roles
      setTimeout(() => {
        socket.emit('getOnlineUsers', { slug: meetid });
      }, 1000);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-gray-800 rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
            <h2 className="text-lg font-semibold text-white">Team Chat</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300 bg-gray-800 px-2 py-1 rounded-full">
                {onlineUsers.length} online
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                userRole === 'editor' ? 'bg-blue-600 text-white' : 
                userRole === 'viewer' ? 'bg-gray-700 text-white' : 
                'bg-gray-600 text-white'
              }`}>
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </span>
              {isOwner && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-600 text-white">
                  👑 Owner
                </span>
              )}

            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Online Users Sidebar */}
          <div className="w-64 bg-gray-900 border-r border-gray-800 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-white">Online Users</h3>
              </div>
  
            </div>
            <div className="space-y-2">
              {onlineUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">
                        {user.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'editor' ? 'bg-blue-600 text-white' : 
                          user.role === 'viewer' ? 'bg-gray-600 text-white' : 
                          'bg-gray-700 text-white'
                        }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                        {user.isOwner && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-600 text-white">
                            👑 Owner
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Role Management Controls for Owners */}
                  {isOwner && user.name !== currentUser && (
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => assignRoleToUser(user.name, 'editor')}
                        className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all duration-200 ${
                          user.role === 'editor' 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                            : 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-white'
                        }`}
                        title="Toggle Editor Role"
                      >
                        {user.role === 'editor' ? '✓ Editor' : 'Make Editor'}
                      </button>
                      <button
                        onClick={() => assignRoleToUser(user.name, 'viewer')}
                        className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all duration-200 ${
                          user.role === 'viewer' 
                            ? 'bg-gray-600 text-white shadow-lg shadow-gray-600/25' 
                            : 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-white'
                        }`}
                        title="Toggle Viewer Role"
                      >
                        {user.role === 'viewer' ? '✓ Viewer' : 'Make Viewer'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Role Requests Section for Owners */}
              {isOwner && roleRequests && roleRequests.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <h4 className="text-sm font-medium text-white mb-3">
                    📝 Pending Role Requests
                  </h4>
                  <div className="space-y-2">
                    {roleRequests.map((request, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                        <p className="text-xs text-gray-300 mb-2">
                          {request.requester} wants editor role
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => assignRoleToUser(request.requester, 'editor')}
                            className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => assignRoleToUser(request.requester, 'viewer')}
                            className="px-3 py-1.5 bg-gray-600 text-white text-xs rounded-lg hover:bg-gray-700 transition-colors font-medium"
                          >
                            Deny
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-black">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoading && (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-700 border-t-blue-500"></div>
                </div>
              )}
              {!isLoading && messages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'system' ? 'justify-center' : ''}`}>
                  {message.type === 'system' ? (
                    <div className="text-xs text-gray-400 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
                      {message.content}
                    </div>
                  ) : (
                    <div className={`flex flex-col max-w-[70%] ${message.user === currentUser ? 'ml-auto items-end' : 'items-start'}`}>
                      <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                        message.user === currentUser 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-800 text-white border border-gray-700'
                      }`}>
                        <div className="text-sm font-medium mb-1.5 text-xs">
                          {message.user === currentUser ? 'You' : message.user}
                        </div>
                        <div className="text-sm leading-relaxed">{message.content}</div>
                      </div>
                      <div className="text-xs text-gray-400 mt-2 px-1">
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-center gap-3 text-gray-400 text-sm px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="font-medium text-gray-300">Someone is typing...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-gray-800 bg-gray-900">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleTyping}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
