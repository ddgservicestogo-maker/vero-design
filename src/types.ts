/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string; // e.g., "15 000 FCFA"
  image: string;
  badge?: string; // e.g., "Populaire", "Nouveau"
  details: string[]; // specific details about the creation
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string; // name of Lucide icon to render dynamically
  details: string[];
}

export interface CustomOrderRequest {
  serviceId: string;
  fullName: string;
  phone: string;
  fabricOption: 'client' | 'vero'; // whether client brings fabric or Vero supplies it
  details: string;
  estimatedDate?: string;
}
