import { BrowserRouter } from 'react-router-dom'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import { CategoryProvider } from './context/CategoryContext'
import { FilterProvider } from './context/FilterContext'

function App() {

  return (
    <AuthProvider>
      <CategoryProvider>
        <FilterProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </FilterProvider>
      </CategoryProvider>
    </AuthProvider>
  )
}

export default App
