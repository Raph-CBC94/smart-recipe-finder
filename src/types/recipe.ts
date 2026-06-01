export interface Recipe {
  id: string
  title: string
  description: string
  ingredients: string[]
  instructions: string[]
  prepTime: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  rating: number
  reviewCount: number
  imageUrl: string
  source: string
  imageSearchTerm: string
}

export interface SearchState {
  ingredients: string[]
  isSearching: boolean
  results: Recipe[]
  error: string | null
}
