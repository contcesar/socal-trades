// ---------------------------------------------------------------------------
// Local SEO content for indexable category pages. Keyed by the page pathname
// (with trailing slash). Text is written here at build time, never generated
// at runtime.
//
// Every entry is reviewed: false until a human verifies it. Anything not
// confirmed (prices, exact permit-office names, rules) is marked inline as
// [VERIFY: ...] so it is easy to find and check. Do not remove a [VERIFY]
// marker without confirming the fact it flags.
//
// intro: 150-300 words. faqs: 3-5 question/answer pairs.
// ---------------------------------------------------------------------------

export interface FAQ {
  q: string;
  a: string;
}

export interface LocalContent {
  intro: string;
  faqs: FAQ[];
  reviewed: boolean;
}

export const LOCAL_CONTENT: Record<string, LocalContent> = {
  // ---- County landings (all trades) ----
  "/locations/los-angeles/": {
    intro:
      "Los Angeles County spans the coast at Long Beach and Santa Monica through the San Fernando Valley and out to the Antelope Valley, so a job in one city can look very different a few freeway exits away. Permits are handled by each city, not the county: work inside the City of Los Angeles goes through LADBS (the Los Angeles Department of Building and Safety), while cities like Long Beach, Pasadena and Torrance run their own building departments. Homes in unincorporated areas pull permits through Los Angeles County Public Works, Building and Safety. Much of the county's housing is old, with pre-1960 galvanized supply lines, cast-iron drains and undersized electrical panels that come up constantly on remodels and repairs. Hard water is common and shortens the life of water heaters and fixtures. Summer heat in the inland valleys drives heavy HVAC demand, and hillside and canyon neighborhoods sit in wildfire zones with extra defensible-space and material rules. Costs vary widely by city, the age of the home and the scope of the work, so it's worth getting more than one quote. The companies below serve cities across the county; check each profile for the exact areas they cover before you call.",
    faqs: [
      {
        q: "Do I need a permit for work in Los Angeles County?",
        a: "Usually yes for anything structural, electrical, plumbing, mechanical or a re-roof. In the City of Los Angeles permits go through LADBS; other cities run their own building departments, and unincorporated areas go through LA County Public Works, Building and Safety. Your contractor typically pulls the permit and can tell you whether your specific job needs one.",
      },
      {
        q: "Are the companies listed here licensed?",
        a: "Contractors doing work over $500 in California must hold a CSLB license. Confirm the license number on each company's profile or ask before you hire, and check it at the CSLB website.",
      },
      {
        q: "How much do projects cost in Los Angeles County?",
        a: "It depends heavily on the city, the age of the home and the scope of the work. Get at least two written estimates so you can compare fairly.",
      },
      {
        q: "How do I choose between companies?",
        a: "Compare ratings, read recent reviews, confirm they serve your city, and make sure the license and insurance are current. Getting a couple of quotes in writing is the easiest way to compare fairly.",
      },
    ],
    reviewed: true,
  },

  "/locations/orange/": {
    intro:
      "Orange County runs from the beach cities of Huntington Beach and Newport Beach through master-planned Irvine and inland to Anaheim and Yorba Linda. Compared with older parts of Los Angeles, a lot of the housing here is newer and built to more recent codes, though the coastal cities and older neighborhoods in Santa Ana and Orange still have aging systems. Permits are issued by each city's building division rather than the county; the City of Irvine runs a permit counter in its Community Development Department, and unincorporated areas go through OC Development Services. Many neighborhoods are governed by HOAs that add their own approval step for exterior work like roofing, paint colors, solar and fences, so budget time for that. Hard water is widespread and affects water heaters, tankless units and fixtures. Inland cities get hot in summer, pushing air-conditioning loads, while coastal salt air speeds up corrosion on metal fixtures and rooftop equipment. Costs vary by city and the scope of the work, so it's worth getting more than one quote. The companies listed below serve cities across the county; check each profile for the areas they actually cover.",
    faqs: [
      {
        q: "Who issues building permits in Orange County?",
        a: "Each city's building division handles its own permits. Unincorporated areas go through OC Development Services. Your contractor usually pulls the permit and can tell you whether your specific job needs one.",
      },
      {
        q: "Will my HOA need to approve the work?",
        a: "Often, yes, for anything visible from outside such as roofing, exterior paint, fences, windows and solar. Check your HOA's rules before you schedule, since approval can take a few weeks.",
      },
      {
        q: "Do I need to worry about hard water here?",
        a: "Hard water is common across Orange County and can shorten the life of water heaters and fixtures. Ask companies whether they recommend any treatment for your area.",
      },
    ],
    reviewed: true,
  },

  "/locations/san-diego/": {
    intro:
      "San Diego County reaches from the coast at La Jolla and Coronado inland to El Cajon and Escondido and east toward the mountains and desert, so conditions change quickly with elevation and distance from the water. In the City of San Diego, permits go through the Development Services Department; other cities such as Chula Vista, Oceanside and Carlsbad run their own building departments, and unincorporated areas go through San Diego County Planning & Development Services. Coastal neighborhoods deal with salt-air corrosion on rooftop HVAC units, metal fixtures and fasteners, plus a lot of stucco and tile-roof housing. Inland and back-country areas sit in wildfire zones with defensible-space and roofing-material rules. Expansive clay soils in parts of the county can move with the seasons and stress slabs, foundations and hardscape. Costs depend on the city, the age of the home and the scope [VERIFY: typical cost ranges for San Diego County]. The companies below serve cities across the county; check each profile for the exact areas they cover before reaching out.",
    faqs: [
      {
        q: "Where do I get a permit in the City of San Diego?",
        a: "Through the City of San Diego Development Services Department. Other cities in the county run their own building departments, and unincorporated areas go through San Diego County Planning & Development Services. The contractor typically handles it. [VERIFY: permit thresholds]",
      },
      {
        q: "Does the coast affect my roofing or HVAC?",
        a: "Yes. Salt air near the coast speeds up corrosion on rooftop equipment, metal flashing and fasteners. Ask companies about corrosion-resistant materials if you are close to the water.",
      },
      {
        q: "Are homes here affected by clay soil?",
        a: "Parts of the county have expansive clay soils that move seasonally and can stress foundations and concrete flatwork. [VERIFY: which areas are most affected] A contractor can tell you whether it applies to your lot.",
      },
    ],
    reviewed: false,
  },

  // ---- Trade + county pages ----
  "/trades/plumbing/los-angeles/": {
    intro:
      "Plumbers in Los Angeles County work on some of the oldest housing stock in Southern California. Homes built before 1960, common across LA, Pasadena and the older parts of the county, often still have galvanized steel supply lines that corrode and clog, and cast-iron drains that crack with age, so repipes and sewer-line work are frequent. Hard water is widespread and shortens the life of water heaters, tankless units and fixtures. Permits for plumbing work in the City of Los Angeles go through LADBS (the Los Angeles Department of Building and Safety); other cities such as Long Beach and Torrance run their own building departments, and unincorporated areas go through LA County Public Works, Building and Safety. A permit is generally required for water-heater replacement, repipes, sewer-line work and new fixtures, though minor repairs may not need one [VERIFY: exact plumbing permit thresholds for LA]. Typical costs range widely: [VERIFY: typical price range for water-heater replacement, repipe and drain cleaning in LA County]. The plumbers listed below serve cities across Los Angeles County. Check each profile for the exact areas they cover, confirm the CSLB license, and get a written estimate before work starts.",
    faqs: [
      {
        q: "Do I need a permit to replace a water heater in Los Angeles?",
        a: "In most cases yes, because it involves gas, water and sometimes seismic strapping and venting changes. In the City of LA this goes through LADBS; other cities use their own building departments. Your plumber usually pulls it. [VERIFY: exact thresholds]",
      },
      {
        q: "Why do older LA homes need repipes?",
        a: "Many pre-1960 homes were built with galvanized steel pipe that corrodes from the inside, lowering water pressure and discoloring water. Repiping in copper or PEX solves it. A plumber can scope the lines to confirm.",
      },
      {
        q: "How much does a plumber cost in Los Angeles County?",
        a: "It depends on the job and the city. [VERIFY: typical price ranges for common plumbing jobs in LA County] Get at least two written quotes to compare.",
      },
      {
        q: "Is hard water a problem in LA?",
        a: "Hard water is common across the county and can shorten the life of water heaters and fixtures with scale buildup. [VERIFY: local water hardness] Ask your plumber whether treatment makes sense for your home.",
      },
    ],
    reviewed: false,
  },

  "/trades/hvac/los-angeles/": {
    intro:
      "HVAC contractors in Los Angeles County cover a wide range of climates, from mild coastal cities like Long Beach and Santa Monica to the hot inland valleys of the San Fernando and Santa Clarita areas, where summer cooling loads are high. Older homes often have undersized ductwork, aging condensers and electrical panels that need upgrading before a modern high-efficiency or heat-pump system can be installed. Permits for HVAC changeouts in the City of Los Angeles go through LADBS (the Los Angeles Department of Building and Safety); other cities run their own building departments, and unincorporated areas go through LA County Public Works, Building and Safety. California's Title 24 energy rules apply to system replacements, which usually means duct testing and, in many cases, a permit [VERIFY: exact HVAC permit and Title 24 requirements for LA]. Rebates for high-efficiency and heat-pump equipment may be available [VERIFY: current rebate programs and amounts]. Typical costs vary by system size and home [VERIFY: typical price range for a full system changeout in LA County]. The HVAC companies below serve cities across Los Angeles County. Check each profile for coverage, confirm the CSLB license, and get a written, itemized estimate before committing.",
    faqs: [
      {
        q: "Do I need a permit to replace my AC or furnace in Los Angeles?",
        a: "Usually yes. Changeouts fall under California's Title 24 energy code and generally require a permit and duct testing. In the City of LA this goes through LADBS; other cities use their own departments. Your contractor typically handles it. [VERIFY: exact requirements]",
      },
      {
        q: "Are there rebates for high-efficiency HVAC?",
        a: "There are often utility and state rebates for high-efficiency and heat-pump systems, but programs change. [VERIFY: current rebate programs and amounts] Ask contractors which rebates they help process.",
      },
      {
        q: "Why does my older home need electrical work for a new AC?",
        a: "Older homes sometimes have panels that can't support a modern condenser or heat pump, so a panel or circuit upgrade may be needed. A contractor can check your panel's capacity during the estimate.",
      },
      {
        q: "How much does a new HVAC system cost in LA County?",
        a: "It depends on system size, efficiency and ductwork. [VERIFY: typical price range for a full changeout in LA County] Get two or three itemized quotes to compare equipment and labor.",
      },
    ],
    reviewed: false,
  },

  "/trades/roofing/los-angeles/": {
    intro:
      "Roofers in Los Angeles County deal with intense sun, occasional heavy winter storms, and a mix of roof types, from flat and low-slope roofs on older bungalows and mid-century homes to tile and composition-shingle roofs across the suburbs. UV exposure ages asphalt shingles and dries out flat-roof membranes, so re-roofs and repairs are steady work. Hillside and canyon neighborhoods, and much of the wildland-urban interface, fall under wildfire rules that require fire-rated roofing assemblies and can restrict certain materials [VERIFY: specific fire-rated roofing requirements for LA WUI zones]. Re-roofing permits in the City of Los Angeles go through LADBS (the Los Angeles Department of Building and Safety); other cities run their own building departments, and unincorporated areas go through LA County Public Works, Building and Safety. A permit is generally required for a re-roof or structural repair [VERIFY: exact roofing permit thresholds]. Costs depend on roof size, pitch, material and how many old layers must come off [VERIFY: typical price range for a re-roof in LA County]. The roofing companies below serve cities across Los Angeles County. Check each profile for coverage, confirm the CSLB license and insurance, and get a written scope that spells out materials and warranty.",
    faqs: [
      {
        q: "Do I need a permit to re-roof in Los Angeles?",
        a: "A full re-roof generally requires a permit. In the City of LA it goes through LADBS; other cities use their own building departments, and unincorporated areas go through LA County Public Works. Your roofer usually pulls it. [VERIFY: exact thresholds]",
      },
      {
        q: "Are there special roofing rules in fire zones?",
        a: "Homes in wildfire (WUI) areas typically need fire-rated roofing assemblies and may face material restrictions. [VERIFY: specific requirements for LA WUI zones] A roofer familiar with your area can confirm what's allowed.",
      },
      {
        q: "How long does a roof last in Los Angeles?",
        a: "It depends on the material and sun exposure. Asphalt shingles, tile and flat-roof membranes all age differently under LA's UV. [VERIFY: typical lifespans by material] Ask for the manufacturer and workmanship warranty in writing.",
      },
      {
        q: "How much does a new roof cost in LA County?",
        a: "It varies with size, pitch, material and tear-off. [VERIFY: typical price range for a re-roof in LA County] Get itemized quotes so you can compare materials and warranties, not just the bottom line.",
      },
    ],
    reviewed: false,
  },

  "/trades/hvac/riverside/": {
    intro:
      "HVAC contractors in Riverside County work in one of the hottest parts of Southern California, where summer highs regularly push air-conditioning systems hard from the city of Riverside out to Moreno Valley, Temecula and the Coachella Valley. That heat means cooling capacity, correct sizing and duct sealing matter more here than on the coast, and worn systems fail when they're needed most. Permits for HVAC changeouts are issued by each city; the City of Riverside handles them through its Building & Safety division, and unincorporated areas go through Riverside County Building & Safety [VERIFY: exact office names and process]. California's Title 24 energy rules apply to system replacements, usually requiring a permit and duct testing [VERIFY: exact HVAC permit requirements for Riverside County]. Hard water is common and can affect nearby plumbing and evaporative equipment, and parts of the county sit in wildfire zones. Rebates for high-efficiency and heat-pump systems may be available [VERIFY: current rebate programs and amounts]. Costs vary with system size and home [VERIFY: typical price range for a full changeout in Riverside County]. The HVAC companies below serve cities across Riverside County. Check each profile for coverage, confirm the CSLB license, and get an itemized written estimate.",
    faqs: [
      {
        q: "How important is correct AC sizing in Riverside's heat?",
        a: "Very. In Riverside County's high summer temperatures, an undersized system can't keep up and an oversized one short-cycles and wastes energy. A good contractor runs a load calculation rather than guessing from the old unit.",
      },
      {
        q: "Do I need a permit to replace my HVAC system?",
        a: "Usually yes. Changeouts fall under Title 24 and generally require a permit and duct testing. The City of Riverside uses its Building & Safety division; unincorporated areas use the county. Your contractor typically handles it. [VERIFY: exact requirements]",
      },
      {
        q: "Would a heat pump work well here?",
        a: "Heat pumps handle both cooling and the milder winters in much of the county, and may qualify for rebates. [VERIFY: current rebate programs] Ask contractors to compare a heat pump against a standard AC and furnace for your home.",
      },
    ],
    reviewed: false,
  },

  "/trades/roofing/san-diego/": {
    intro:
      "Roofers in San Diego County work across a lot of stucco-and-tile housing near the coast and composition-shingle roofs inland, in a climate that is mild but hard on materials in specific ways. Coastal cities like Oceanside, Carlsbad and Chula Vista get salt-air exposure that corrodes metal flashing, fasteners and rooftop penetrations, while inland and back-country areas around Escondido and Ramona sit in wildfire zones with fire-rated roofing rules [VERIFY: specific fire-rated roofing requirements for San Diego County WUI zones]. Strong sun ages asphalt shingles and dries out flat-roof membranes over time. In the City of San Diego, re-roofing permits go through the Development Services Department; other cities run their own building departments, and unincorporated areas go through San Diego County Planning & Development Services. A permit is generally required for a re-roof or structural repair [VERIFY: exact roofing permit thresholds]. Costs depend on size, pitch, material and tear-off [VERIFY: typical price range for a re-roof in San Diego County]. The roofing companies below serve cities across the county. Check each profile for coverage, confirm the CSLB license and insurance, and get a written scope covering materials, flashing and warranty.",
    faqs: [
      {
        q: "Does coastal salt air affect my roof in San Diego?",
        a: "Yes. Near the coast, salt air corrodes metal flashing, vents and fasteners faster, so corrosion-resistant materials are worth asking about. A roofer familiar with coastal work can spec the right components.",
      },
      {
        q: "Do I need a permit to re-roof in San Diego County?",
        a: "A full re-roof generally requires a permit. In the City of San Diego it goes through Development Services; other cities use their own departments, and unincorporated areas go through the county. Your roofer usually pulls it. [VERIFY: exact thresholds]",
      },
      {
        q: "What are the rules in wildfire areas?",
        a: "Homes in wildfire (WUI) zones typically need fire-rated roofing assemblies. [VERIFY: specific requirements for San Diego County WUI zones] A local roofer can confirm what your area requires.",
      },
    ],
    reviewed: false,
  },

  // ---- City pages (all trades) ----
  "/locations/los-angeles/long-beach/": {
    intro:
      "Long Beach sits on the coast at the southern edge of Los Angeles County, and its housing runs from historic Craftsman and Spanish-style homes near downtown and Belmont Shore to newer builds farther inland. That older coastal stock brings two recurring issues: aging plumbing and electrical systems in early- to mid-century homes, and salt-air corrosion that shortens the life of rooftop HVAC units, metal roof flashing and outdoor fixtures. Permits are issued by the City of Long Beach through its Development Services Department, Building & Safety [VERIFY: exact office name and counter process], rather than by Los Angeles County. Hard water is common and affects water heaters and fixtures. Homes near the water may also deal with moisture and older foundations. Whether you need a plumber, electrician, roofer, HVAC company or a remodeler, the contractors listed below serve Long Beach and nearby cities like Lakewood and Signal Hill. Check each profile for the exact areas they cover, confirm the CSLB license, and get a written estimate. Typical costs vary by trade and scope [VERIFY: typical cost ranges for common jobs in Long Beach].",
    faqs: [
      {
        q: "Who issues permits in Long Beach?",
        a: "The City of Long Beach runs its own building department through Development Services, Building & Safety, separate from LA County. Your contractor usually pulls the permit. [VERIFY: exact office name and thresholds]",
      },
      {
        q: "Does living near the coast affect my home's systems?",
        a: "Yes. Salt air corrodes rooftop HVAC equipment, metal roof flashing and outdoor fixtures faster than inland. Ask companies about corrosion-resistant materials if you're close to the water.",
      },
      {
        q: "Are older Long Beach homes prone to plumbing issues?",
        a: "Many older homes near downtown and the shore still have aging galvanized supply lines or cast-iron drains that eventually need replacing. A plumber can scope the lines to see what you have.",
      },
    ],
    reviewed: false,
  },

  "/locations/orange/irvine/": {
    intro:
      "Irvine is one of Orange County's largest master-planned cities, with a lot of housing built from the 1970s onward and newer villages still going up. Compared with older coastal or inland towns, homes here are generally newer and built to more recent codes, but they come with two local wrinkles: nearly every neighborhood has an HOA that must approve exterior work like roofing, paint, solar and fences, and hard water is widespread and hard on water heaters, tankless units and fixtures. Building permits in Irvine go through the city's Community Development Department, which runs a One Stop Shop for permits [VERIFY: exact office name and current process for Irvine]. Summer heat inland pushes air-conditioning loads, so HVAC sizing and duct sealing matter. Whether you need a plumber, electrician, HVAC company, roofer or remodeler, the contractors listed below serve Irvine and nearby cities like Tustin and Costa Mesa. Check each profile for coverage, confirm the CSLB license, factor in HOA approval time, and get a written estimate. Typical costs vary by trade and scope [VERIFY: typical cost ranges for common jobs in Irvine].",
    faqs: [
      {
        q: "Will my Irvine HOA need to approve the work?",
        a: "Very likely for anything visible from outside, such as roofing, exterior paint, solar and fences. Approval can take a few weeks, so start that process before scheduling the work.",
      },
      {
        q: "Where do I get a building permit in Irvine?",
        a: "Through the City of Irvine's Community Development Department, which runs a One Stop Shop for permits. Your contractor typically handles it. [VERIFY: exact office name and process]",
      },
      {
        q: "Is hard water a problem in Irvine?",
        a: "Hard water is common across the area and can shorten the life of water heaters and fixtures. [VERIFY: local water hardness] Ask companies whether any treatment is worth it for your home.",
      },
    ],
    reviewed: false,
  },
};

/** Content entry for a page path (with trailing slash), if one exists. */
export function getLocalContent(path: string): LocalContent | undefined {
  return LOCAL_CONTENT[path];
}
