'use client'

import { useState, useEffect } from 'react'
import {
    CalendarDays,
    Image as ImageIcon,
    UtensilsCrossed,
    Users,
    Save
} from 'lucide-react'
import { Plus, Calendar, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import BackButton from '@/components/backButton/BackButton'

export default function NewEventPage() {
    const router = useRouter()

    const [eventName, setEventName] = useState('')
    const [eventImage, setEventImage] = useState<string | null>(null)
    const [date, setDate] = useState('')
    const [votingDeadline, setVotingDeadline] = useState('')
    const [location, setLocation] = useState('')
    const [time, setTime] = useState('')
    const [newCategory, setNewCategory] = useState('')
    const [showDraftSavedModal, setShowDraftSavedModal] = useState(false)
    const [showEventCreatedModal, setShowEventCreatedModal] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [categories, setCategories] = useState([
        { name: 'Antipasti', count: 0, selected: false },
        { name: 'Primi', count: 0, selected: false },
        { name: 'Secondi', count: 0, selected: false }
    ])
    const [participants, setParticipants] = useState(['MS', 'SS', 'BB'])
    const [showPopup, setShowPopup] = useState(false)
    const [showParticipantModal, setShowParticipantModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [showHelp, setShowHelp] = useState(false)

    const mockUsers = [
        { id: 1, name: 'Alice Rossi', email: 'alice@example.com', initials: 'AR' },
        { id: 2, name: 'Marco Bianchi', email: 'marco@example.com', initials: 'MB' },
        { id: 3, name: 'Sara Verdi', email: 'sara@example.com', initials: 'SV' },
        { id: 4, name: 'Luca Neri', email: 'luca@example.com', initials: 'LN' }
    ]

    useEffect(() => {
        const savedDraft = localStorage.getItem('eventDraft')
        if (savedDraft) {
            const draft = JSON.parse(savedDraft)
            setEventName(draft.eventName || '')
            setDate(draft.date || '')
            setVotingDeadline(draft.votingDeadline || '')
            setLocation(draft.location || '')
            setTime(draft.time || '')
            setCategories(draft.categories || [])
            setParticipants(draft.participants || [])
            setEventImage(draft.eventImage || null)
        }
    }, [])

    const handleAddCategory = () => {
        if (newCategory.trim() && !categories.find(cat => cat.name === newCategory)) {
            setCategories([...categories, { name: newCategory, count: 1, selected: true }])
            setNewCategory('')
        }
    }

    const handleCancel = () => {
        setShowCancelModal(true)
    }

    const handleCreateEvent = () => {
        localStorage.removeItem('eventDraft')
        setShowEventCreatedModal(true)
    }

    const handleSaveDraft = () => {
        const draft = {
            eventName,
            date,
            votingDeadline,
            location,
            time,
            categories,
            participants,
            eventImage
        }
        localStorage.setItem('eventDraft', JSON.stringify(draft))
        setShowDraftSavedModal(true)
    }

    const handleClosePopup = () => {
        setShowPopup(false)
        router.push('/home')
    }

    return (
        <div className="min-h-screen px-6 pt-6 pb-28 bg-white text-black relative">
            <BackButton />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-center w-full">New Event</h1>
                <button
                    onClick={() => setShowHelp(true)}
                    className="absolute top-6 right-6 bg-gray-200 hover:bg-gray-300 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold"
                >
                    ?
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="font-semibold text-sm">Event Name</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        value={eventName}
                        onChange={e => setEventName(e.target.value)}
                        placeholder="e.g., Birthday Dinner"
                    />
                </div>

                <div>
                    <label className="font-semibold text-sm block mb-1">Event Image</label>
                    <label
                        htmlFor="event-image"
                        className="cursor-pointer text-sm inline-block hover:bg-gray-300"
                        style={{
                            background: 'lightgray',
                            padding: '4px',
                            borderRadius: '4px',
                            border: '1px solid lightgray'
                        }}
                    >
                        Choose File
                    </label>
                    <input
                        id="event-image"
                        type="file"
                        accept="image/*"
                        onChange={e => {
                            const file = e.target.files?.[0]
                            if (file) {
                                const reader = new FileReader()
                                reader.onloadend = () => setEventImage(reader.result as string)
                                reader.readAsDataURL(file)
                            }
                        }}
                        className="hidden"
                    />
                    {eventImage && (
                        <img
                            src={eventImage}
                            alt="Event preview"
                            className="mt-2 w-full h-32 object-cover rounded border"
                        />
                    )}
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="font-semibold text-sm">Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />
                            <Calendar className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                        </div>
                    </div>

                    <div className="flex-1">
                        <label className="font-semibold text-sm">Voting Deadline</label>
                        <div className="relative">
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                                value={votingDeadline}
                                onChange={e => setVotingDeadline(e.target.value)}
                            />
                            <Calendar className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="font-semibold text-sm">Location</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        placeholder="e.g., Rome, Italy"
                    />
                </div>

                <div>
                    <label className="font-semibold text-sm">Time</label>
                    <input
                        type="time"
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        value={time}
                        onChange={e => setTime(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="mt-8">
                <label className="font-semibold text-sm block mb-2">Categories</label>
                <div className="space-y-2">
                    {categories.map((cat, i) => (
                        <div
                            key={i}
                            className={`flex items-center justify-between px-2 py-1 rounded ${!cat.selected ? 'opacity-50' : ''}`}
                        >
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={cat.selected}
                                    onChange={() => {
                                        const updated = [...categories]
                                        updated[i].selected = !updated[i].selected
                                        updated[i].count = updated[i].selected ? Math.max(1, updated[i].count) : 0
                                        setCategories(updated)
                                    }}
                                />
                                {cat.name}
                            </label>
                            <div className="flex items-center border rounded overflow-hidden">
                                <button
                                    type="button"
                                    disabled={!cat.selected}
                                    onClick={() => {
                                        const updated = [...categories]
                                        updated[i].count = Math.max(0, updated[i].count - 1)
                                        setCategories(updated)
                                    }}
                                    className={`px-2 ${cat.selected ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 cursor-not-allowed'}`}
                                >
                                    −
                                </button>
                                <span className="px-4">{cat.count}</span>
                                <button
                                    type="button"
                                    disabled={!cat.selected}
                                    onClick={() => {
                                        const updated = [...categories]
                                        updated[i].count = updated[i].count + 1
                                        setCategories(updated)
                                    }}
                                    className={`px-2 ${cat.selected ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 cursor-not-allowed'}`}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded px-3 py-2"
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                        placeholder="Add Category"
                    />
                    <button
                        type="button"
                        onClick={handleAddCategory}
                        className="bg-gray-300 rounded-full p-2 hover:bg-gray-400"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Participants */}
            <div className="mt-8">
                <label className="font-semibold text-sm block mb-2">Participants</label>
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={() => setShowParticipantModal(true)}
                        className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-black"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                    {participants.map((p, i) => (
                        <div
                            key={i}
                            className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-medium"
                        >
                            {p}
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-2">
                <button
                    className="w-full bg-[#DB9A18] hover:bg-[#600800] text-white font-semibold py-3 rounded flex items-center justify-center gap-2"
                    onClick={handleCreateEvent}
                >
                    <Check className="w-5 h-5" />
                    Confirm
                </button>
                <button
                    className="w-full border border-gray-400 text-gray-800 font-semibold py-3 rounded hover:bg-gray-100"
                    onClick={handleSaveDraft}
                >
                    Save as Draft
                </button>

                <button
                    className="w-full text-red-600 font-semibold py-3 rounded hover:bg-red-50"
                    onClick={handleCancel}
                >
                    Cancel
                </button>
            </div>

            {showHelp && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md px-6 pt-12 text-white">
                    <div className="space-y-6 max-w-xl mx-auto">
                        <div>
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <CalendarDays className="w-4 h-4" />
                                Enter Event Information
                            </h2>
                            <p className="text-sm">Fill out the required fields: event name, date, time, and location.</p>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                Add an Image (Optional)
                            </h2>
                            <p className="text-sm">Upload a photo to use as the event’s background image.</p>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <UtensilsCrossed className="w-4 h-4" />
                                Choose Dish Categories
                            </h2>
                            <p className="text-sm">
                                Select the types of dishes (e.g., starters, mains) and set how many options should be available. <br />
                                <span className="font-semibold text-white">
                                    The number of votes each participant can cast is based on these counts.
                                </span>
                            </p>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Add Participants
                            </h2>
                            <p className="text-sm">Search for users by name or email and invite them to join and vote.</p>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Save className="w-4 h-4" />
                                Save as Draft
                            </h2>
                            <p className="text-sm">
                                You can save your event as a <strong>draft</strong> at any time and finish it later. It will be stored in your browser.
                            </p>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowHelp(false)}
                                className="bg-white text-black px-4 py-2 rounded font-medium hover:bg-gray-100"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showParticipantModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-3">Add Participant</h2>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search by name or email"
                            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                        />
                        <div className="max-h-60 overflow-y-auto space-y-2">
                            {mockUsers
                                .filter(user =>
                                    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map(user => (
                                    <div key={user.id} className="flex justify-between items-center border rounded px-3 py-2">
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (!participants.includes(user.initials)) {
                                                    setParticipants(prev => [...prev, user.initials])
                                                }
                                                setShowParticipantModal(false)
                                                setSearchTerm('')
                                            }}
                                            className="text-sm text-blue-600 hover:underline"
                                        >
                                            Add
                                        </button>
                                    </div>
                                ))}
                            {searchTerm &&
                                mockUsers.filter(user =>
                                    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
                                ).length === 0 && (
                                    <p className="text-sm text-gray-500">No users found.</p>
                                )}
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => {
                                    setShowParticipantModal(false)
                                    setSearchTerm('')
                                }}
                                className="text-gray-600 hover:underline"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showCancelModal && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-black">
                        <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
                        <p className="text-sm text-gray-700 mb-6">
                            If you cancel now, all unsaved changes will be lost. Do you really want to continue?
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                            >
                                No, go back
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('eventDraft')
                                    router.push('/home')
                                }}
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
                            >
                                Yes, cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showDraftSavedModal && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg text-black">
                        <h2 className="text-lg font-semibold mb-4">Draft Saved!</h2>
                        <p className="text-sm text-gray-700 mb-6">
                            Your event draft has been saved in your browser. You can return later to complete it.
                        </p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => {
                                    setShowDraftSavedModal(false)
                                    router.push('/home')
                                }}
                                className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-900 text-sm"
                            >
                                Go to Home
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showEventCreatedModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg text-black">
                        <h2 className="text-lg font-semibold mb-4">Event Created!</h2>
                        <p className="text-sm text-gray-700 mb-6">
                            Your event has been successfully created. You can now return to the homepage to view it.
                        </p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => {
                                    setShowEventCreatedModal(false)
                                    router.push('/home')
                                }}
                                className="px-4 py-2 rounded bg-[#DB9A18] hover:bg-[#600800] text-white text-sm"
                            >
                                Go to Home
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>

    )
}
