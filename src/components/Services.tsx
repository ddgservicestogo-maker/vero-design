/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Scissors, Sparkles, Crown, Gem, Home, ArrowRight, Check } from 'lucide-react';
import { SERVICES_LIST } from '../data';

interface ServicesProps {
  onSelectServiceForCustomOrder: (serviceId: string) => void;
}

export default function Services({ onSelectServiceForCustomOrder }: ServicesProps) {
  
  // Helper to render correct icon based on the service's iconName
  const renderIcon = (iconName: string) => {
    const iconClass = "w-6 h-6 text-brand-pink group-hover:text-white transition-colors duration-300";
    switch (iconName) {
      case 'Scissors':
        return <Scissors className={iconClass} />;
      case 'Sparkles':
        return <Sparkles className={iconClass} />;
      case 'Crown':
        return <Crown className={iconClass} />;
      case 'Gem':
        return <Gem className={iconClass} />;
      case 'Home':
        return <Home className={iconClass} />;
      default:
        return <Scissors className={iconClass} />;
    }
  };

  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-pink bg-brand-pink/5 px-4 py-2 rounded-full">
            Savoir-Faire & Qualité
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Nos Prestations de Couture
          </h2>
          <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full mt-2" />
          <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
            Chez <span className="font-semibold text-brand-pink">Véro-Design Couture</span>, chaque création est une célébration du détail. 
            Découvrez nos compétences d’artisan couturier et de créateur de mode.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES_LIST.map((service, index) => (
            <div
              key={service.id}
              className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-pink/20 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Card top details */}
              <div className="space-y-6">
                {/* Icon wrapper */}
                <div className="inline-flex p-4 rounded-2xl bg-brand-pink/5 group-hover:bg-brand-pink transition-all duration-300">
                  {renderIcon(service.iconName)}
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-brand-pink transition-colors">
                    {service.title}
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-slate-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Sublist of features */}
                <ul className="space-y-2.5 pt-4 border-t border-slate-100">
                  {service.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                      <Check className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action */}
              <div className="pt-8 mt-auto">
                <button
                  onClick={() => onSelectServiceForCustomOrder(service.id)}
                  className="inline-flex items-center gap-2 text-brand-pink group-hover:text-brand-pink-dark text-sm sm:text-base font-bold transition-all hover:translate-x-1 cursor-pointer"
                >
                  <span>Créer un projet sur-mesure</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Floating index decorator */}
              <div className="absolute top-6 right-8 text-slate-100 font-serif text-4xl font-black select-none pointer-events-none group-hover:text-brand-pink/5 transition-colors">
                {`0${index + 1}`}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
