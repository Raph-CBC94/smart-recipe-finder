import React from 'react'
import { Clock, Star, ChefHat, ExternalLink } from 'lucide-react'
import { Badge, Card, CardContent, CardFooter, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Button } from '@blinkdotnew/ui'
import { Recipe } from '@/types/recipe'
import { motion } from 'framer-motion'

interface RecipeCardProps {
  recipe: Recipe
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3 }}
          className="h-full cursor-pointer"
        >
          <Card className="h-full glass-card overflow-hidden group border-white/20 hover:border-primary/50 transition-all duration-300">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img 
                src={recipe.imageUrl} 
                alt={recipe.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Badge 
                className="absolute top-3 right-3 glass text-xs font-bold"
                variant={recipe.difficulty === 'Easy' ? 'secondary' : recipe.difficulty === 'Medium' ? 'default' : 'destructive'}
              >
                {recipe.difficulty}
              </Badge>
            </div>
            
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                <ChefHat size={14} className="text-primary" />
                <span>{recipe.source}</span>
              </div>
              
              <h3 className="font-heading text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                {recipe.title}
              </h3>
              
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {recipe.description}
              </p>
            </CardContent>
            
            <CardFooter className="px-5 py-4 border-t border-white/10 flex items-center justify-between bg-black/5 dark:bg-white/5">
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Clock size={16} className="text-primary" />
                <span>{recipe.prepTime}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-accent">
                <Star size={16} fill="currentColor" />
                <span>{recipe.rating.toFixed(1)}</span>
                <span className="text-muted-foreground font-normal text-xs">({recipe.reviewCount})</span>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass p-0 border-white/20">
        <DialogHeader className="p-8 pb-0">
          <div className="flex items-center gap-2 text-primary mb-2">
            <ChefHat size={20} />
            <span className="text-sm font-bold tracking-widest uppercase">{recipe.source}</span>
          </div>
          <DialogTitle className="text-4xl font-heading font-black mb-4">
            {recipe.title}
          </DialogTitle>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-bold">
              <Clock size={18} className="text-primary" />
              {recipe.prepTime}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-bold">
              <Star size={18} className="text-accent" fill="currentColor" />
              {recipe.rating.toFixed(1)} ({recipe.reviewCount} avis)
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-bold">
              <Badge variant="outline" className="border-primary/30">{recipe.difficulty}</Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
                <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
              </div>
              
              <div className="glass-card p-6 rounded-3xl space-y-4">
                <h4 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-2 h-8 bg-primary rounded-full" />
                  Ingrédients
                </h4>
                <ul className="grid grid-cols-1 gap-2">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-primary/40" />
                      <span className="text-sm font-medium">{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="glass-card p-8 rounded-3xl space-y-6">
              <h4 className="text-xl font-bold flex items-center gap-2">
                <span className="w-2 h-8 bg-secondary rounded-full" />
                Instructions
              </h4>
              <div className="space-y-6">
                {recipe.instructions.map((step, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full glass flex items-center justify-center font-bold text-sm text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      {i + 1}
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors pt-1">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button variant="outline" className="rounded-2xl border-white/20 hover:bg-white/10" asChild>
              <a 
                href={`https://www.google.com/search?q=${encodeURIComponent(recipe.title + " " + recipe.source)}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2"
              >
                Voir la source originale
                <ExternalLink size={16} />
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
