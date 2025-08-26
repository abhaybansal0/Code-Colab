'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Trash2, Edit3, Plus, Calendar, Users, Code, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState(null)
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingMeeting, setEditingMeeting] = useState(null)
  const [newRoomName, setNewRoomName] = useState('')

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async (forceRefresh = false) => {
    try {
      // Check cache first (unless forcing refresh)
      if (!forceRefresh) {
        const cachedProfile = localStorage.getItem('cachedProfile')
        const cachedMeetings = localStorage.getItem('cachedMeetings')
        const cacheTimestamp = localStorage.getItem('profileCacheTimestamp')

        // Cache is valid for 5 minutes
        if (cachedProfile && cachedMeetings && cacheTimestamp &&
          (Date.now() - parseInt(cacheTimestamp)) < 5 * 60 * 1000) {
          setUserInfo(JSON.parse(cachedProfile))
          setMeetings(JSON.parse(cachedMeetings))
          setLoading(false)
          return
        }
      }

      // Use cookies instead of Authorization header
      const response = await axios.get('/api/user/profile', {
        withCredentials: true // This ensures cookies are sent
      })

      // Cache the data
      localStorage.setItem('cachedProfile', JSON.stringify(response.data.user))
      localStorage.setItem('cachedMeetings', JSON.stringify(response.data.meetings))
      localStorage.setItem('profileCacheTimestamp', Date.now().toString())

      setUserInfo(response.data.user)
      setMeetings(response.data.meetings)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile')
      setLoading(false)
    }
  }

  const handleDeleteMeeting = async (meetId) => {
    if (!confirm('Are you sure you want to delete this meeting? This action cannot be undone.')) {
      return
    }

    try {
      await axios.delete('/api/meetings/deletemeeting', {
        data: { meetId },
        withCredentials: true
      })

      toast.success('Meeting deleted successfully')
      const updatedMeetings = meetings.filter(meeting => meeting.meetId !== meetId)
      setMeetings(updatedMeetings)

      // Update cache
      localStorage.setItem('cachedMeetings', JSON.stringify(updatedMeetings))
    } catch (error) {
      console.error('Error deleting meeting:', error)
      toast.error('Failed to delete meeting')
    }
  }

  const handleUpdateRoomName = async (meeting) => {
    if (!newRoomName.trim()) {
      toast.error('Room name cannot be empty')
      return
    }

    try {
      await axios.put('/api/meetings/updateroomname', {
        meetId: meeting.meetId,
        roomName: newRoomName.trim()
      }, {
        withCredentials: true
      })

      toast.success('Room name updated successfully')
      const updatedMeetings = meetings.map(m =>
        m.meetId === meeting.meetId
          ? { ...m, roomName: newRoomName.trim() }
          : m
      )
      setMeetings(updatedMeetings)

      // Update cache
      localStorage.setItem('cachedMeetings', JSON.stringify(updatedMeetings))

      setEditingMeeting(null)
      setNewRoomName('')
    } catch (error) {
      console.error('Error updating room name:', error)
      toast.error('Failed to update room name')
    }
  }

  const startEditing = (meeting) => {
    setEditingMeeting(meeting)
    setNewRoomName(meeting.roomName || 'Untitled Room')
  }

  const cancelEditing = () => {
    setEditingMeeting(null)
    setNewRoomName('')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-500"></div>
      </div>
    )
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Profile Not Found</h1>
          <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 sm:px-8 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-800 border border-gray-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {userInfo.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{userInfo.username}</h1>
                <p className="text-gray-400">
                  {userInfo.admin ? '👑 Administrator' : '👤 User'}
                </p>
              </div>
            </div>
            <div className="flex sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={() => fetchUserProfile(true)}
                className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <Link
                href="/"
                className="bg-black text-white border border-gray-800 px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors font-medium text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 sm:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 md:grid-cols-1 gap-6 mb-8">
          <div className="bg-black border border-gray-500 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-800 rounded-lg">
                <Code className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Meetings</p>
                <p className="text-2xl font-bold text-white">{meetings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-black border border-gray-500 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-800 rounded-lg">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Active Rooms</p>
                <p className="text-2xl font-bold text-white">
                  {meetings.filter(m => m.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-black border border-gray-500 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-800 rounded-lg">
                <MessageSquare className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Messages</p>
                <p className="text-2xl font-bold text-white">
                  {meetings.reduce((total, m) => total + (m.messageCount || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-black border border-gray-500 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-800 rounded-lg">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Member Since</p>
                <p className="text-2xl font-bold text-white">
                  {new Date(userInfo.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Meetings Section */}
        <div className="bg-black border border-gray-800 rounded-lg">
          <div className="px-6 py-4 ">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Your Meeting Rooms</h2>
              <Link
                href="/"
                className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create New Room
              </Link>
            </div>
          </div>

          {meetings.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="w-24 h-24 bg-gray-800 border border-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No meetings yet</h3>
              <p className="text-gray-400 mb-6">Create your first meeting room to start collaborating!</p>
              <Link
                href="/"
                className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Create Meeting
              </Link>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-1 gap-6">
                {meetings.map((meeting) => (
                  <div key={meeting.meetId} className="bg-black border border-gray-500 rounded-lg p-4 md:p-6 hover:border-gray-400 transition-colors">
                    {/* Meeting Header */}
                    <div className="flex flex-col md:flex-row items-start justify-between mb-4 gap-3">
                      <div className="flex-1">
                        {editingMeeting?.meetId === meeting.meetId ? (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={newRoomName}
                              onChange={(e) => setNewRoomName(e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter room name"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateRoomName(meeting)}
                                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                              >
                                ✓
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ) : (
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {meeting.roomName || 'Untitled Room'}
                          </h3>
                        )}
                        <p className="text-sm text-gray-400">ID: {meeting.meetId}</p>
                      </div>

                      {meeting.adminId === userInfo._id && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditing(meeting)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit room name"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMeeting(meeting.meetId)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete meeting"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Meeting Info */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="h-4 w-4 mr-2" />
                        Created: {new Date(meeting.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Users className="h-4 w-4 mr-2" />
                        Editors: {meeting.editors?.length || 0}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Messages: {meeting.messages?.length || 0}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link
                        href={`/codemeet/${meeting.meetId}?myname=${userInfo.username}`}
                        className="flex-1 bg-white text-black text-center py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      >
                        Join Room
                      </Link>
                      {meeting.adminId === userInfo._id && (
                        <span className="px-3 py-2 bg-gray-800 text-gray-200 border border-gray-500 text-sm rounded-lg font-medium text-center">
                          Owner
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
