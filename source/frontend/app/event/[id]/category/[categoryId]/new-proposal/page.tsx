'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ImagePlus, Plus, Check } from 'lucide-react'
import BackButton from '@/components/backButton/BackButton'

export default function NewProposalPage() {
  const { id, categoryId } = useParams<{ id: string; categoryId: string }>()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState<string[]>([])
  const [newIngredient, setNewIngredient] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [showHelp, setShowHelp] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [ingredientWarnings, setIngredientWarnings] = useState<string[]>([])

  const participantRestrictions = [
    { name: 'Luca', restrictions: ['lactose'] },
  ]
  const allergenMap: Record<string, string[]> = {
    lactose: ['lactose', 'milk', 'cheese', 'cream', 'butter', 'yogurt']
  }


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setImage(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ title, ingredients, description, image })
    setShowConfirmation(true)
  }

  const checkIngredientAgainstRestrictions = (ingredient: string) => {
    const warnings: string[] = []
    const ingredientLower = ingredient.toLowerCase()

    participantRestrictions.forEach(participant => {
      participant.restrictions.forEach(restriction => {
        const keywords = allergenMap[restriction] || [restriction]

        if (keywords.some(keyword => ingredientLower.includes(keyword))) {
          warnings.push(`${participant.name} cannot eat this: "${restriction}"`)
        }
      })
    })

    return warnings
  }

  const handleAddIngredient = () => {
    if (newIngredient.trim() !== '') {
      const warnings = checkIngredientAgainstRestrictions(newIngredient)
      if (warnings.length > 0) {
        setIngredientWarnings(warnings)
      } else {
        setIngredientWarnings([])
      }

      setIngredients(prev => [...prev, newIngredient])
      setNewIngredient('')
    }
  }

  const handleRemoveIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-white text-black px-6 pb-24 pt-6">
      <BackButton />

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowHelp(true)}
          className="bg-gray-200 hover:bg-gray-300 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold"
        >
          ?
        </button>
      </div>

      <h1 className="text-4xl font-semibold text-center mb-6">New proposal</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Proposal Name */}
        <div>
          <label className="text-lg font-semibold mb-2 block">Proposal name</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border border-gray-400 rounded px-4 py-2 text-black"
            required
          />
        </div>

        {/* Upload Image */}
        <div className="border-2 border-dashed border-gray-400 rounded-md py-8 flex flex-col items-center justify-center">
          <ImagePlus className="w-12 h-12 text-gray-500 mb-2" />
          <label className="text-sm">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <span className="cursor-pointer underline text-gray-600">Choose photo to Upload</span>
          </label>
          {image && <p className="text-xs mt-2 text-gray-500">{image.name}</p>}
        </div>

        {/* Ingredients */}
        <div>
          <label className="text-lg font-semibold mb-2 block">Ingredients</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {ingredients.map((ingr, i) => (
              <div
                key={i}
                className="flex items-center bg-gray-300 text-sm px-4 py-1 rounded-full"
              >
                <span>{ingr}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(i)}
                  className="ml-2 text-gray-600 hover:text-red-600"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newIngredient}
              onChange={e => setNewIngredient(e.target.value)}
              placeholder="Add Ingredient"
              className="flex-1 border border-gray-300 rounded px-4 py-2 text-black"
            />
            <button
              type="button"
              onClick={handleAddIngredient}
              className="bg-[#0099ff] text-white p-2 rounded"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* ⚠️ Warning message */}
          {ingredientWarnings.length > 0 && (
            <div className="mt-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded text-sm">
              <p className="font-semibold mb-1">Warning:</p>
              <ul className="list-disc pl-5 space-y-1">
                {ingredientWarnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="text-lg font-semibold mb-2 block">
            Description <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded px-4 py-2 text-black resize-none"
          />
        </div>

        {/* Confirm */}
        <button
          type="submit"
          className="bg-[#aa54ab] text-white w-full py-3 rounded text-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#650000]"
        >
          <Check className="w-5 h-5" />
          Confirm
        </button>
      </form>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md px-6 pt-12 text-white">
          <div className="space-y-6 max-w-xl mx-auto">
            <div>
              <h2 className="text-lg font-semibold mb-1">Proposal Name</h2>
              <p className="text-sm">
                Enter a clear and descriptive name for your dish proposal. This will be shown to all participants.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-1">Add a Photo</h2>
              <p className="text-sm">
                Upload an image to make your proposal more appealing. You can select any photo from your device.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-1">Manage Ingredients</h2>
              <p className="text-sm">
                List the ingredients of your dish. Use the field to add one at a time, and click the “×” icon to remove any.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-1">Add a Description (Optional)</h2>
              <p className="text-sm">
                You can optionally describe your dish with more details, such as preparation, flavors, or origin.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-1">Submit the Proposal</h2>
              <p className="text-sm">
                When ready, click <strong>Confirm</strong> to submit your proposal. It will appear in the list of dishes for this category.
              </p>
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

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md px-6 pt-12 text-white flex items-center justify-center">
          <div className="bg-white text-black rounded-lg p-6 max-w-md w-full shadow-lg space-y-4">
            <h2 className="text-xl font-semibold">Proposal submitted!</h2>
            <p>Your proposal has been successfully submitted. You can now return to the homepage.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => router.push(`/home`)}
                className="bg-[#aa54ab] text-white px-4 py-2 rounded hover:bg-[#650000]"
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
