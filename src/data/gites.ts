/**
 * 21 gîtes du Domaine du Château de Chaussy.
 *
 * Capacités et types sont à confirmer côté Château — c'est un placeholder
 * cohérent qui permet d'afficher la section et de laisser les invités
 * exprimer leur préférence via le RSVP. Mettre à jour quand on a les vraies
 * fiches gîtes.
 */

export type GiteType = "studio" | "cottage" | "famille" | "groupe";

export interface Gite {
  number: number;
  name: string;
  capacity: number;     // nombre de couchages
  type: GiteType;
  /** Bref descriptif (optionnel). */
  blurb?: string;
}

export const GITES: Gite[] = [
  { number: 1,  name: "Le Coquelicot",  capacity: 4,  type: "famille" },
  { number: 2,  name: "L'Olivier",      capacity: 2,  type: "studio" },
  { number: 3,  name: "Le Lavandin",    capacity: 4,  type: "cottage" },
  { number: 4,  name: "La Bergerie",    capacity: 6,  type: "famille" },
  { number: 5,  name: "Le Pigeonnier",  capacity: 2,  type: "studio" },
  { number: 6,  name: "L'Amandier",     capacity: 4,  type: "cottage" },
  { number: 7,  name: "Le Tilleul",     capacity: 6,  type: "famille" },
  { number: 8,  name: "La Vigne",       capacity: 8,  type: "groupe" },
  { number: 9,  name: "Le Figuier",     capacity: 4,  type: "cottage" },
  { number: 10, name: "La Magnanerie",  capacity: 8,  type: "groupe" },
  { number: 11, name: "Le Romarin",     capacity: 2,  type: "studio" },
  { number: 12, name: "Le Mûrier",      capacity: 4,  type: "cottage" },
  { number: 13, name: "La Cigale",      capacity: 6,  type: "famille" },
  { number: 14, name: "Le Genêt",       capacity: 4,  type: "cottage" },
  { number: 15, name: "L'Iris",         capacity: 2,  type: "studio" },
  { number: 16, name: "Le Châtaignier", capacity: 6,  type: "famille" },
  { number: 17, name: "La Garrigue",    capacity: 8,  type: "groupe" },
  { number: 18, name: "Le Mistral",     capacity: 4,  type: "cottage" },
  { number: 19, name: "L'Hirondelle",   capacity: 6,  type: "famille" },
  { number: 20, name: "La Treille",     capacity: 4,  type: "cottage" },
  { number: 21, name: "Le Belvédère",   capacity: 8,  type: "groupe" },
];

export const TOTAL_CAPACITY = GITES.reduce((sum, g) => sum + g.capacity, 0);
