'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState } from 'react'
import { Plus, AlertCircle, Star } from 'lucide-react'
import './../../../../globals.css'
import BackButton from '@/components/backButton/BackButton'

export default function CategoryPage() {
  const { id, categoryId } = useParams()
  const router = useRouter()

  const maxVotes = 2
  const [votedProposals, setVotedProposals] = useState<number[]>([])
  const [votes, setVotes] = useState<{ [key: number]: number }>({
    1: 10,
    2: 8,
    3: 4
  })

  const [allergens, setAllergens] = useState<number[]>([])
  const [showHelp, setShowHelp] = useState(false)

  const proposals = [
    {
      id: 1,
      title: 'Meatballs',
      image: '/meatballs.webp',
      description: 'Lorem ipsum dolor sit amet...',
      ingredients: ['Ingredient 1', 'Ingr. 2', 'Ingredient 3'],
      hasAllergen: false,
      mostVoted: true
    },
    {
      id: 2,
      title: 'Rice Salad',
      image: '/insalata-riso.jpg',
      description: 'Lorem ipsum dolor sit amet...',
      ingredients: ['Ingredient 1', 'Ingr. 2', 'Ingredient 3', 'Ingredient 4'],
      hasAllergen: true,
    },
    {
      id: 3,
      title: 'Salmon Rolls',
      image: '/salmon.jpeg',
      description: 'Lorem ipsum dolor sit amet...',
      ingredients: ['Ingredient 1', 'Ingr. 2', 'Ingredient 3'],
      hasAllergen: true,
    }
  ]


  const handleVoteToggle = (proposalId: number) => {
    if (votedProposals.includes(proposalId)) {
      setVotedProposals(votedProposals.filter(id => id !== proposalId))
      setVotes(prev => ({ ...prev, [proposalId]: prev[proposalId] - 1 }))
    } else if (votedProposals.length < maxVotes) {
      setVotedProposals([...votedProposals, proposalId])
      setVotes(prev => ({ ...prev, [proposalId]: prev[proposalId] + 1 }))
    }
  }

  const handleNewProposal = () => {
    router.push(`/event/${id}/category/${categoryId}/new-proposal`)
  }

  const handleAllergyToggle = (proposalId: number) => {
    if (allergens.includes(proposalId)) {
      setAllergens(prev => prev.filter(id => id !== proposalId))
    } else {
      setAllergens(prev => [...prev, proposalId])
    }
  }

  const handleProposalClick = (proposalId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/event/${id}/category/${categoryId}/proposal/${proposalId}`)
  }

  return (
    <div className="min-h-screen px-6 pt-6 pb-28 bg-white text-black">
      <BackButton />

      <div className="flex justify-end mb-2">
        <button
          onClick={() => setShowHelp(true)}
          className="bg-gray-200 hover:bg-gray-300 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold"
        >
          ?
        </button>
      </div>

      <h1 className="text-3xl font-bold text-center mb-1 capitalize">{categoryId}</h1>
      <div className="text-center mb-6">
        <p className="text-[#7C0A02] font-medium">
          Votes: {votedProposals.length} / {maxVotes}
        </p>
        {votedProposals.length >= maxVotes && (
          <p className="text-red-600 text-sm font-medium mt-1">
            You’ve reached the maximum number of votes
          </p>
        )}
      </div>

      <div className="space-y-4">
        {proposals.map((proposal) => {
          const isVoted = votedProposals.includes(proposal.id)

          return (
            <div
              key={proposal.id}
              className={`border p-4 relative proposal-card hover:bg-gray-50 transition`}
              style={{ cursor: 'pointer' }}
            >
              <div className='flex items-center alert-svg'>
                {(proposal.hasAllergen || allergens.includes(proposal.id)) && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="red" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" fill="red"></circle>
                    <line x1="12" x2="12" y1="8" y2="12" stroke="black"></line>
                    <line x1="12" x2="12.01" y1="16" y2="16" stroke="black"></line>
                  </svg>
                )}
                {proposal.mostVoted && (
                  <span className="text-sm text-red-600 flex items-center gap-1 font-semibold">
                    <Star className="w-6 h-6 fill-yellow-500 text-white" />
                  </span>
                )}
              </div>

              <div className="flex gap-4 mb-2 flex-image-title-proposal">
                <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0 bg-gray-200">
                  {proposal.image ? (
                    <img
                      src={proposal.image}
                      alt={proposal.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300" />
                  )}
                </div>

                <div className="flex-1 flex-image-title-right">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="font-bold text-lg">{proposal.title}</h2>
                  </div>
                  <div className="flex overflow-x-auto space-x-2 scrollbar-hide mt-2 pb-1">
                    {proposal.ingredients.map((ingr, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-200 px-3 py-1 rounded text-xs whitespace-nowrap shrink-0"
                      >
                        {ingr}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex p-right-20 items-center justify-between mt-3">
                <p className="text-sm text-gray-500">{votes[proposal.id] || 0} votes</p>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1 text-red-600 text-sm font-medium" style={{ fontSize: '13px' }}>
                    Report Allergy
                    <input
                      type="checkbox"
                      checked={allergens.includes(proposal.id)}
                      onChange={() => handleAllergyToggle(proposal.id)}
                    />
                  </label>
                  <label className="flex items-center gap-1 text-sm font-medium" style={{ fontSize: '13px' }}>
                    Vote
                    <input
                      type="checkbox"
                      checked={votedProposals.includes(proposal.id)}
                      onChange={() => handleVoteToggle(proposal.id)}
                    />
                  </label>
                </div>
              </div>
              <div className="mt-4 text-right button-details-container">
                <button
                  onClick={(e) => handleProposalClick(proposal.id, e)}
                  className="button-details text-sm text-black hover:text-black"
                >
                  VIEW DETAILS
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                    <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={handleNewProposal}
        className="mt-8 w-full bg-[#aa54ab] text-white py-3 rounded-md font-semibold flex items-center justify-center gap-2 text-lg"
      >
        <Plus className="w-5 h-5" />
        Add new proposal
      </button>

      {showHelp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md px-6 pt-12 text-white">
          <div className="space-y-6 max-w-xl mx-auto">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Star className="w-4 h-4" />
                Voting on Proposals
              </h2>
              <p className="text-sm">
                You can vote for as many dishes as are planned in this category. If you try to vote for more than the allowed number, you'll need to remove one of your previous votes first.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Reporting Allergens
              </h2>
              <p className="text-sm">
                If you see ingredients that may contain allergens, you can check <em>Report Allergy</em>. A red icon will appear on the card.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Viewing Details
              </h2>
              <p className="text-sm">
                Click on <strong>View Details</strong> to access the full information of the selected proposal.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Adding a New Proposal
              </h2>
              <p className="text-sm">
                Click the <strong>Add new proposal</strong> button to submit a new dish suggestion in this category.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Icon Legend</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-500 text-white" />
                  <span><strong>Most Voted</strong>: Proposal with the highest number of votes</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="red" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" fill="red"></circle>
                    <line x1="12" x2="12" y1="8" y2="12" stroke="black"></line>
                    <line x1="12" x2="12.01" y1="16" y2="16" stroke="black"></line>
                  </svg>
                  <span><strong>Contains Allergen</strong>: Proposal with known or reported allergenic ingredients</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
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

    </div>
  )
}
