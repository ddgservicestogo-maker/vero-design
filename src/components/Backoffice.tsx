/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Trash2, Edit3, Upload, X, Save, ArrowLeft, RefreshCw, 
  Sparkles, Check, Image as ImageIcon, AlertCircle, LogOut, ClipboardList
} from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS_LIST } from '../data';

interface BackofficeProps {
  products: Product[];
  onSaveProducts: (newProducts: Product[]) => void;
  onClose: () => void;
  onLogout: () => void;
}

export default function Backoffice({ products, onSaveProducts, onClose, onLogout }: BackofficeProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Tenues de Cérémonie');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [formPrice, setFormPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formDetails, setFormDetails] = useState<string[]>([]);
  const [detailInput, setDetailInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Dashboard & Orders State
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders'>('catalog');
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch orders from API
  const fetchOrders = async () => {
    setLoadingOrders(true);
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch('/api/orders/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (response.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      } else {
        alert('Erreur lors du changement de statut de la commande.');
      }
    } catch (e) {
      console.error(e);
      alert('Erreur réseau.');
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer/archiver cette commande ?')) {
      const token = localStorage.getItem('admin_token');
      try {
        const response = await fetch(`/api/orders/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          setOrders(orders.filter(o => o.id !== id));
        } else {
          alert('Erreur lors de la suppression de la commande.');
        }
      } catch (e) {
        console.error(e);
        alert('Erreur réseau.');
      }
    }
  };

  const categoriesList = [
    'Tenues de Cérémonie',
    'Prêt-à-porter & Tailleurs',
    'Accessoires en Satin',
    'Linge de Maison & Accessoires'
  ];

  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('Tenues de Cérémonie');
    setCustomCategory('');
    setIsCustomCategory(false);
    setFormPrice('');
    setFormDescription('');
    setFormImage('');
    setFormBadge('');
    setFormDetails([]);
    setDetailInput('');
    setErrorMsg('');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    
    if (categoriesList.includes(product.category)) {
      setFormCategory(product.category);
      setIsCustomCategory(false);
    } else {
      setFormCategory('Autre');
      setCustomCategory(product.category);
      setIsCustomCategory(true);
    }
    
    setFormPrice(product.price);
    setFormDescription(product.description);
    setFormImage(product.image);
    setFormBadge(product.badge || '');
    setFormDetails([...product.details]);
    setDetailInput('');
    setErrorMsg('');
    setIsFormOpen(true);
  };

  const handleAddDetail = () => {
    if (detailInput.trim()) {
      setFormDetails([...formDetails, detailInput.trim()]);
      setDetailInput('');
    }
  };

  const handleRemoveDetail = (index: number) => {
    setFormDetails(formDetails.filter((_, i) => i !== index));
  };

  // Convert File to Base64
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Veuillez uploader un fichier image valide (JPG, PNG, WEBP).');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFormImage(e.target.result as string);
        setErrorMsg('');
      }
    };
    reader.onerror = () => {
      setErrorMsg('Erreur lors de la lecture du fichier.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      setErrorMsg('Le nom du produit est obligatoire.');
      return;
    }
    if (!formPrice.trim()) {
      setErrorMsg('Le prix est obligatoire (ex: "15 000 FCFA" ou "Sur devis").');
      return;
    }
    if (!formDescription.trim()) {
      setErrorMsg('La description est obligatoire.');
      return;
    }
    if (!formImage.trim()) {
      setErrorMsg('Veuillez ajouter une image (par lien ou en la téléchargeant).');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');

    let finalImageUrl = formImage;
    const token = localStorage.getItem('admin_token');

    // Check if the image is a newly uploaded Base64 image
    if (formImage.startsWith('data:image/')) {
      try {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            fileName: `${formName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`,
            data: formImage
          })
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          finalImageUrl = uploadData.url;
        } else {
          const errData = await uploadRes.json();
          setErrorMsg(`Erreur d'upload de l'image: ${errData.error || 'Veuillez réessayer'}`);
          setIsSaving(false);
          return;
        }
      } catch (err) {
        console.error('Image upload failed:', err);
        setErrorMsg("Erreur réseau lors de l'upload de l'image.");
        setIsSaving(false);
        return;
      }
    }

    const finalCategory = isCustomCategory ? customCategory.trim() : formCategory;
    if (!finalCategory) {
      setErrorMsg('Veuillez spécifier la catégorie.');
      setIsSaving(false);
      return;
    }

    const finalDetails = formDetails.length > 0 ? formDetails : ['Confection sur-mesure', 'Finition soignée'];

    let updatedList: Product[];
    
    if (editingProduct) {
      // Edit mode
      updatedList = products.map((p) => 
        p.id === editingProduct.id 
          ? {
              ...p,
              name: formName.trim(),
              category: finalCategory,
              price: formPrice.trim(),
              description: formDescription.trim(),
              image: finalImageUrl,
              badge: formBadge.trim() || undefined,
              details: finalDetails,
            }
          : p
      );
    } else {
      // Add mode
      const newProduct: Product = {
        id: `custom-${Date.now()}`,
        name: formName.trim(),
        category: finalCategory,
        price: formPrice.trim(),
        description: formDescription.trim(),
        image: finalImageUrl,
        badge: formBadge.trim() || undefined,
        details: finalDetails,
      };
      updatedList = [newProduct, ...products];
    }

    onSaveProducts(updatedList);
    setIsFormOpen(false);
    setEditingProduct(null);
    setIsSaving(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette création du catalogue ?')) {
      const updated = products.filter((p) => p.id !== id);
      onSaveProducts(updated);
    }
  };

  const handleResetCatalog = () => {
    if (window.confirm('Attention : cela supprimera vos personnalisations pour restaurer le catalogue d\'origine de l\'atelier. Confirmer ?')) {
      onSaveProducts(PRODUCTS_LIST);
    }
  };

  return (
    <div id="backoffice-panel" className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-24">
      {/* Admin Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl transition-colors cursor-pointer group flex items-center gap-2 text-sm text-slate-300"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Voir le site</span>
            </button>
            <div className="h-8 w-[1px] bg-slate-800 hidden sm:block" />
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Espace Admin <span className="text-brand-gold">✂️</span>
              </h1>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-sans">
                Gestionnaire de Catalogue Véro-Design
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleResetCatalog}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-300 font-medium transition-all flex items-center gap-2 cursor-pointer"
              title="Réinitialiser le catalogue par défaut"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Réinitialiser</span>
            </button>
            {activeTab === 'catalog' && (
              <button
                onClick={handleOpenAddForm}
                className="px-5 py-2.5 bg-brand-pink hover:bg-brand-pink-dark text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-brand-pink/20 flex items-center gap-2 hover:scale-[1.02] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter une Création</span>
              </button>
            )}
            <button
              onClick={onLogout}
              className="px-4 py-2.5 bg-red-950/40 hover:bg-red-900/60 border border-red-900/30 hover:border-red-900/50 rounded-xl text-xs sm:text-sm text-red-200 font-medium transition-all flex items-center gap-2 cursor-pointer"
              title="Se déconnecter"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Navigation Tabs */}
        <div className="flex gap-6 border-b border-slate-850 mb-8 pb-px">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`pb-4 px-2 font-serif text-base sm:text-lg font-bold transition-all relative cursor-pointer ${
              activeTab === 'catalog'
                ? 'text-white border-b-2 border-brand-pink'
                : 'text-slate-450 hover:text-slate-200'
            }`}
          >
            Gestion du Catalogue
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-2 font-serif text-base sm:text-lg font-bold transition-all relative cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'text-white border-b-2 border-brand-pink'
                : 'text-slate-450 hover:text-slate-200'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Suivi des Commandes</span>
          </button>
        </div>

        {activeTab === 'orders' ? (
          <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-slate-800 bg-slate-950/40 flex justify-between items-center">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                Liste des commandes reçues ({orders.length})
              </h2>
              <button
                onClick={fetchOrders}
                disabled={loadingOrders}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loadingOrders ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {loadingOrders ? (
              <div className="p-12 text-center text-slate-500">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-brand-pink" />
                <p>Chargement des commandes...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[850px]">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/40 text-xs text-slate-400 uppercase font-mono tracking-wider">
                      <th className="py-4 px-6">Date / Heure</th>
                      <th className="py-4 px-6">Client</th>
                      <th className="py-4 px-6">Prestation</th>
                      <th className="py-4 px-6">Tissu</th>
                      <th className="py-4 px-6">Projet Couture</th>
                      <th className="py-4 px-6">Statut</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-900/30 transition-colors align-top">
                        <td className="py-4 px-6 text-xs text-slate-400 font-mono">
                          {new Date(order.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="py-4 px-6 font-semibold text-white">
                          {order.clientName}
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 bg-brand-pink/10 border border-brand-pink/20 text-brand-pink rounded-lg text-xs font-semibold">
                            {order.serviceTitle}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-xs">
                          {order.fabricOption === 'vero' ? (
                            <span className="text-brand-gold bg-brand-gold/10 border border-brand-gold/20 px-2.5 py-1 rounded-lg text-xs font-semibold">Fourni atelier</span>
                          ) : (
                            <span className="text-slate-450 bg-slate-900 border border-slate-850 px-2.5 py-1 rounded-lg text-xs font-medium">Fourni client</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-xs sm:text-sm text-slate-300 max-w-sm whitespace-pre-wrap leading-relaxed">
                          {order.details}
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none transition-colors cursor-pointer ${
                              order.status === 'Nouveau'
                                ? 'bg-blue-950/40 text-blue-400 border-blue-900/40 focus:border-blue-500'
                                : order.status === 'En cours'
                                ? 'bg-amber-950/40 text-amber-400 border-amber-900/40 focus:border-amber-500'
                                : order.status === 'Terminé'
                                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40 focus:border-emerald-500'
                                : 'bg-slate-900 text-slate-400 border-slate-800 focus:border-slate-500'
                            }`}
                          >
                            <option value="Nouveau">Nouveau</option>
                            <option value="En cours">En cours</option>
                            <option value="Terminé">Terminé</option>
                            <option value="Archivé">Archivé</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-2 bg-slate-900 hover:bg-red-950 border border-slate-800 hover:border-red-900/50 rounded-lg text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500">
                <p className="text-base">Aucune commande reçue pour le moment.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Helper Tip */}
            <div className="p-6 bg-slate-950/60 rounded-3xl border border-slate-800/80 mb-10 flex items-start gap-4 max-w-4xl">
              <div className="p-3 bg-brand-pink/10 rounded-2xl text-brand-pink shrink-0">
                <Sparkles className="w-6 h-6 text-brand-gold" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-200">Bienvenue Véro !</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Ajoutez vos nouvelles robes, jupes, chouchous ou bonnets. Vous pouvez uploader des photos directement depuis votre galerie d’appareil photo. Tous les prix, badges ("Tendance", "Populaire") et listes de détails peuvent être gérés de façon simple ci-dessous.
                </p>
              </div>
            </div>

            {/* Products Grid/List Table */}
            <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-800 bg-slate-950/40 flex justify-between items-center">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                  Liste des créations actives ({products.length})
                </h2>
              </div>

              {products.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/40 text-xs text-slate-400 uppercase font-mono tracking-wider">
                        <th className="py-4 px-6">Image / Miniature</th>
                        <th className="py-4 px-6">Nom de la Création</th>
                        <th className="py-4 px-6">Catégorie</th>
                        <th className="py-4 px-6">Prix</th>
                        <th className="py-4 px-6">Badge</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-slate-900/30 transition-colors">
                          {/* Image Thumbnail */}
                          <td className="py-4 px-6">
                            <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover" 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=200';
                                }}
                              />
                            </div>
                          </td>
                          {/* Product Name */}
                          <td className="py-4 px-6 font-medium text-white max-w-xs truncate" title={product.name}>
                            {product.name}
                          </td>
                          {/* Category */}
                          <td className="py-4 px-6">
                            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg text-xs font-semibold">
                              {product.category}
                            </span>
                          </td>
                          {/* Price */}
                          <td className="py-4 px-6 text-brand-gold-light font-bold text-sm">
                            {product.price}
                          </td>
                          {/* Badge */}
                          <td className="py-4 px-6">
                            {product.badge ? (
                              <span className="px-2 py-0.5 bg-brand-pink/20 border border-brand-pink/30 text-brand-pink text-[10px] uppercase tracking-wider font-bold rounded-full">
                                {product.badge}
                              </span>
                            ) : (
                              <span className="text-slate-600 text-xs">-</span>
                            )}
                          </td>
                          {/* Actions */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-2.5">
                              <button
                                onClick={() => handleOpenEditForm(product)}
                                className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-slate-300 hover:text-brand-gold transition-colors cursor-pointer"
                                title="Modifier"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 bg-slate-900 hover:bg-red-950 border border-slate-800 hover:border-red-900/50 rounded-lg text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500">
                  <p className="text-base">Aucun produit dans le catalogue actuellement.</p>
                  <button
                    onClick={handleOpenAddForm}
                    className="mt-4 text-sm font-bold text-brand-pink hover:underline"
                  >
                    Créer la première fiche produit
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Form Sidebar / Modal (Add and Edit) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full overflow-y-auto p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            
            <div className="space-y-6">
              {/* Form Title */}
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    {editingProduct ? 'Modifier la Création' : 'Nouvelle Création'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Renseignez les détails techniques du produit.
                  </p>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSaveProduct} className="space-y-5">
                
                {/* Product Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">
                    Nom du Produit *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Robe Sirène d'Or Wax"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink text-slate-100 rounded-xl font-sans text-sm transition-colors"
                  />
                </div>

                {/* Grid Category & Price & Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category Selection */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">
                      Catégorie *
                    </label>
                    <select
                      value={isCustomCategory ? 'Autre' : formCategory}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'Autre') {
                          setIsCustomCategory(true);
                          setFormCategory('Autre');
                        } else {
                          setIsCustomCategory(false);
                          setFormCategory(val);
                        }
                      }}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink text-slate-100 rounded-xl font-sans text-sm transition-colors"
                    >
                      {categoriesList.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value="Autre">Autre (Catégorie personnalisée)</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">
                      Prix (FCFA) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 15 000 FCFA ou Sur devis"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink text-slate-100 rounded-xl font-sans text-sm transition-colors"
                    />
                  </div>
                </div>

                {/* Custom Category Input if selected */}
                {isCustomCategory && (
                  <div className="space-y-1.5 animate-fade-in">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">
                      Saisir la nouvelle catégorie *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Robes de Cortège"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink text-slate-100 rounded-xl font-sans text-sm transition-colors"
                    />
                  </div>
                )}

                {/* Badge (Optional) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">
                    Badge de mise en valeur (Optionnel)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Populaire, Nouveau, Tendance, Best-Seller"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink text-slate-100 rounded-xl font-sans text-sm transition-colors"
                  />
                </div>

                {/* Photo Upload & Preview */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">
                    Photo du vêtement/accessoire *
                  </label>

                  {/* Drag and Drop Zone */}
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 relative overflow-hidden ${
                      dragActive 
                        ? 'border-brand-pink bg-brand-pink/5' 
                        : formImage 
                          ? 'border-slate-800 bg-slate-950/40' 
                          : 'border-slate-800 hover:border-brand-pink/50 hover:bg-slate-950/20'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {formImage ? (
                      <div className="space-y-3 w-full">
                        <div className="w-32 h-32 rounded-xl overflow-hidden mx-auto border border-slate-850 shadow-inner relative group">
                          <img 
                            src={formImage} 
                            alt="Prévisualisation" 
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-bold text-white uppercase font-sans">Changer</span>
                          </div>
                        </div>
                        <p className="text-xs text-brand-gold-light font-medium">Image chargée avec succès !</p>
                      </div>
                    ) : (
                      <>
                        <div className="p-3 bg-slate-950/50 rounded-full text-slate-400 border border-slate-800">
                          <Upload className="w-5 h-5 text-brand-pink" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-300">
                            Faites glisser votre photo ici ou <span className="text-brand-pink hover:underline">cliquez pour parcourir</span>
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Formats acceptés : JPG, PNG, WEBP.
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Manual input Link for web images fallback */}
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-medium">Ou saisissez un lien d'image direct sur le web :</p>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... (optionnel)"
                      value={formImage.startsWith('data:') ? '' : formImage}
                      onChange={(e) => {
                        if (e.target.value.trim()) {
                          setFormImage(e.target.value.trim());
                        }
                      }}
                      className="w-full px-4 py-2 bg-slate-950/50 border border-slate-850 focus:border-brand-pink focus:outline-none rounded-lg font-sans text-xs transition-colors"
                    />
                  </div>
                </div>

                {/* Description Textarea */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">
                    Description commerciale *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Décrivez les atouts, la coupe, l'occasion idéale de porter cette tenue..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink text-slate-100 rounded-xl font-sans text-sm transition-colors"
                  />
                </div>

                {/* Inclusions / Bullet technical details */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">
                    Détails techniques & Inclusions (liste à puces)
                  </label>
                  
                  {/* Render current sub details pills */}
                  {formDetails.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 p-3 bg-slate-950 rounded-xl border border-slate-850">
                      {formDetails.map((detail, index) => (
                        <div 
                          key={index} 
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-lg"
                        >
                          <span>{detail}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDetail(index)}
                            className="p-0.5 rounded text-slate-500 hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add detail subform inline */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ex: Tissu Wax 100% coton ciré lourd"
                      value={detailInput}
                      onChange={(e) => setDetailInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddDetail();
                        }
                      }}
                      className="flex-grow px-4 py-2 bg-slate-950 border border-slate-800 focus:border-brand-pink focus:outline-none rounded-xl text-slate-100 text-xs sm:text-sm font-sans"
                    />
                    <button
                      type="button"
                      onClick={handleAddDetail}
                      className="px-3 bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-all"
                    >
                      Ajouter
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">Appuyez sur "Ajouter" pour chaque caractéristique spécifique.</p>
                </div>

                {/* Validation message */}
                {errorMsg && (
                  <div className="flex items-center gap-2 p-3 bg-red-950/20 border border-red-900/30 text-xs text-red-400 rounded-xl">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Save controls */}
                <div className="flex gap-3 pt-4 border-t border-slate-850">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-grow py-3.5 bg-brand-pink hover:bg-brand-pink-dark disabled:bg-slate-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-brand-pink/20 flex items-center justify-center gap-2 hover:scale-[1.01] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sauvegarde en cours...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Enregistrer dans le catalogue</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-3.5 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-xl text-xs sm:text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                </div>

              </form>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
