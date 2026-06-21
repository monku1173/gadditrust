'use client'

import { Send, Search } from 'lucide-react'
import { useState } from 'react'

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(1)

  const chats = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      message: 'Is this car available?',
      time: '5m ago',
      unread: 2,
      avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar',
    },
    {
      id: 2,
      name: 'Priya Singh',
      message: 'What is the mileage?',
      time: '1h ago',
      unread: 0,
      avatar: 'https://ui-avatars.com/api/?name=Priya+Singh',
    },
    {
      id: 3,
      name: 'Amit Patel',
      message: 'Can you provide more photos?',
      time: '2h ago',
      unread: 0,
      avatar: 'https://ui-avatars.com/api/?name=Amit+Patel',
    },
  ]

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
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition ${
                  selectedChat === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900">{chat.name}</p>
                      <p className="text-xs text-gray-500">{chat.time}</p>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{chat.message}</p>
                  </div>
                  {chat.unread > 0 && (
                    <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {selectedChat && (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Rajesh Kumar</p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg max-w-xs">
                    Is this Honda City still available?
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-lg max-w-xs">
                    Yes, it's available. Would you like to schedule a test drive?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg max-w-xs">
                    Yes, please. When are you available?
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
