/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, Ruler, CheckCircle2, AlertCircle } from 'lucide-react';
import { SERVICES_LIST, getCustomOrderWhatsAppLink } from '../data';

interface CustomOrderProps {
  selectedServiceId: string;
  onServiceChange: (serviceId: string) => void;
}

export default function CustomOrder({ selectedServiceId, onServiceChange }: CustomOrderProps) {
  const [fullName, setFullName] = useState('');
  const [fabricOption, setFabricOption] = useState<'client' | 'vero'>('client');
  const [details, setDetails] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Selected service details
  const currentService = SERVICES_LIST.find((s) => s.id === selectedServiceId) || SERVICES_LIST[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setErrorMessage('Veuillez entrer votre nom complet.');
      return;
    }

    if (!details.trim()) {
      setErrorMessage('Veuillez décrire brièvement votre projet (coupe, mesures, etc.).');
      return;
    }

    setErrorMessage('');
    const link = getCustomOrderWhatsAppLink(currentService.title, fullName, fabricOption, details);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="sur-mesure" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Absolute decorative bubbles */}
      <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-brand-pink/5 blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-brand-gold/5 blur-3xl translate-y-1/3 translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-pink bg-brand-pink/5 px-4 py-2 rounded-full">
            Création Exclusive
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Votre Projet Sur-Mesure
          </h2>
          <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full mt-2" />
          <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
            Remplissez notre formulaire interactif pour concevoir votre tenue idéale. Votre demande sera instantanément mise en forme pour l'envoyer directement sur notre WhatsApp de l'atelier !
          </p>
        </div>

        {/* Form Container Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-stretch">
          
          {/* Column 1: Interactive Form */}
          <div className="lg:col-span-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Service Select */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-800 font-sans">
                  Type de service souhaité
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => onServiceChange(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink rounded-xl text-slate-800 font-sans text-sm sm:text-base transition-colors"
                >
                  {SERVICES_LIST.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Full Name input */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-800 font-sans">
                  Votre Nom Complet
                </label>
                <input
                  type="text"
                  placeholder="Ex : Marie Koffi"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink rounded-xl text-slate-800 font-sans text-sm sm:text-base transition-colors shadow-inner"
                />
              </div>

              {/* Fabric Choice Segmented Control */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-800 font-sans">
                  Qui fournit le tissu ?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFabricOption('client')}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      fabricOption === 'client'
                        ? 'border-brand-pink bg-brand-pink/5 text-slate-900 font-semibold shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      fabricOption === 'client' ? 'border-brand-pink bg-brand-pink' : 'border-slate-300'
                    }`}>
                      {fabricOption === 'client' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div className="text-xs sm:text-sm">
                      <p className="font-bold">Je fournis mon pagne</p>
                      <p className="text-slate-500 font-normal">Vous apportez votre tissu à l'atelier</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFabricOption('vero')}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      fabricOption === 'vero'
                        ? 'border-brand-pink bg-brand-pink/5 text-slate-900 font-semibold shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      fabricOption === 'vero' ? 'border-brand-pink bg-brand-pink' : 'border-slate-300'
                    }`}>
                      {fabricOption === 'vero' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div className="text-xs sm:text-sm">
                      <p className="font-bold">L'atelier fournit le tissu</p>
                      <p className="text-slate-500 font-normal">Véro vous propose un choix de wax ou satin</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Project description */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-800 font-sans">
                  Décrivez votre projet couture
                </label>
                <textarea
                  rows={4}
                  placeholder="Ex : Je souhaite confectionner une robe longue évasée pour une dote de mariage, style sirène, taille M, avec mes propres motifs wax et des manches ballon transparentes..."
                  value={details}
                  onChange={(e) => {
                    setDetails(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink rounded-xl text-slate-800 font-sans text-sm sm:text-base transition-colors shadow-inner"
                />
              </div>

              {/* Error validation message */}
              {errorMessage && (
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-red-500 font-sans">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Button Submit */}
              <button
                type="submit"
                className="flex items-center justify-center gap-2.5 w-full py-4 rounded-xl bg-brand-pink hover:bg-brand-pink-dark text-white text-sm sm:text-base font-bold transition-all shadow-md shadow-brand-pink/20 hover:scale-[1.01] cursor-pointer mt-4"
              >
                <MessageCircle className="w-5 h-5 fill-white text-brand-pink" />
                <span>Envoyer ma demande sur WhatsApp</span>
              </button>

            </form>
          </div>

          {/* Column 2: Informative Guide */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Atelier Steps */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 h-full flex flex-col justify-center">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-50 pb-4">
                <Ruler className="w-5 h-5 text-brand-gold" />
                <span>Le Processus de Création</span>
              </h3>
              
              <ul className="space-y-6 py-4">
                <li className="flex gap-4">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-pink/10 text-brand-pink font-bold text-sm shrink-0">1</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Prise de contact</h4>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">Envoyez ce formulaire pour démarrer la discussion de votre modèle avec Véro.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-pink/10 text-brand-pink font-bold text-sm shrink-0">2</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Prise de mesures & Devis</h4>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">Nous convenons d'un rendez-vous à l'atelier à Kpogan pour affiner vos mesures de manière professionnelle.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-pink/10 text-brand-pink font-bold text-sm shrink-0">3</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Confection & Essayage</h4>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">Véro assemble minutieusement vos étoffes. Un premier essayage est prévu pour parfaire la silhouette finale.</p>
                  </div>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
