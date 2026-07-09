import { Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Transfer from "./pages/Transfer";
import Transactions from "./pages/Transactions";
import NotFound from "./pages/NotFound";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

    return (

        <Routes>

            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            {/* Protected Dashboard Route */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            {/* Protected Deposit Route */}
            <Route
                path="/deposit"
                element={
                    <ProtectedRoute>
                        <Deposit />
                    </ProtectedRoute>
                }
            />

            {/* Protected Withdraw Route */}
            <Route
                path="/withdraw"
                element={
                    <ProtectedRoute>
                        <Withdraw />
                    </ProtectedRoute>
                }
            />

            {/* Protected Money Transfer Route */}
            <Route
                path="/transfer"
                element={
                    <ProtectedRoute>
                        <Transfer />
                    </ProtectedRoute>
                }
            />

            {/* Protected Transaction History Route */}
            <Route
                path="/transactions"
                element={
                    <ProtectedRoute>
                        <Transactions />
                    </ProtectedRoute>
                }
            />

            {/* Protected Change Password Route */}
            <Route
                path="/change-password"
                element={
                    <ProtectedRoute>
                        <ChangePassword />
                    </ProtectedRoute>
                }
            />

            {/* Display Not Found page for invalid URLs */}
            <Route path="*" element={<NotFound />} />

            {/* Protected User Profile Route */}
            <Route
                path="/profile"

                element={

                    <ProtectedRoute>

                        <Profile />

                    </ProtectedRoute>

                }
            />

            {/* Password Recovery Routes */}
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/verify-otp" element={<VerifyOTP />} />

            <Route path="/reset-password" element={<ResetPassword />} />

        </Routes>

    );

}

export default App;