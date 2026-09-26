/**
 * The destination list.
 *
 *   budget  1 = €, 2 = €€, 3 = €€€
 *   types   array of keys from TRIP_TYPES, e.g. ['beach', 'food']
 *
 * To add a place, append an object with the same shape. The id must be unique —
 * it is what "Save this" stores in localStorage and what the saved list keys on.
 * A place should carry 2–4 types; one type is too coarse to filter on, and more
 * than four stops being a useful filter.
 */
export const DESTINATIONS = [
  // ── € ──────────────────────────────────────────────────────────────────
  { id: 'lisbon', city: 'Lisbon', country: 'Portugal', budget: 1, types: ['city', 'culture', 'food', 'nightlife'], why: 'Tiled streets, pastel facades, and a riverfront that stays cheap.' },
  { id: 'krakow', city: 'Kraków', country: 'Poland', budget: 1, types: ['city', 'culture', 'food'], why: 'A medieval square you can eat dinner around for under €10.' },
  { id: 'budapest', city: 'Budapest', country: 'Hungary', budget: 1, types: ['city', 'culture', 'nightlife', 'food'], why: 'Thermal baths and ruin bars, all on a student-city budget.' },
  { id: 'warsaw', city: 'Warsaw', country: 'Poland', budget: 1, types: ['city', 'culture'], why: 'Rebuilt old town, big museums, and genuinely good coffee.' },
  { id: 'athens', city: 'Athens', country: 'Greece', budget: 1, types: ['city', 'culture', 'beach'], why: 'The Acropolis in the morning, cheap ferry rides to the islands after.' },
  { id: 'bratislava', city: 'Bratislava', country: 'Slovakia', budget: 1, types: ['city', 'culture', 'nature'], why: 'A castle on a hill above the Danube, two hours from Vienna.' },
  { id: 'tallinn', city: 'Tallinn', country: 'Estonia', budget: 1, types: ['city', 'culture', 'nature'], why: 'Medieval towers, design shops, and one of the best old towns up north.' },
  { id: 'valencia', city: 'Valencia', country: 'Spain', budget: 1, types: ['beach', 'city', 'food', 'culture'], why: 'Beach, futuristic City of Arts, and paella that costs almost nothing.' },
  { id: 'seville', city: 'Seville', country: 'Spain', budget: 1, types: ['culture', 'food', 'city', 'nightlife'], why: 'Orange trees, flamenco, and slow evenings in the old quarter.' },
  { id: 'porto', city: 'Porto', country: 'Portugal', budget: 1, types: ['city', 'food', 'culture'], why: 'Riverfront cellers and a city that is basically all azulejos.' },
  { id: 'florence', city: 'Florence', country: 'Italy', budget: 1, types: ['culture', 'city', 'food'], why: 'Renaissance everything, and dinner after 8pm when the tourists leave.' },
  { id: 'bologna', city: 'Bologna', country: 'Italy', budget: 1, types: ['city', 'food', 'culture'], why: 'Arcaded streets, porticoes, and the oldest university in the country.' },
  { id: 'belgrade', city: 'Belgrade', country: 'Serbia', budget: 1, types: ['nightlife', 'city', 'food'], why: 'Riverside nightlife and a fortress that is somehow always free.' },
  { id: 'sarajevo', city: 'Sarajevo', country: 'Bosnia & Herzegovina', budget: 1, types: ['culture', 'food', 'city'], why: 'An Ottoman-meets-Austrian old town and unreasonably good cheap food.' },

  // ── €€ ─────────────────────────────────────────────────────────────────
  { id: 'barcelona', city: 'Barcelona', country: 'Spain', budget: 2, types: ['city', 'beach', 'food', 'culture'], why: 'Gaudí in the morning, pintxos at night, sea in between.' },
  { id: 'rome', city: 'Rome', country: 'Italy', budget: 2, types: ['city', 'culture', 'food'], why: 'An empire of fountains and ruins, walkable end to end.' },
  { id: 'milan', city: 'Milan', country: 'Italy', budget: 2, types: ['city', 'food', 'culture', 'nightlife'], why: 'Last Supper, aperitivo hour, and shopping that justifies the flight.' },
  { id: 'verona', city: 'Verona', country: 'Italy', budget: 2, types: ['culture', 'city', 'food'], why: 'An arena in the middle of town and opera in the Roman square.' },
  { id: 'amsterdam', city: 'Amsterdam', country: 'Netherlands', budget: 2, types: ['city', 'culture', 'nightlife'], why: 'Canal cycling, brown cafés, and museums worth the queue.' },
  { id: 'copenhagen', city: 'Copenhagen', country: 'Denmark', budget: 2, types: ['city', 'food', 'nature'], why: 'Harbour baths, pastry, and the happiest bike lanes on earth.' },
  { id: 'stockholm', city: 'Stockholm', country: 'Sweden', budget: 2, types: ['city', 'nature', 'culture'], why: 'Archipelago ferries and an archipelago museum of a building.' },
  { id: 'reykjavik', city: 'Reykjavík', country: 'Iceland', budget: 2, types: ['nature', 'adventure'], why: 'Lagoons, waterfalls, and auroras if the sky cooperates.' },
  { id: 'edinburgh', city: 'Edinburgh', country: 'Scotland', budget: 2, types: ['city', 'culture', 'nature'], why: 'Volcanic hills, whisky bars, and festivals year round.' },
  { id: 'bordeaux', city: 'Bordeaux', country: 'France', budget: 2, types: ['food', 'city', 'culture'], why: 'Wine bars everywhere and 18th-century stone on every street.' },
  { id: 'zurich', city: 'Zürich', country: 'Switzerland', budget: 2, types: ['city', 'nature', 'culture'], why: 'A lake in the middle of a city and mountains twenty minutes away.' },
  { id: 'vienna', city: 'Vienna', country: 'Austria', budget: 2, types: ['city', 'culture', 'nightlife', 'food'], why: 'Imperial palaces, coffee houses, and a concert most nights.' },
  { id: 'prague', city: 'Prague', country: 'Czechia', budget: 2, types: ['city', 'culture', 'food', 'nightlife'], why: 'The most complete medieval skyline going, and cheap by default.' },
  { id: 'ljubljana', city: 'Ljubljana', country: 'Slovenia', budget: 2, types: ['city', 'nature', 'adventure'], why: 'A walkable whole city with a castle above it and a river through it.' },
  { id: 'dubrovnik', city: 'Dubrovnik', country: 'Croatia', budget: 2, types: ['beach', 'culture'], why: 'Walled old town on the Adriatic, best in shoulder season.' },
  { id: 'istanbul', city: 'Istanbul', country: 'Türkiye', budget: 2, types: ['city', 'culture', 'food'], why: 'Two continents, a ferry, and mosques that are works of art.' },
  { id: 'cape-town', city: 'Cape Town', country: 'South Africa', budget: 2, types: ['nature', 'adventure', 'beach'], why: 'Table Mountain in the clouds and a wine route an hour inland.' },
  { id: 'marrakech', city: 'Marrakech', country: 'Morocco', budget: 2, types: ['city', 'culture', 'food'], why: 'A medina that swallows you whole, and a rooftop for the sunset.' },

  // ── €€€ ────────────────────────────────────────────────────────────────
  { id: 'tokyo', city: 'Tokyo', country: 'Japan', budget: 3, types: ['city', 'food', 'nightlife', 'culture'], why: 'Neon, Michelin stars, and a rail network that works like magic.' },
  { id: 'kyoto', city: 'Kyoto', country: 'Japan', budget: 3, types: ['culture', 'nature', 'city'], why: 'Two thousand temples and a bamboo grove worth the early alarm.' },
  { id: 'singapore', city: 'Singapore', country: 'Singapore', budget: 3, types: ['city', 'food', 'nature', 'culture'], why: 'A rainforest city-state with the best hawker food anywhere.' },
  { id: 'new-york', city: 'New York', country: 'United States', budget: 3, types: ['city', 'culture', 'food', 'nightlife'], why: 'Every museum, every genre of food, walking distance between them.' },
  { id: 'vancouver', city: 'Vancouver', country: 'Canada', budget: 3, types: ['nature', 'city', 'adventure', 'beach'], why: 'Mountains behind glass towers, ocean in front, forest everywhere.' },
  { id: 'mexico-city', city: 'Mexico City', country: 'Mexico', budget: 3, types: ['food', 'culture', 'city'], why: 'Aztec ruins under a modern skyline, and tacos at every corner.' },
  { id: 'buenos-aires', city: 'Buenos Aires', country: 'Argentina', budget: 3, types: ['city', 'food', 'nightlife', 'culture'], why: 'Parisian boulevards, steak dinners, and a nightlife that starts late.' },
  { id: 'rio', city: 'Rio de Janeiro', country: 'Brazil', budget: 3, types: ['beach', 'nature', 'adventure'], why: 'Beach, cable car, and a statue you have seen in films.' },
  { id: 'dubai', city: 'Dubai', country: 'UAE', budget: 3, types: ['city', 'beach', 'adventure'], why: 'Impossible architecture and a desert safari on the same itinerary.' },
  { id: 'maldives', city: 'Malé', country: 'Maldives', budget: 3, types: ['beach', 'nature', 'adventure'], why: 'Overwater villas and a reef two metres below your feet.' },
  { id: 'bali', city: 'Ubud', country: 'Indonesia', budget: 3, types: ['nature', 'culture', 'beach', 'adventure'], why: 'Rice terraces and temple ceremonies inland from the surf beaches.' },
  { id: 'seoul', city: 'Seoul', country: 'South Korea', budget: 3, types: ['city', 'food', 'culture', 'nightlife'], why: 'Palaces, street food, and the best coffee shops on the continent.' },
  { id: 'hanoi', city: 'Hanoi', country: 'Vietnam', budget: 3, types: ['food', 'city', 'culture'], why: 'French-colonial lanes, pho at dawn, and endless cheap depth.' },
  { id: 'reykjavik-alt', city: 'Tromsø', country: 'Norway', budget: 3, types: ['nature', 'adventure'], why: 'Arctic light in winter, midnight sun in summer, dogs everywhere.' },
  { id: 'luxembourg', city: 'Luxembourg City', country: 'Luxembourg', budget: 3, types: ['city', 'culture', 'nature'], why: 'Fortress casemates, cliff walks, and a whole country for a weekend.' },
  { id: 'zanzibar', city: 'Zanzibar', country: 'Tanzania', budget: 3, types: ['beach', 'nature', 'culture', 'adventure'], why: 'Stone Town alleys, a spice tour, and dhow sails at sunset.' },
];

/**
 * The trip types a destination can be tagged with, in display order. Add a new key
 * here first, then tag destinations with it — the type filter builds itself from
 * this list, so nothing else needs touching.
 */
export const TRIP_TYPES = [
  { key: 'beach', label: 'Beach' },
  { key: 'city', label: 'City break' },
  { key: 'culture', label: 'Culture' },
  { key: 'nature', label: 'Nature' },
  { key: 'adventure', label: 'Adventure' },
  { key: 'food', label: 'Food' },
  { key: 'nightlife', label: 'Nightlife' },
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
