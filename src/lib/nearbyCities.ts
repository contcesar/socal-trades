// Nearby-city adjacency for internal linking, keyed by city slug (slugify of
// the city name). Each city lists 4-6 nearby cities in Southern California.
// A link is only rendered when the target city page is actually indexable, so
// listing a city here that has no page is harmless.
export const NEARBY_CITIES: Record<string, string[]> = {
  // Los Angeles County
  "los-angeles": ["glendale", "pasadena", "burbank", "long-beach", "santa-monica", "torrance"],
  "long-beach": ["lakewood", "signal-hill", "torrance", "los-angeles", "carson", "cypress"],
  "pasadena": ["glendale", "burbank", "arcadia", "los-angeles", "alhambra", "monrovia"],
  "torrance": ["long-beach", "carson", "gardena", "redondo-beach", "los-angeles", "lomita"],
  "glendale": ["burbank", "pasadena", "los-angeles", "la-canada-flintridge"],
  "burbank": ["glendale", "pasadena", "los-angeles", "north-hollywood"],
  "santa-clarita": ["valencia", "san-fernando", "los-angeles", "palmdale"],

  // Orange County
  "anaheim": ["orange", "fullerton", "santa-ana", "garden-grove", "buena-park", "cypress"],
  "irvine": ["tustin", "costa-mesa", "santa-ana", "newport-beach", "lake-forest", "orange"],
  "santa-ana": ["orange", "tustin", "costa-mesa", "anaheim", "garden-grove", "irvine"],
  "costa-mesa": ["newport-beach", "irvine", "santa-ana", "huntington-beach", "fountain-valley"],
  "cypress": ["los-alamitos", "buena-park", "anaheim", "garden-grove", "long-beach"],
  "tustin": ["irvine", "santa-ana", "orange", "costa-mesa"],

  // San Diego County
  "san-diego": ["chula-vista", "la-mesa", "el-cajon", "national-city", "santee", "coronado"],
  "chula-vista": ["national-city", "san-diego", "imperial-beach", "el-cajon"],
  "oceanside": ["carlsbad", "vista", "san-marcos", "escondido"],
  "escondido": ["san-marcos", "vista", "poway", "san-diego"],
  "carlsbad": ["oceanside", "vista", "san-marcos", "encinitas"],

  // Riverside County
  "riverside": ["moreno-valley", "corona", "jurupa-valley", "rialto", "san-bernardino"],
  "moreno-valley": ["riverside", "perris", "corona", "san-bernardino"],
  "corona": ["riverside", "norco", "eastvale", "chino"],
  "palm-springs": ["cathedral-city", "palm-desert", "rancho-mirage", "desert-hot-springs"],
  "temecula": ["murrieta", "menifee", "wildomar", "lake-elsinore"],

  // San Bernardino County
  "san-bernardino": ["rialto", "colton", "highland", "redlands", "fontana", "riverside"],
  "fontana": ["rialto", "rancho-cucamonga", "ontario", "san-bernardino", "colton"],
  "ontario": ["rancho-cucamonga", "fontana", "chino", "upland", "montclair"],
  "rancho-cucamonga": ["ontario", "fontana", "upland", "rialto"],

  // Ventura County
  "ventura": ["oxnard", "camarillo", "santa-paula", "ojai"],
  "oxnard": ["ventura", "camarillo", "port-hueneme", "santa-paula"],
  "thousand-oaks": ["newbury-park", "westlake-village", "camarillo", "simi-valley"],
  "simi-valley": ["thousand-oaks", "moorpark", "chatsworth"],

  // Kern County
  "bakersfield": ["shafter", "delano", "arvin", "tehachapi", "taft"],
  "taft": ["bakersfield", "maricopa"],

  // Imperial County
  "el-centro": ["imperial", "brawley", "calexico", "holtville"],
  "calexico": ["el-centro", "imperial", "brawley"],
};

export function nearbyCitySlugs(slug: string): string[] {
  return NEARBY_CITIES[slug] ?? [];
}
