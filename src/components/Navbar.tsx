/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { getGeneralWhatsAppLink } from '../data';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        isScrolled || setIsScrolled(true);
      } else {
        !isScrolled || setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
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

  const menuItems = [
    { label: 'Accueil', target: 'accueil' },
    { label: 'Nos Services', target: 'services' },
    { label: 'Nos Créations', target: 'creations' },
    { label: 'Création Sur-Mesure', target: 'sur-mesure' },
    { label: 'Contact', target: 'contact' },
  ];

  return (
    <nav
      id="app-navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md py-3 border-b border-brand-pink/10'
          : 'bg-white/90 backdrop-blur-md py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Brand Logo */}
          <div 
            onClick={() => scrollToSection('accueil')} 
            className="flex flex-col cursor-pointer group"
          >
            <span className="font-serif text-2xl font-bold tracking-tight text-brand-pink group-hover:text-brand-pink-dark transition-colors">
              Véro-Design
            </span>
            <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-brand-gold font-semibold -mt-1">
              Couture Haute Mode
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.target}
                onClick={() => scrollToSection(item.target)}
                className="font-sans text-sm font-medium text-slate-700 hover:text-brand-pink transition-colors relative py-2 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-pink hover:after:w-full after:transition-all after:duration-300"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Call to Action Button */}
          <div className="hidden md:block">
            <a
              href={getGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-pink text-white text-sm font-medium hover:bg-brand-pink-dark transition-all shadow-md shadow-brand-pink/20 hover:scale-[1.02] cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white text-brand-pink" />
              <span>Nous Écrire</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-brand-pink hover:bg-slate-50 transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 shadow-inner px-4 pt-2 pb-6 space-y-3 animate-fade-in">
          {menuItems.map((item) => (
            <button
              key={item.target}
              onClick={() => scrollToSection(item.target)}
              className="block w-full text-left px-4 py-3 text-base font-medium text-slate-700 hover:text-brand-pink hover:bg-brand-pink/5 rounded-xl transition-all"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 border-t border-slate-100 px-4">
            <a
              href={getGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-brand-pink text-white font-medium hover:bg-brand-pink-dark transition-all shadow-md shadow-brand-pink/20"
            >
              <MessageCircle className="w-5 h-5 fill-white text-brand-pink" />
              <span>Discuter sur WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
