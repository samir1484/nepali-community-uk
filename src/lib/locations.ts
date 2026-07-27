/**
 * Curated UK locations for the /[type]/in/[location] landing pages.
 *
 * Listing `location` is free text (members type full addresses like
 * "464 Dudley Road, Wolverhampton, WV2 3AF"), so pages match on a
 * case-insensitive substring of `match` rather than an exact value.
 *
 * The list mixes the big UK cities with the towns that have the largest
 * Nepali and Gurkha communities — adding a location here creates its page
 * across all five listing types, so keep it to places worth ranking for.
 */
export type UkLocation = {
  slug: string;
  name: string;
  /** Substring searched for in a listing's free-text location. */
  match: string;
  region?: string;
};

export const UK_LOCATIONS: UkLocation[] = [
  { slug: "london", name: "London", match: "London" },
  { slug: "wolverhampton", name: "Wolverhampton", match: "Wolverhampton", region: "West Midlands" },
  { slug: "birmingham", name: "Birmingham", match: "Birmingham", region: "West Midlands" },
  { slug: "manchester", name: "Manchester", match: "Manchester", region: "Greater Manchester" },
  { slug: "reading", name: "Reading", match: "Reading", region: "Berkshire" },
  { slug: "aldershot", name: "Aldershot", match: "Aldershot", region: "Hampshire" },
  { slug: "farnborough", name: "Farnborough", match: "Farnborough", region: "Hampshire" },
  { slug: "ashford", name: "Ashford", match: "Ashford", region: "Kent" },
  { slug: "folkestone", name: "Folkestone", match: "Folkestone", region: "Kent" },
  { slug: "maidstone", name: "Maidstone", match: "Maidstone", region: "Kent" },
  { slug: "swindon", name: "Swindon", match: "Swindon", region: "Wiltshire" },
  { slug: "salisbury", name: "Salisbury", match: "Salisbury", region: "Wiltshire" },
  { slug: "leeds", name: "Leeds", match: "Leeds", region: "West Yorkshire" },
  { slug: "liverpool", name: "Liverpool", match: "Liverpool", region: "Merseyside" },
  { slug: "sheffield", name: "Sheffield", match: "Sheffield", region: "South Yorkshire" },
  { slug: "bristol", name: "Bristol", match: "Bristol" },
  { slug: "coventry", name: "Coventry", match: "Coventry", region: "West Midlands" },
  { slug: "leicester", name: "Leicester", match: "Leicester", region: "Leicestershire" },
  { slug: "nottingham", name: "Nottingham", match: "Nottingham", region: "Nottinghamshire" },
  { slug: "newcastle", name: "Newcastle", match: "Newcastle", region: "Tyne and Wear" },
  { slug: "portsmouth", name: "Portsmouth", match: "Portsmouth", region: "Hampshire" },
  { slug: "southampton", name: "Southampton", match: "Southampton", region: "Hampshire" },
  { slug: "oxford", name: "Oxford", match: "Oxford", region: "Oxfordshire" },
  { slug: "cambridge", name: "Cambridge", match: "Cambridge", region: "Cambridgeshire" },
  { slug: "colchester", name: "Colchester", match: "Colchester", region: "Essex" },
  { slug: "glasgow", name: "Glasgow", match: "Glasgow", region: "Scotland" },
  { slug: "edinburgh", name: "Edinburgh", match: "Edinburgh", region: "Scotland" },
  { slug: "cardiff", name: "Cardiff", match: "Cardiff", region: "Wales" },
  { slug: "belfast", name: "Belfast", match: "Belfast", region: "Northern Ireland" },
];

export function findLocation(slug: string): UkLocation | undefined {
  return UK_LOCATIONS.find((l) => l.slug === slug.toLowerCase());
}
