'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, Send } from 'lucide-react'
import { sellerAPI } from '@/lib/sellerAPI'
import { useAuthStore } from '@/store/authStore'

const normalizeConversationId = (value) => {
  if (!value || value === 'null' || value === 'undefined') return ''
  return value
}

const formatTime = (value) => {
  if (!value) return ''
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function MessagesPage() {
  const { user } = useAuthStore()
  const [conversations, setConversations] = useState([])
  const [selectedConversationId, setSelectedConversationId] = useState('')
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')

  const loadConversations = async (preferredConversationId) => {
    setLoading(true)
    setError('')
    try {
      const response = await sellerAPI.getConversations()
      const data = response?.conversations || []
      setConversations(data)

      const nextConversationId =
        preferredConversationId ||
        selectedConversationId ||
        data[0]?._id ||
        data[0]?.id ||
        ''

      setSelectedConversationId(normalizeConversationId(nextConversationId))
      if (nextConversationId) {
        await loadMessages(normalizeConversationId(nextConversationId))
      } else {
        setMessages([])
      }
    } catch (loadError) {
      setError(loadError.message || 'Unable to load conversations')
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId) => {
    try {
      const response = await sellerAPI.getMessages(conversationId)
      setMessages(response?.messages || [])
    } catch (loadError) {
      setError(loadError.message || 'Unable to load messages')
    }
  }

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    const normalizedId = normalizeConversationId(selectedConversationId)
    if (normalizedId) {
      loadMessages(normalizedId)
    }
  }, [selectedConversationId])

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) => {
      const participant = (conversation.participants || []).find(
        (item) => (item._id || item.id) !== (user?.id || user?._id)
      )
      const label = participant?.name || participant?.businessName || ''
      return label.toLowerCase().includes(searchTerm.toLowerCase())
    })
  }, [conversations, searchTerm, user?.id, user?._id])

  const selectedConversation = filteredConversations.find(
    (conversation) => (conversation._id || conversation.id) === selectedConversationId
  ) || conversations.find((conversation) => (conversation._id || conversation.id) === selectedConversationId)

  const selectedParticipant = (selectedConversation?.participants || []).find(
    (item) => (item._id || item.id) !== (user?.id || user?._id)
  )

  const handleSend = async () => {
    const message = draft.trim()
    if (!message || !selectedConversation || !selectedParticipant) return

    setSending(true)
    setError('')
    try {
      await sellerAPI.sendMessage({
        receiverId: selectedParticipant._id || selectedParticipant.id,
        vehicleId: selectedConversation.vehicle?._id || selectedConversation.vehicle?.id,
        conversationId: normalizeConversationId(selectedConversationId) || undefined,
        message,
      })
      setDraft('')
      await loadConversations(selectedConversationId)
    } catch (sendError) {
      setError(sendError.message || 'Unable to send message')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="h-screen flex flex-col -m-6">
      <div className="flex flex-1 bg-white">
        {/* Chat List */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">
                {loading ? 'Loading conversations...' : 'No buyer messages yet.'}
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const id = conversation._id || conversation.id
                const participant = (conversation.participants || []).find(
                  (item) => (item._id || item.id) !== (user?.id || user?._id)
                )
                const avatar = participant?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(participant?.name || 'Buyer')}`

                return (
                  <div
                    key={id}
                    onClick={() => setSelectedConversationId(id)}
                    className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition ${
                      selectedConversationId === id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={avatar}
                        alt={participant?.name || 'Buyer'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-gray-900 truncate">{participant?.name || 'Buyer'}</p>
                          <p className="text-xs text-gray-500 shrink-0">{formatTime(conversation.lastUpdated || conversation.updatedAt)}</p>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage || 'Open conversation'}</p>
                        {conversation.vehicle && (
                          <p className="mt-1 text-xs text-gray-500 truncate">
                            {conversation.vehicle.brand} {conversation.vehicle.model} {conversation.vehicle.year}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{selectedParticipant?.name || 'Buyer'}</p>
                  <p className="text-xs text-gray-500">
                    {selectedConversation.vehicle
                      ? `${selectedConversation.vehicle.brand} ${selectedConversation.vehicle.model} ${selectedConversation.vehicle.year}`
                      : 'General conversation'}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {error && <div className="text-sm text-red-600">{error}</div>}
                {messages.map((item) => {
                  const isMine = (item.sender?._id || item.sender?.id || item.sender) === (user?.id || user?._id)

                  return (
                    <div key={item._id || item.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`${isMine ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'} px-4 py-2 rounded-lg max-w-xs`}>
                        <p>{item.message}</p>
                        <p className={`mt-2 text-xs ${isMine ? 'text-blue-100' : 'text-gray-500'}`}>{formatTime(item.createdAt)}</p>
                      </div>
                    </div>
                  )
                })}
                {!loading && messages.length === 0 && (
                  <div className="text-sm text-gray-500">No messages yet. Reply to start the chat.</div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-3">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSend}
                    disabled={sending || !draft.trim()}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center px-6 text-center text-gray-500">
              Buyer conversations will appear here once someone starts a chat from a vehicle page.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
