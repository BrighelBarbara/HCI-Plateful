'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import BackButton from '@/components/backButton/BackButton'
import {
  Calendar,
  MapPin,
  MoreVertical,
  User,
  List,
  ChevronRight
} from 'lucide-react'

export default function EventDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  const [event] = useState({
    title: 'Birthday Party',
    date: '2025-12-25',
    time: '19:00',
    location: 'Rome',
    categories: ['Antipasti', 'Primi', 'Secondi'],
    participants: [
      { initials: 'MS', name: 'Martina Stivala' },
      { initials: 'BB', name: 'Barbara Brighel' },
      { initials: 'SS', name: 'Sara Santilli' }
    ],
    votingDeadline: '2025-07-10T23:59:00'
  })

  const [openPopup, setOpenPopup] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isVotingClosed, setIsVotingClosed] = useState(false)
  const [countdown, setCountdown] = useState('')
  const [cancelReason, setCancelReason] = useState('')
  useEffect(() => {
    const interval = setInterval(() => {
      const deadline = new Date(event.votingDeadline).getTime()
      const now = new Date().getTime()
      const distance = deadline - now

      if (distance <= 0) {
        setCountdown('Voting has ended')
        setIsVotingClosed(true)
        clearInterval(interval)
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`)
    }, 1000)

    return () => clearInterval(interval)
  }, [event.votingDeadline])

  return (
    <div className="min-h-screen bg-white pb-28 px-6 pt-6 text-black relative">
      <BackButton />

      <div className="flex justify-center items-center mb-2">
        <h1 className="text-3xl text-center font-bold">{event.title}</h1>
      </div>

      {/* ✅ Countdown Voting Deadline */}
      {!isVotingClosed && (
        <div className="text-center text-red-600 font-semibold text-sm mb-4">
          Voting ends in: {countdown}
        </div>
      )}

      <div className="flex justify-center items-center mb-4">
        <div className="absolute right-4">
          <button onClick={() => setOpenPopup(prev => !prev)}>
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
          {openPopup && (
            <div className="absolute right-0 mt-2 bg-white border shadow text-sm rounded z-20">
              <button
                onClick={() => {
                  setShowModal(true)
                  setOpenPopup(false)
                }}
                className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Cancel Participation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Event Info */}
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="w-4 h-4 text-gray-600" />
        <p className="text-sm text-gray-700">
          Date: <span className="font-medium">{event.date}</span>
        </p>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Calendar className="w-4 h-4 text-gray-600" />
        <p className="text-sm text-gray-700">
          Time: <span className="font-medium">{event.time}</span>
        </p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <MapPin className="w-4 h-4 text-gray-600" />
        <p className="text-sm text-gray-700">
          Location: <span className="font-medium">{event.location}</span>
        </p>
      </div>

      {/* Voting or Menu/Shopping */}
      {isVotingClosed ? (
        <div className="space-y-3 mb-6">
          <Link
            href={`/event/${id}/menu`}
            className="w-full bg-[#0099ff] text-white py-3 rounded-md font-semibold flex items-center justify-between px-4"
          >
            <span className="flex items-center gap-2">
              <List className="w-5 h-5" />
              Menu
            </span>
            <ChevronRight className="w-5 h-5" />
          </Link>

          <Link href={`/event/${id}/shopping-list`}>
            <button className="w-full bg-gray-200 rounded p-4 font-semibold flex justify-between items-center mt-4">
              🛒 Shopping List
              <span className="text-xl text-[#7C0A02]">&rsaquo;</span>
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {event.categories.map((category, index) => (
            <button
              key={index}
              onClick={() => router.push(`/event/${id}/category/${category.toLowerCase()}`)}
              className="w-full bg-gray-200 rounded p-4 font-semibold flex justify-between items-center"
            >
              {category}
              <span className="text-xl text-[#7C0A02]">&rsaquo;</span>
            </button>
          ))}
        </div>
      )}

      {/* Participants */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-5 h-5 text-gray-600" />
          <p className="font-semibold text-base">Participants:</p>
        </div>
        <ul className="space-y-2 mt-2">
          {event.participants.map((p, i) => (
            <li key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {p.initials}
              </div>
              <span className="text-sm">{p.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <p className="text-sm text-gray-800 mb-3">
              Are you sure you want to cancel your participation?
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Optionally, let the organizer know why you’re leaving:
            </p>

            <textarea
              placeholder="Type your reason here..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded p-2 text-sm mb-4"
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 px-4 py-2 rounded hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Cancellation reason:', cancelReason) // Replace with API call later
                  alert('Participation canceled.' + (cancelReason ? `\n\nReason: ${cancelReason}` : ''))
                  setShowModal(false)
                  setCancelReason('')
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
