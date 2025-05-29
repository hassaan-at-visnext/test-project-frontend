import { Route, Routes } from "react-router-dom"
import Login from "../components/Auth/Login"
import Signup from "../components/Auth/Signup"
import NotFound from "../components/NotFound"
import Buy from "../components/Buy"
import ProtectedRoute from "./ProtectedRoute"


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/buy" element={
                <ProtectedRoute>
                    <Buy />
                </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default AppRoutes