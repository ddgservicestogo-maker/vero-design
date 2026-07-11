/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ShoppingBag, Sparkles, MapPin, Phone, Scissors } from 'lucide-react';

export default function Hero() {
  const scrollToSection = (id: string) => {
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

  return (
    <section
      id="accueil"
      className="relative min-h-[90vh] flex items-center justify-center pt-24 overflow-hidden bg-slate-950"
    >
      {/* Background Image with Rich Color Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600"
          alt="Haute Couture Atelier"
          className="w-full h-full object-cover opacity-35 scale-105 animate-subtle-zoom"
          referrerPolicy="no-referrer"
        />
        {/* Gradients blending with the pink-magenta and golden colors of the flyer */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent md:block hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
        {/* Soft custom ambient circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-pink/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-brand-gold/15 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full text-center md:text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-pink/10 border border-brand-pink/20 text-brand-gold-light text-xs sm:text-sm font-medium uppercase tracking-wider mx-auto md:mx-0"
            >
              <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
              <span>L'Élégance de la Couture sur-mesure</span>
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight"
              >
                Véro-Design <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink via-[#E04B7E] to-brand-gold">
                  Couture d'Exception
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-sans text-base sm:text-lg text-slate-300 max-w-xl mx-auto md:mx-0 leading-relaxed"
              >
                Atelier de haute couture à <span className="text-brand-gold-light font-semibold">Kpogan Agbétiko</span>. 
                De la confection de robes de cérémonie somptueuses aux accessoires de protection en satin, nous créons des pièces uniques qui subliment votre beauté naturelle.
              </motion.p>
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <button
                onClick={() => scrollToSection('creations')}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-brand-pink text-white font-medium hover:bg-brand-pink-dark hover:scale-[1.02] transition-all shadow-lg shadow-brand-pink/30 cursor-pointer text-sm sm:text-base"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Découvrir le Catalogue</span>
              </button>

              <button
                onClick={() => scrollToSection('sur-mesure')}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-slate-900 text-white border border-slate-800 hover:border-brand-gold/50 hover:bg-slate-850 hover:scale-[1.02] transition-all cursor-pointer text-sm sm:text-base"
              >
                <span>Demande de Sur-Mesure</span>
                <Scissors className="w-4 h-4 text-brand-gold" />
              </button>
            </motion.div>

            {/* Micro Details (from the flyer) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="pt-8 border-t border-slate-900 flex flex-wrap gap-x-8 gap-y-4 justify-center md:justify-start text-xs text-slate-400 font-sans font-medium"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-gold" />
                <span>Kpogan Agbétiko, Togo</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-pink" />
                <span>+228 79654100</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-gold" />
                <span>100% Fait Main / Sur-Mesure</span>
              </div>
            </motion.div>
          </div>

          {/* Visual Showcase - Side Card / Flyer mockup */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: 1 }}
              animate={{ opacity: 1, scale: 1, rotate: -1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mx-auto max-w-[360px] aspect-[4/5] rounded-3xl bg-slate-900 p-3 border border-slate-800 shadow-2xl overflow-hidden group"
            >
              {/* Card Image */}
              <div className="w-full h-full rounded-2xl overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=600"
                  alt="Robe de Cérémonie Véro-Design"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
                
                {/* Float elements */}
                <div className="absolute top-4 left-4 bg-brand-pink text-white text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                  Robe de Cérémonie Wax
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-md p-4 rounded-xl border border-white/10">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-serif text-base font-bold text-white">Robe Impériale</h3>
                    <span className="font-mono text-brand-gold font-bold text-xs bg-brand-gold/10 px-2 py-0.5 rounded">Dès 25k FCFA</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Motifs traditionnels wax de cérémonie d'une élégance intemporelle.
                  </p>
                </div>
              </div>

              {/* Decorative design elements */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-brand-gold/30 rounded-full blur-xl" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-brand-pink/30 rounded-full blur-xl" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
