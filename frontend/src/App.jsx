import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import Aqua3DBackground from './components/common/Aqua3DBackground';
import AquaCursor from './components/common/AquaCursor';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Challenges from './pages/Challenges';
import Quizzes from './pages/Quizzes';
import QuizTake from './pages/QuizTake';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="relative flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-x-hidden">
          {/* Interactive 3D Canvas Hydro Background & Fluid Cursor */}
          <Aqua3DBackground />
          <AquaCursor />

          <Navbar />
          <main className="relative z-10 flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:id" element={<ArticleDetail />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/quizzes" element={<Quizzes />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />

              {/* Protected User Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quizzes/:id"
                element={
                  <ProtectedRoute>
                    <QuizTake />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Route */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
