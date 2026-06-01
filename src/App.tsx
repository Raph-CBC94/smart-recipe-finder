import React, { useState } from 'react'
import { ChefHat, Search, History, Bookmark, Settings, LogOut, User, Sparkles, Utensils } from 'lucide-react'
import { Button, AppShell, AppShellSidebar, AppShellMain, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarItem, toast } from '@blinkdotnew/ui'
import { IngredientInput } from './components/IngredientInput'
import { RecipeGrid } from './components/RecipeGrid'
import { Recipe } from './types/recipe'
import { blink } from './blink/client'
import { useAuth } from './hooks/useAuth'

const App: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [ingredients, setIngredients] = useState<string[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (ingredients.length === 0) return

    setIsSearching(true)
    try {
      const prompt = `Génère 6 recettes délicieuses et réalistes qui utilisent principalement ces ingrédients: ${ingredients.join(', ')}.
      Pour chaque recette, inclus:
      - Un titre accrocheur
      - Une courte description
      - La liste complète des ingrédients (incluant les basiques comme sel, poivre, huile)
      - Les étapes de préparation
      - Le temps de préparation estimé (ex: "25 min")
      - La difficulté (Easy, Medium, Hard)
      - Un score de notation réaliste (entre 4.0 et 5.0)
      - Un nombre d'avis réaliste
      - Le nom d'un site de cuisine connu comme source (ex: "Marmiton", "750g", "Cuisine Actuelle", "Bon Appétit")
      - Un mot-clé descriptif pour chercher une image culinaire sur Unsplash (ex: "pasta carbonara bowl")
      
      Réponds UNIQUEMENT avec un objet JSON contenant un tableau "recipes".`

      const { object } = await blink.ai.generateObject({
        prompt,
        schema: {
          type: 'object',
          properties: {
            recipes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  ingredients: { type: 'array', items: { type: 'string' } },
                  instructions: { type: 'array', items: { type: 'string' } },
                  prepTime: { type: 'string' },
                  difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard'] },
                  rating: { type: 'number' },
                  reviewCount: { type: 'number' },
                  source: { type: 'string' },
                  imageSearchTerm: { type: 'string' }
                },
                required: ['title', 'description', 'ingredients', 'instructions', 'prepTime', 'difficulty', 'rating', 'reviewCount', 'source', 'imageSearchTerm']
              }
            }
          },
          required: ['recipes']
        }
      })

      const curatedRecipes: Recipe[] = (object as any).recipes.map((r: any, idx: number) => ({
        ...r,
        id: `recipe-${Date.now()}-${idx}`,
        imageUrl: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800&q=80&sig=${idx}`
      }))

      // Fetch real images from Unsplash in parallel
      const recipesWithImages = await Promise.all(curatedRecipes.map(async (r: any) => {
        try {
          const searchResults = await blink.data.search(r.imageSearchTerm, { type: 'images', limit: 1 })
          const imageUrl = searchResults.image_results?.[0]?.original || r.imageUrl
          return { ...r, imageUrl }
        } catch (e) {
          return r
        }
      }))

      setRecipes(recipesWithImages)
      toast.success(`${recipesWithImages.length} recettes trouvées !`)
    } catch (error) {
      console.error(error)
      toast.error("Erreur lors de la recherche des recettes.")
    } finally {
      setIsSearching(false)
    }
  }

  const addIngredient = (ing: string) => setIngredients([...ingredients, ing])
  const removeIngredient = (ing: string) => setIngredients(ingredients.filter(i => i !== ing))

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <AppShell>
      <AppShellSidebar>
        <Sidebar className="border-r border-white/10 glass">
          <SidebarHeader className="h-20 flex items-center px-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <ChefHat size={24} />
              </div>
              <span className="font-heading font-black text-xl tracking-tight">SmartCook</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <div className="space-y-1 px-4">
              <SidebarItem active icon={<Search size={20} />} label="Recherche" />
              <SidebarItem icon={<History size={20} />} label="Historique" />
              <SidebarItem icon={<Bookmark size={20} />} label="Favoris" />
              <SidebarItem icon={<Settings size={20} />} label="Paramètres" />
            </div>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-white/10">
            {user ? (
              <div className="flex items-center gap-3 px-2 py-3 glass rounded-2xl border-white/20">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                  {user.photoURL ? <img src={user.photoURL} className="w-full h-full rounded-xl" alt="Avatar" /> : <User size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{user.displayName || user.email}</p>
                  <p className="text-xs text-muted-foreground truncate">Membre Chef</p>
                </div>
                <button 
                  onClick={() => blink.auth.logout()}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Button 
                onClick={() => blink.auth.login()}
                className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold"
              >
                Se connecter
              </Button>
            )}
          </SidebarFooter>
        </Sidebar>
      </AppShellSidebar>
      
      <AppShellMain className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-white/50 to-primary/5 dark:from-background dark:via-black/20 dark:to-primary/5">
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6 max-w-3xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 text-primary text-sm font-bold mb-4">
              <Sparkles size={16} />
              Cuisinez malin avec l'IA
            </div>
            <h1 className="text-6xl md:text-7xl font-heading font-black tracking-tighter leading-[0.9] text-balance">
              Transformez vos <span className="text-primary italic">restes</span> en chefs-d'œuvre.
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed">
              Entrez simplement ce que vous avez dans votre frigo et laissez notre IA trouver la recette parfaite pour vous.
            </p>
          </div>

          {/* Search Section */}
          <div className="animate-fade-in [animation-delay:200ms]">
            <IngredientInput
              ingredients={ingredients}
              onAdd={addIngredient}
              onRemove={removeIngredient}
              onSearch={handleSearch}
              isSearching={isSearching}
            />
          </div>

          {/* Results Section */}
          <div className="space-y-8 animate-fade-in [animation-delay:400ms]">
            {recipes.length > 0 && (
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <h2 className="text-3xl font-heading font-bold flex items-center gap-3">
                  <Utensils size={28} className="text-primary" />
                  Vos suggestions gourmandes
                </h2>
                <p className="text-muted-foreground font-medium">{recipes.length} résultats</p>
              </div>
            )}
            <RecipeGrid recipes={recipes} isLoading={isSearching} />
          </div>
        </div>
      </AppShellMain>
    </AppShell>
  )
}

export default App
