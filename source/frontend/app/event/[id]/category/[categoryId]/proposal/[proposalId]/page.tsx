'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import BackButton from '@/components/backButton/BackButton'

interface Proposal {
  id: number
  title: string
  description: string
  ingredients: string[]
  image: string
  hasAllergen: boolean
  mostVoted?: boolean
}

interface Participant {
  id: number
  name: string
  surname: string
  restrictions: {
    type: 'allergy' | 'intolerance'
    ingredient: string
  }[]
}

export default function ProposalPage() {
  const { id, categoryId, proposalId } = useParams()
  const eventId = Array.isArray(id) ? id[0] : id || 'defaultId'
  const catId = Array.isArray(categoryId) ? categoryId[0] : categoryId || 'defaultCategoryId'
  const propId = Array.isArray(proposalId) ? proposalId[0] : proposalId || 'defaultProposalId'

  // Proposte esempio
  const proposals: Proposal[] = [
    {
      id: 2,
      title: 'Rice Salad',
      description: 'This is the classic rice salad my grandmother used to make every summer for our countryside picnics. I have kept it simple, just like she did, with a few small touches of my own.',
      ingredients: ['basmati rice', 'tuna', 'carrots', 'peas', 'olives', 'corn', 'cheese', 'eggs'],
      image: '/insalata-riso.jpg',
      hasAllergen: true,
      mostVoted: true
    },
    {
      id: 1,
      title: 'Meatballs',
      description: 'These meatballs are true comfort food for me. It’s a Sunday family recipe passed down for generations. My mom made them almost every weekend—the aroma alone would wake us all up. I usually serve them with a simple tomato sauce',
      ingredients: ['ground beef', 'pork', 'egg', 'parmesan', 'parsley', 'garlic', 'tomato'],
      image: '/meatballs.webp',
      hasAllergen: false
    },
    {
      id: 3,
      title: 'Salmon Rolls',
      description: 'I first made these for a little get-together with friends, and now they’re always requested.',
      ingredients: ['smoked salmon', 'philadelphia', 'zucchini', 'lemon', 'arugula'],
      image: '/salmon.jpeg',
      hasAllergen: true
    }
  ]

  // Partecipanti con allergie/intolleranze
  const participants: Participant[] = [
    {
      id: 1,
      name: 'Sara',
      surname: 'Rossi',
      restrictions: [
        { type: 'allergy', ingredient: 'tuna' },
        { type: 'allergy', ingredient: 'eggs' }
      ]
    },
    {
      id: 2,
      name: 'Marco',
      surname: 'Bianchi',
      restrictions: [
        { type: 'intolerance', ingredient: 'lactose' }
      ]
    }
  ]

  // Mappa degli ingredienti verso allergeni/intolleranze
  const ingredientToAllergenMap: Record<string, string> = {
    philadelphia: 'lactose',
    cheese: 'lactose',
    milk: 'lactose',
    tuna: 'tuna',
    eggs: 'eggs',
    'smoked salmon': 'fish'
  }

  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [restrictionWarnings, setRestrictionWarnings] = useState<string[]>([])

  useEffect(() => {
    const foundProposal = proposals.find((p) => p.id === parseInt(propId))
    if (foundProposal) {
      setProposal(foundProposal)

      const warnings = participants.map(user => {
        const matches = user.restrictions.filter(restriction =>
          foundProposal.ingredients.some(ingredient => {
            const mapped = ingredientToAllergenMap[ingredient.toLowerCase()]
            return mapped && mapped === restriction.ingredient.toLowerCase()
          })
        )

        if (matches.length > 0) {
          const byType: Record<string, string[]> = {}
          matches.forEach(({ type, ingredient }) => {
            if (!byType[type]) byType[type] = []
            byType[type].push(ingredient)
          })

          const phrases = Object.entries(byType).map(([type, ingredients]) => {
            const label = type === 'allergy' ? 'is allergic to' : 'is intolerant to'
            return `${user.name} ${user.surname} ${label}: ${[...new Set(ingredients)].join(', ')}`
          })

          return phrases
        }

        return null
      }).flat().filter(Boolean) as string[]

      setRestrictionWarnings(warnings)
    }
  }, [propId])

  if (!proposal) return <div>Loading...</div>

  return (
    <div className="min-h-screen px-6 pt-6 pb-28 bg-white text-black">
      <BackButton />
      <h1 className="text-3xl font-bold text-center mb-4">{proposal.title}</h1>

      <div className="mb-4">
        <img
          src={proposal.image}
          alt={proposal.title}
          className="w-full h-25 object-cover rounded-lg image-proposal-pdp"
          onError={(e) => e.currentTarget.src = '/images/default-image.jpg'}
        />
      </div>

      <div className="space-y-4">
        <p className="text-lg">{proposal.description}</p>

        <p className="text-md font-semibold">Ingredients:</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {proposal.ingredients.map((ingr, idx) => (
            <span key={idx} className="bg-gray-200 px-3 py-1 rounded text-md">{ingr}</span>
          ))}
        </div>

        {restrictionWarnings.length > 0 && (
          <div className="mt-6 bg-red-100 border border-red-300 text-red-700 p-4 rounded space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold">Food restriction alerts from participants:</p>
            </div>
            {restrictionWarnings.map((msg, idx) => (
              <p key={idx}>⚠️ {msg}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
