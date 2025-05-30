import { BrowserRouter } from 'react-router-dom'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import { CategoryProvider } from './context/CategoryContext'
import { FilterProvider } from './context/FilterContext'
import { SearchProvider } from './context/SearchContext'

function App() {

  return (
    <AuthProvider>
      <CategoryProvider>
        <FilterProvider>
          <SearchProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </SearchProvider>
        </FilterProvider>
      </CategoryProvider>
    </AuthProvider>
  )
}

export default App
