import React from 'react'
import { RecipeCard } from './RecipeCard'
import { Recipe } from '@/types/recipe'
import { motion } from 'framer-motion'
import { Utensils } from 'lucide-react'

interface RecipeGridProps {
  recipes: Recipe[]
  isLoading: boolean
}

export const RecipeGrid: React.FC<RecipeGridProps> = ({ recipes, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass-card rounded-3xl aspect-[3/4] animate-pulse" />
        ))}
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-24 h-24 rounded-full glass flex items-center justify-center text-primary/30">
          <Utensils size={48} />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-heading font-bold">Aucune recette trouvée</h3>
          <p className="text-muted-foreground">Ajoutez plus d'ingrédients ou essayez d'autres combinaisons.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {recipes.map((recipe, index) => (
        <motion.div
          key={recipe.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: index * 0.1,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <RecipeCard recipe={recipe} />
        </motion.div>
      ))}
    </div>
  )
}
