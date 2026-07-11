/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Phone, MapPin, Clock, MessageCircle, Instagram, Facebook, ArrowUp, Lock } from 'lucide-react';
import { CONTACT_INFO, getGeneralWhatsAppLink } from '../data';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export default function Footer({ onOpenAdmin }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer id="contact" className="bg-slate-950 text-slate-200 pt-20 pb-8 border-t border-brand-pink/10 relative overflow-hidden">
      {/* Decorative colored glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-brand-pink/10 blur-3xl" />
      <div className="absolute bottom-0 left-10 w-60 h-60 rounded-full bg-brand-gold/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          
          {/* Column 1: Brand details (Lomé, Togo) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <h3 className="font-serif text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-gold">
                Véro-Design Couture
              </h3>
              <p className="font-sans text-xs tracking-[0.2em] uppercase text-brand-gold font-semibold">
                Haute Couture & Créations d'Art
              </p>
            </div>
            
            <p className="font-sans text-sm sm:text-base text-slate-400 leading-relaxed max-w-md">
              Votre atelier créatif spécialisé dans la mode africaine haut de gamme, les tenues de cérémonie sur-mesure et les accessoires de protection capillaire en satin de soie. Établi à Kpogan, nous mettons notre expertise au service de votre élégance.
            </p>

            {/* Social media icons */}
            <div className="flex gap-4 pt-2">
              <a
                href={`https://facebook.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-900 border border-slate-800 rounded-full hover:border-brand-pink hover:text-brand-pink transition-all"
                aria-label="Facebook Page"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={`https://instagram.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-900 border border-slate-800 rounded-full hover:border-brand-pink hover:text-brand-pink transition-all"
                aria-label="Instagram Page"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={getGeneralWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-900 border border-slate-800 rounded-full hover:border-brand-pink hover:text-brand-pink transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 fill-slate-200 stroke-slate-950" />
              </a>
            </div>
          </div>

          {/* Column 2: Specific Contacts Card */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="font-serif text-xl font-bold text-white border-b border-slate-900 pb-3">
              Informations & Contacts
            </h4>
            
            <div className="space-y-4">
              {/* Phone card */}
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-brand-pink/10 border border-brand-pink/20 text-brand-pink rounded-2xl mt-1">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Téléphone & WhatsApp</p>
                  <a 
                    href={getGeneralWhatsAppLink()} 
                    className="text-base sm:text-lg font-bold hover:text-brand-pink transition-colors"
                  >
                    {CONTACT_INFO.phoneUI}
                  </a>
                </div>
              </div>

              {/* Address card */}
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-brand-pink/10 border border-brand-pink/20 text-brand-pink rounded-2xl mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Adresse de l'Atelier</p>
                  <p className="text-sm font-semibold text-slate-300">
                    {CONTACT_INFO.address}
                  </p>
                </div>
              </div>

              {/* Clock card */}
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-brand-pink/10 border border-brand-pink/20 text-brand-pink rounded-2xl mt-1">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Heures d'Ouverture</p>
                  <p className="text-sm text-slate-300">
                    {CONTACT_INFO.workingHours}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Mini Map View / Locator */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-xl font-bold text-white border-b border-slate-900 pb-3">
              Notre Localisation
            </h4>
            
            {/* Embedded maps placeholder or map graphic */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-800 flex items-center justify-center p-4">
              {/* Graphic background */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
              
              <div className="text-center relative z-10 space-y-3">
                <div className="inline-flex p-3 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/20 animate-bounce">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-300">Kpogan Agbétiko</p>
                  <p className="text-[10px] text-slate-500 font-sans">Lomé, Togo</p>
                </div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(CONTACT_INFO.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-[11px] font-bold text-brand-pink hover:text-brand-pink-dark transition-colors"
                >
                  Ouvrir dans Google Maps ➔
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Footer bottom bar */}
        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            <p>© {new Date().getFullYear()} Véro-Design Couture. Tous droits réservés.</p>
            <p className="text-[10px] text-slate-600 mt-1">Confection artisanale de qualité à Lomé, Togo.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="px-4 py-3 bg-slate-900 hover:bg-slate-850 hover:text-brand-gold text-slate-400 rounded-xl border border-slate-800 transition-all flex items-center gap-2 cursor-pointer"
                aria-label="Accéder à l'Espace Administrateur Véro-Design"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Espace Admin</span>
              </button>
            )}
            <button
              onClick={scrollToTop}
              className="px-4 py-3 bg-slate-900 hover:bg-slate-850 hover:text-brand-pink text-slate-400 rounded-xl border border-slate-800 transition-all flex items-center gap-2 cursor-pointer"
              aria-label="Retour en haut"
            >
              <span>Haut de page</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
