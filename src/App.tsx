/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Catalog from './components/Catalog';
import CustomOrder from './components/CustomOrder';
import Footer from './components/Footer';
import Backoffice from './components/Backoffice';
import { MessageCircle, Lock, ShieldAlert, X } from 'lucide-react';
import { getGeneralWhatsAppLink, PRODUCTS_LIST } from './data';
import { Product } from './types';

export default function App() {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('vetements-personnalises');
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Loaded dynamically from localStorage to keep Véro's additions persistent
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vero_catalog');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse vero_catalog from localStorage:', e);
      }
    }
    return PRODUCTS_LIST;
  });

  const handleSaveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('vero_catalog', JSON.stringify(newProducts));
  };

  const handleSelectServiceForCustomOrder = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    
    // Smooth scroll to custom order form section
    const element = document.getElementById('sur-mesure');
    if (element) {
      const offset = 80; // height of the navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'vero2026') {
      setIsAdminView(true);
      setIsLoginModalOpen(false);
      setPasswordInput('');
      setLoginError('');
      
      // Scroll to top of backoffice
      window.scrollTo({ top: 0 });
    } else {
      setLoginError('Code d’accès incorrect. Veuillez réessayer.');
    }
  };

  if (isAdminView) {
    return (
      <Backoffice 
        products={products}
        onSaveProducts={handleSaveProducts}
        onClose={() => setIsAdminView(false)}
      />
    );
  }

  return (
    <div id="app-root-container" className="min-h-screen bg-white text-slate-800 antialiased font-sans">
      {/* Premium Header/Navbar */}
      <Navbar />

      {/* Hero Showcase with elegant branding */}
      <Hero />

      {/* Interactive Core Services Section (from the flyer) */}
      <Services onSelectServiceForCustomOrder={handleSelectServiceForCustomOrder} />

      {/* Showcase Catalog Grid with Direct WhatsApp Redirect */}
      <Catalog products={products} />

      {/* Bespoke Interactive Tailoring Configurator Form */}
      <CustomOrder 
        selectedServiceId={selectedServiceId} 
        onServiceChange={setSelectedServiceId} 
      />

      {/* Comprehensive Footer Section containing contact details, hours, and maps */}
      <Footer onOpenAdmin={() => setIsLoginModalOpen(true)} />

      {/* Floating Action WhatsApp Badge for instant engagement */}
      <div className="fixed bottom-6 right-6 z-40 group">
        {/* Help bubble tooltip */}
        <div className="absolute right-0 bottom-16 bg-slate-900 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-lg border border-slate-800 whitespace-nowrap opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
          Besoin d'aide ? Écrivez-nous !
        </div>

        {/* Pulse effect rings */}
        <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping opacity-75" />

        {/* Floating Button */}
        <a
          href={getGeneralWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20ba5a] hover:scale-105 transition-all cursor-pointer"
          aria-label="Contacter Véro-Design Couture sur WhatsApp"
        >
          <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
        </a>
      </div>

      {/* Admin Authentication Overlay Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <button
              onClick={() => {
                setIsLoginModalOpen(false);
                setPasswordInput('');
                setLoginError('');
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-full bg-brand-pink/10 text-brand-pink border border-brand-pink/20 mb-1">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                Connexion Administration
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
                Veuillez saisir votre code d'accès personnel de l'atelier pour gérer le catalogue.
              </p>
            </div>

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Code d’accès secret
                </label>
                <input
                  type="password"
                  required
                  placeholder="Saisissez le code d'accès (vero2026)"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink text-slate-800 rounded-xl text-sm transition-colors"
                />
              </div>

              {loginError && (
                <div className="flex items-center gap-1.5 p-3 bg-red-50 border border-red-100 text-xs text-red-600 rounded-lg font-medium">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-brand-pink hover:bg-brand-pink-dark text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-brand-pink/25 hover:scale-[1.01] cursor-pointer"
              >
                Débloquer l'Espace Admin
              </button>
            </form>

            <p className="text-[10px] text-center text-slate-400">
              💡 Code d'accès de démonstration : <strong className="text-brand-pink">vero2026</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
