import { BrowserRouter } from 'react-router-dom'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import { CategoryProvider } from './context/CategoryContext'

function App() {

  return (
    <AuthProvider>
      <CategoryProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CategoryProvider>
    </AuthProvider>
  )
}

export default App
