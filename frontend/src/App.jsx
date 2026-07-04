import { Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Transfer from "./pages/Transfer";
import Transactions from "./pages/Transactions";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

    return (

        <Routes>

            <Route path="/" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/deposit"
                element={
                    <ProtectedRoute>
                        <Deposit />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/withdraw"
                element={
                    <ProtectedRoute>
                        <Withdraw />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/transfer"
                element={
                    <ProtectedRoute>
                        <Transfer />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/transactions"
                element={
                    <ProtectedRoute>
                        <Transactions />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<NotFound />} />

            <Route
                path="/profile"

                element={

                    <ProtectedRoute>

                        <Profile />

                    </ProtectedRoute>

                }
            />

        </Routes>

    );

}

export default App;