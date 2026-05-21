/**
 * Destinations du carnet de voyage de Clémence & Dorian.
 * Modifier librement : chaque entrée devient une "carte postale" dans la
 * section Voyages. Si une `image` est fournie, elle s'affichera ; sinon
 * c'est l'aquarelle décorative qui occupe la place.
 */

export interface Voyage {
  id: string;
  country: string;
  city: string;
  year: string;
  flag: string;         // emoji drapeau
  anecdote: string;
  /** Position approx. sur le globe — utilisée par la mini-carte (lat, lng). */
  coords: [number, number];
  /** Optionnel : photo à afficher (chemin public). */
  image?: string;
  /** Aquarelle décorative associée (id du manifeste). */
  motifId?: string;
}

export const VOYAGES: Voyage[] = [
  {
    id: "kyoto",
    country: "Japon",
    city: "Kyoto",
    year: "2024",
    flag: "🇯🇵",
    anecdote:
      "Dorian a mangé son premier ramen à 7h du matin, après une nuit blanche à se perdre entre les torii rouges du Fushimi Inari.",
    coords: [35.0116, 135.7681],
    motifId: "abeille-fleur",
  },
  {
    id: "osaka",
    country: "Japon",
    city: "Osaka",
    year: "2024",
    flag: "🇯🇵",
    anecdote:
      "Trois jours à enchaîner les izakaya. On y a décidé, autour d'un takoyaki, que ce serait là, un jour, qu'on reviendrait pour notre voyage de noces.",
    coords: [34.6937, 135.5023],
    motifId: "cocktail-grenade",
  },
  {
    id: "hanoi",
    country: "Vietnam",
    city: "Hanoï",
    year: "2023",
    flag: "🇻🇳",
    anecdote:
      "La moto qu'on n'aurait pas dû louer. Aucune carte, aucun mot de vietnamien — juste un coucher de soleil à Tam Coc qu'on n'oubliera jamais.",
    coords: [21.0285, 105.8542],
    motifId: "bouquet-coccinelle",
  },
  {
    id: "bangkok",
    country: "Thaïlande",
    city: "Bangkok",
    year: "2023",
    flag: "🇹🇭",
    anecdote:
      "Le pad thaï du marché de Chinatown à 23h, et les klaxons des tuk-tuks comme bande-son. Ville folle, soirées plus folles encore.",
    coords: [13.7563, 100.5018],
    motifId: "cocktail-citron",
  },
  {
    id: "grenoble",
    country: "France",
    city: "Grenoble",
    year: "2019",
    flag: "🇫🇷",
    anecdote:
      "Là où tout a commencé. Un regard à la fac, un café qui s'est éternisé, et la certitude qu'on ne s'éloignerait plus très longtemps.",
    coords: [45.1885, 5.7245],
    motifId: "dahlia",
  },
  {
    id: "chaussy",
    country: "France",
    city: "Château de Chaussy",
    year: "2027",
    flag: "💍",
    anecdote:
      "La destination finale. Du moins, le début d'une autre.",
    coords: [44.4434, 4.3411],
    motifId: "abeille",
  },
];
