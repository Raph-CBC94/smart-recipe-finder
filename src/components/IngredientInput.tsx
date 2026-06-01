import React, { useState } from 'react'
import { X, Plus, Search } from 'lucide-react'
import { Button, Input, Badge } from '@blinkdotnew/ui'
import { motion, AnimatePresence } from 'framer-motion'

interface IngredientInputProps {
  ingredients: string[]
  onAdd: (ingredient: string) => void
  onRemove: (ingredient: string) => void
  onSearch: () => void
  isSearching: boolean
}

export const IngredientInput: React.FC<IngredientInputProps> = ({
  ingredients,
  onAdd,
  onRemove,
  onSearch,
  isSearching
}) => {
  const [inputValue, setInputValue] = useState('')

  const handleAdd = () => {
    if (inputValue.trim() && !ingredients.includes(inputValue.trim())) {
      onAdd(inputValue.trim())
      setInputValue('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="glass p-6 rounded-3xl space-y-4 shadow-xl">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Ex: Tomate, Poulet, Oignon..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-4 h-12 bg-white/50 dark:bg-black/20 border-white/30 dark:border-white/10 rounded-2xl focus:ring-primary/50"
            />
          </div>
          <Button 
            onClick={handleAdd}
            size="lg"
            className="rounded-2xl h-12 px-6 bg-primary hover:bg-primary/90 text-white transition-all active:scale-95"
          >
            <Plus size={20} className="mr-2" />
            Ajouter
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 min-h-[40px]">
          <AnimatePresence>
            {ingredients.map((ingredient) => (
              <motion.div
                key={ingredient}
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 10 }}
                layout
              >
                <Badge 
                  variant="secondary"
                  className="pl-3 pr-1 py-1 h-8 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-sm border-white/30 dark:border-white/20 text-sm font-medium flex items-center gap-1 group"
                >
                  {ingredient}
                  <button
                    onClick={() => onRemove(ingredient)}
                    className="p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
          {ingredients.length === 0 && (
            <p className="text-muted-foreground text-sm italic py-2">
              Entrez les ingrédients que vous avez...
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={onSearch}
          disabled={ingredients.length === 0 || isSearching}
          className="rounded-full px-12 h-16 text-lg font-semibold shadow-2xl transition-all hover:scale-105 active:scale-95 bg-primary hover:bg-primary/90"
        >
          {isSearching ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Recherche...
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Search size={24} />
              Trouver des recettes
            </div>
          )}
        </Button>
      </div>
    </div>
  )
}
