/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Search, MessageCircle, ChevronDown, ChevronUp, Info, Sparkles } from 'lucide-react';
import { PRODUCTS_LIST, getProductWhatsAppLink } from '../data';
import { Product } from '../types';

interface CatalogProps {
  products: Product[];
}

export default function Catalog({ products }: CatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tout');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const categories = [
    'Tout',
    'Tenues de Cérémonie',
    'Prêt-à-porter & Tailleurs',
    'Accessoires en Satin',
    'Linge de Maison & Accessoires',
  ];

  // Filtering products
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'Tout' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    if (expandedCardId === id) {
      setExpandedCardId(null);
    } else {
      setExpandedCardId(id);
    }
  };

  return (
    <section id="creations" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-pink bg-brand-pink/5 px-4 py-2 rounded-full">
            Showroom Virtuel
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Découvrez nos Créations
          </h2>
          <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full mt-2" />
          <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
            Chaque modèle présenté ci-dessous peut être commandé dans les tissus de votre choix et adapté précisément à vos mesures.
          </p>
        </div>

        {/* Filter & Search Bar Controls */}
        <div className="space-y-6 mb-12">
          {/* Search Input */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une création (ex: wax, satin, tailleur...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink text-slate-800 rounded-2xl transition-all font-sans text-sm sm:text-base shadow-inner"
            />
          </div>

          {/* Categories Selector */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer border ${
                  selectedCategory === category
                    ? 'bg-brand-pink text-white border-brand-pink shadow-md shadow-brand-pink/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:text-brand-pink hover:border-brand-pink/40 hover:bg-slate-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Catalog Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const isExpanded = expandedCardId === product.id;
              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                >
                  {/* Product Image Area */}
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Category Overlay tag */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[10px] uppercase tracking-wider font-bold text-slate-700 px-3 py-1 rounded-full border border-slate-100">
                      {product.category}
                    </div>

                    {/* Populaire / Tendance Custom Badges */}
                    {product.badge && (
                      <div className="absolute top-4 right-4 bg-brand-pink text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow-md">
                        {product.badge}
                      </div>
                    )}
                  </div>

                  {/* Card Content Area */}
                  <div className="p-6 flex flex-col justify-between flex-grow space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 group-hover:text-brand-pink transition-colors">
                          {product.name}
                        </h3>
                        <span className="font-sans text-xs sm:text-sm font-extrabold text-brand-pink bg-brand-pink/5 px-2.5 py-1 rounded-lg shrink-0">
                          {product.price}
                        </span>
                      </div>

                      <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Expandable Technical details drawer */}
                    <div className="border-t border-slate-50 pt-4">
                      <button
                        onClick={() => toggleExpand(product.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-pink transition-colors cursor-pointer"
                      >
                        <span>Fiche technique & inclusions</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-3 bg-slate-50 rounded-xl p-4 border border-slate-100 animate-fade-in space-y-2">
                          <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-brand-gold" />
                            Caractéristiques de l'œuvre
                          </p>
                          <ul className="grid grid-cols-1 gap-1.5">
                            {product.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-gold mt-1.5 shrink-0" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* WhatsApp Action Redirect */}
                    <div className="pt-2">
                      <a
                        href={getProductWhatsAppLink(product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-sm font-bold transition-all shadow-md shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.01] cursor-pointer"
                      >
                        <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                        <span>Commander via WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-100 p-8">
            <p className="text-slate-500 text-base sm:text-lg mb-4">Aucune création ne correspond à votre recherche.</p>
            <button
              onClick={() => { setSelectedCategory('Tout'); setSearchQuery(''); }}
              className="text-sm font-bold text-brand-pink hover:underline cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Interactive Modification Tip */}
        <div className="mt-16 p-6 rounded-3xl bg-brand-pink/5 border border-brand-pink/10 flex flex-col sm:flex-row items-center gap-4 max-w-4xl mx-auto">
          <div className="p-3 rounded-2xl bg-white text-brand-pink shrink-0 shadow-sm">
            <Info className="w-6 h-6" />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-sans text-sm sm:text-base font-bold text-slate-900">
              Chaque modèle est personnalisable !
            </h4>
            <p className="font-sans text-xs sm:text-sm text-slate-600">
              Le tissu, la couleur et les mesures de n’importe quelle pièce de notre catalogue peuvent être adaptés selon vos préférences. Discutez de vos idées directement avec Véro en cliquant sur le bouton de commande.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
