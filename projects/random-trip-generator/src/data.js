/**
 * The destination list. `budget` is 1 = €, 2 = €€, 3 = €€€.
 *
 * To add a place, append an object with the same shape. The id must be unique —
 * it is what "Save this" stores in localStorage and what the saved list keys on.
 */
export const DESTINATIONS = [
  // ── € ──────────────────────────────────────────────────────────────────
  { id: 'lisbon', city: 'Lisbon', country: 'Portugal', budget: 1, why: 'Tiled streets, pastel facades, and a riverfront that stays cheap.' },
  { id: 'krakow', city: 'Kraków', country: 'Poland', budget: 1, why: 'A medieval square you can eat dinner around for under €10.' },
  { id: 'budapest', city: 'Budapest', country: 'Hungary', budget: 1, why: 'Thermal baths and ruin bars, all on a student-city budget.' },
  { id: 'warsaw', city: 'Warsaw', country: 'Poland', budget: 1, why: 'Rebuilt old town, big museums, and genuinely good coffee.' },
  { id: 'athens', city: 'Athens', country: 'Greece', budget: 1, why: 'The Acropolis in the morning, cheap ferry rides to the islands after.' },
  { id: 'bratislava', city: 'Bratislava', country: 'Slovakia', budget: 1, why: 'A castle on a hill above the Danube, two hours from Vienna.' },
  { id: 'tallinn', city: 'Tallinn', country: 'Estonia', budget: 1, why: 'Medieval towers, design shops, and one of the best old towns up north.' },
  { id: 'valencia', city: 'Valencia', country: 'Spain', budget: 1, why: 'Beach, futuristic City of Arts, and paella that costs almost nothing.' },
  { id: 'seville', city: 'Seville', country: 'Spain', budget: 1, why: 'Orange trees, flamenco, and slow evenings in the old quarter.' },
  { id: 'porto', city: 'Porto', country: 'Portugal', budget: 1, why: 'Riverfront cellars and a city that is basically all azulejos.' },
  { id: 'florence', city: 'Florence', country: 'Italy', budget: 1, why: 'Renaissance everything, and dinner after 8pm when the tourists leave.' },
  { id: 'bologna', city: 'Bologna', country: 'Italy', budget: 1, why: 'Arcaded streets, porticoes, and the oldest university in the country.' },
  { id: 'belgrade', city: 'Belgrade', country: 'Serbia', budget: 1, why: 'Riverside nightlife and a fortress that is somehow always free.' },
  { id: 'sarajevo', city: 'Sarajevo', country: 'Bosnia & Herzegovina', budget: 1, why: 'A Ottoman-meets-Austrian old town and unreasonably good cheap food.' },

  // ── €€ ─────────────────────────────────────────────────────────────────
  { id: 'barcelona', city: 'Barcelona', country: 'Spain', budget: 2, why: 'Gaudí in the morning, pintxos at night, sea in between.' },
  { id: 'rome', city: 'Rome', country: 'Italy', budget: 2, why: 'An empire of fountains and ruins, walkable end to end.' },
  { id: 'milan', city: 'Milan', country: 'Italy', budget: 2, why: 'Last Supper, aperitivo hour, and shopping that justifies the flight.' },
  { id: 'verona', city: 'Verona', country: 'Italy', budget: 2, why: 'An arena in the middle of town and opera in the Roman square.' },
  { id: 'amsterdam', city: 'Amsterdam', country: 'Netherlands', budget: 2, why: 'Canal cycling, brown cafés, and museums worth the queue.' },
  { id: 'copenhagen', city: 'Copenhagen', country: 'Denmark', budget: 2, why: 'Harbour baths, pastry, and the happiest bike lanes on earth.' },
  { id: 'stockholm', city: 'Stockholm', country: 'Sweden', budget: 2, why: 'Archipelago ferries and an archipelago museum of a building.' },
  { id: 'reykjavik', city: 'Reykjavík', country: 'Iceland', budget: 2, why: 'Lagoons, waterfalls, and auroras if the sky cooperates.' },
  { id: 'edinburgh', city: 'Edinburgh', country: 'Scotland', budget: 2, why: 'Volcanic hills, whisky bars, and festivals year round.' },
  { id: 'bordeaux', city: 'Bordeaux', country: 'France', budget: 2, why: 'Wine bars everywhere and 18th-century stone on every street.' },
  { id: 'zurich', city: 'Zürich', country: 'Switzerland', budget: 2, why: 'A lake in the middle of a city and mountains twenty minutes away.' },
  { id: 'vienna', city: 'Vienna', country: 'Austria', budget: 2, why: 'Imperial palaces, coffee houses, and a concert most nights.' },
  { id: 'prague', city: 'Prague', country: 'Czechia', budget: 2, why: 'The most complete medieval skyline going, and cheap by default.' },
  { id: 'ljubljana', city: 'Ljubljana', country: 'Slovenia', budget: 2, why: 'A walkable whole city with a castle above it and a river through it.' },
  { id: 'dubrovnik', city: 'Dubrovnik', country: 'Croatia', budget: 2, why: 'Walled old town on the Adriatic, best in shoulder season.' },
  { id: 'istanbul', city: 'Istanbul', country: 'Türkiye', budget: 2, why: 'Two continents, a ferry, and mosques that are works of art.' },
  { id: 'cape-town', city: 'Cape Town', country: 'South Africa', budget: 2, why: 'Table Mountain in the clouds and a wine route an hour inland.' },
  { id: 'marrakech', city: 'Marrakech', country: 'Morocco', budget: 2, why: 'A medina that swallows you whole, and a rooftop for the sunset.' },

  // ── €€€ ────────────────────────────────────────────────────────────────
  { id: 'tokyo', city: 'Tokyo', country: 'Japan', budget: 3, why: 'Neon, Michelin stars, and a rail network that works like magic.' },
  { id: 'kyoto', city: 'Kyoto', country: 'Japan', budget: 3, why: 'Two thousand temples and a bamboo grove worth the early alarm.' },
  { id: 'singapore', city: 'Singapore', country: 'Singapore', budget: 3, why: 'A rainforest city-state with the best hawker food anywhere.' },
  { id: 'new-york', city: 'New York', country: 'United States', budget: 3, why: 'Every museum, every genre of food, walking distance between them.' },
  { id: 'vancouver', city: 'Vancouver', country: 'Canada', budget: 3, why: 'Mountains behind glass towers, ocean in front, forest everywhere.' },
  { id: 'mexico-city', city: 'Mexico City', country: 'Mexico', budget: 3, why: 'Aztec ruins under a modern skyline, and tacos at every corner.' },
  { id: 'buenos-aires', city: 'Buenos Aires', country: 'Argentina', budget: 3, why: 'Parisian boulevards, steak dinners, and a nightlife that starts late.' },
  { id: 'rio', city: 'Rio de Janeiro', country: 'Brazil', budget: 3, why: 'Beach, cable car, and a statue you have seen in films.' },
  { id: 'dubai', city: 'Dubai', country: 'UAE', budget: 3, why: 'Impossible architecture and a desert safari on the same itinerary.' },
  { id: 'maldives', city: 'Malé', country: 'Maldives', budget: 3, why: 'Overwater villas and a reef two metres below your feet.' },
  { id: 'bali', city: 'Ubud', country: 'Indonesia', budget: 3, why: 'Rice terraces and temple ceremonies inland from the surf beaches.' },
  { id: 'seoul', city: 'Seoul', country: 'South Korea', budget: 3, why: 'Palaces, street food, and the best coffee shops on the continent.' },
  { id: 'hanoi', city: 'Hanoi', country: 'Vietnam', budget: 3, why: 'French-colonial lanes, pho at dawn, and endless cheap depth.' },
  { id: 'reykjavik-alt', city: 'Tromsø', country: 'Norway', budget: 3, why: 'Arctic light in winter, midnight sun in summer, dogs everywhere.' },
  { id: 'luxembourg', city: 'Luxembourg City', country: 'Luxembourg', budget: 3, why: 'Fortress casemates, cliff walks, and a whole country for a weekend.' },
  { id: 'zanzibar', city: 'Zanzibar', country: 'Tanzania', budget: 3, why: 'Stone Town alleys, a spice tour, and dhow sails at sunset.' },
];

export const BUDGET_LABELS = {
  1: '€',
  2: '€€',
  3: '€€€',
};

/**
 * Shown next to the tier glyphs on the card. Phrased as "Title: detail" so the
 * card can render it as `€€ · Mid-range: ...` without a double dash.
 */
export const BUDGET_MEANING = {
  1: 'Cheap: hostels, street food, public transport. Flights are the main cost.',
  2: 'Mid-range: decent hotels, sit-down dinners, a few paid museums.',
  3: 'Premium: better flights, nice rooms, and the expensive half of the menu.',
};
