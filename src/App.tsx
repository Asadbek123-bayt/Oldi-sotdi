import React from 'react';
import { BrowserRouter as Router, Routes, Route, ScrollRestoration } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { VehiclesProvider } from './context/VehiclesContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { ScrollToTop } from './components/ScrollToTop';

import { HomePage } from './pages/HomePage';
import { VehiclesPage } from './pages/VehiclesPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { DealershipsPage } from './pages/DealershipsPage';
import { PostAdPage } from './pages/PostAdPage';
import { ComparePage } from './pages/ComparePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { CabinetPage } from './pages/CabinetPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <VehiclesProvider>
          <Router>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col bg-[#F4F7FB]">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/vehicles" element={<VehiclesPage />} />
                  <Route path="/vehicle/:id" element={<VehicleDetailPage />} />
                  <Route path="/dealerships" element={<DealershipsPage />} />
                  <Route path="/post-ad" element={<PostAdPage />} />
                  <Route path="/compare" element={<ComparePage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/cabinet" element={<CabinetPage />} />
                  <Route path="/profile" element={<CabinetPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<LoginPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </main>
              <Footer />
              <LoginModal />
            </div>
          </Router>
        </VehiclesProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
