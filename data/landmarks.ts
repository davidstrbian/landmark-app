export type LandmarkCategory = "peak" | "national-park" | "wilderness-area";

export type Hike = {
  name?: string; // the trail's own name, if it has one
  trailhead: string;
  distance: string; // e.g. "8.2 km", "71 km + 12 km"
  duration?: string;
  elevationGainM?: number; // total ascent
};

// Fields shown in the fell and wilderness detail views that can carry a note
// for review.
export type FellField =
  | "coordinates"
  | "relief"
  | "difficulty"
  | "hike"
  | "protectedArea"
  | "wildlife"
  | "trail"
  | "reindeer";

export type Landmark = {
  id: string; // slug
  name: string;
  category: LandmarkCategory;
  region: string;
  description: string; // 2-4 sentences
  elevationM?: number; // peaks
  areaKm2?: number; // parks
  bestSeason?: string;
  nearestTown?: string;
  image: string; // path under /public, or "" until a licensed photo is added
  imageCredit?: string;
  // Omitted when no reliable source was found; not displayed for parks yet.
  lat?: number;
  lng?: number;

  // Fell details. Leave a field out when it can't be sourced; the detail view
  // then shows it as missing so it can be filled in later.
  // relief and protectedArea are kept in the data but not shown for now.
  relief?: { label: string; metres: number }; // prominence or height gain
  difficulty?: number; // 1–5 in half steps, shown as stars
  hike?: Hike;
  protectedArea?: string; // national park or wilderness area
  notes?: Partial<Record<FellField, string>>; // shown under the field

  // Wilderness area details. Size uses areaKm2.
  rank?: number; // 1 = wildest, used for sorting
  wildernessScore?: number; // 1–5, shown as stars
  wildlife?: string[]; // kept in the data but not shown for now
  reindeer?: ReindeerLikelihood; // chance of seeing reindeer
  reindeerBasis?: string; // what the rating rests on; not shown for now

  // National park details. Size uses areaKm2.
  established?: number; // year
  // One type when the park is known for it; several mean "Mixed".
  nature?: NatureType[];
  trail?: { name: string; distance: string; duration?: string }; // not shown for now
};

export type NatureType =
  | "Forest"
  | "Fell"
  | "Mire"
  | "Archipelago"
  | "Lake Scenery"
  | "Rivers and Rapids"; // Oulanka only

// How likely a visitor is to see reindeer, from most to least likely.
export const REINDEER_LEVELS = [
  "Very likely",
  "Likely",
  "Possible",
  "Rare",
] as const;
export type ReindeerLikelihood = (typeof REINDEER_LEVELS)[number];

// What completing a landmark is called: peaks are conquered, parks and
// wilderness areas are visited.
export const COMPLETION: Record<
  LandmarkCategory,
  { done: string; action: string }
> = {
  peak: { done: "Conquered", action: "Mark as conquered" },
  "national-park": { done: "Visited", action: "Mark as visited" },
  "wilderness-area": { done: "Visited", action: "Mark as visited" },
};

// Figures follow Metsähallitus (nationalparks.fi / luontoon.fi) where available,
// otherwise Wikipedia/Wikidata/PeakVisor. Park coordinates are a representative
// centre point.
export const landmarks: Landmark[] = [
  // Finnish fells, in display order
  {
    id: "halti",
    name: "Halti",
    category: "peak",
    region: "Enontekiö, Lapland",
    description:
      "Finland's highest point sits on a shoulder of Halti fell, right on the Norwegian border in the far northwest. Reaching it is a multi-day trek across open, treeless Käsivarsi wilderness, usually from Kilpisjärvi along the Nordkalott Trail. The summit cairn rewards the effort with views over Norway's higher peaks.",
    elevationM: 1324,
    image: "",
    lat: 69.3081,
    lng: 21.2633,
    difficulty: 5,
    hike: {
      name: "Haltin vaellusreitti",
      trailhead: "Kilpisjärvi",
      distance: "104 km",
      duration: "7 days",
      elevationGainM: 580,
    },
    protectedArea: "Käsivarsi Wilderness Area",
  },
  {
    id: "saana",
    name: "Saana",
    category: "peak",
    region: "Enontekiö, Lapland",
    description:
      "Saana's flat-topped, steep-sided silhouette towers over Kilpisjärvi village and lake, making it one of Finland's most recognisable fells. The fell is protected as part of the Saana Nature Reserve. On a clear day the views from the top reach into Sweden and Norway.",
    elevationM: 1029,
    image: "",
    lat: 69.0436,
    lng: 20.8561,
    relief: { label: "Height above Lake Kilpisjärvi", metres: 556 },
    difficulty: 3.5,
    hike: {
      name: "Saanan huiputus",
      trailhead: "Malla and Saana parking area, Kilpisjärvi",
      distance: "8.6 km",
      duration: "4 h",
      elevationGainM: 550,
    },
    protectedArea: "Saana Nature Reserve",
  },
  {
    id: "ukko-koli",
    name: "Ukko-Koli",
    category: "peak",
    region: "Lieksa, North Karelia",
    description:
      "Ukko-Koli is the highest of the Koli hills, rising about 250 metres above Lake Pielinen. Its view of islands scattered across the lake inspired Finnish painters and composers in the 1890s and became a symbol of Finnish national landscape. A short path leads from the Koli visitor centre to the summit rocks.",
    elevationM: 347,
    image: "",
    lat: 63.0944,
    lng: 29.8086,
    relief: { label: "Prominence", metres: 253 },
    difficulty: 1,
    hike: {
      name: "Huippujen kierros",
      trailhead: "Koli Nature Centre Ukko",
      distance: "1.4 km",
      duration: "30 min",
    },
    protectedArea: "Koli National Park",
  },
  {
    id: "taivaskero",
    name: "Taivaskero",
    category: "peak",
    region: "Muonio, Lapland",
    description:
      "Taivaskero is the highest summit of the Pallastunturi fells and of the whole Pallas-Yllästunturi National Park. A popular loop trail starts at the Pallastunturi visitor centre and crosses bare, rocky fell tops. In 1952 a flame for the Helsinki Olympic torch relay was lit on its summit by the midnight sun.",
    elevationM: 809,
    image: "",
    lat: 68.074833,
    lng: 24.053361,
    relief: { label: "Prominence", metres: 509 },
    difficulty: 3,
    hike: {
      name: "Taivaskeron kierros",
      trailhead: "Pallastunturi Visitor Centre",
      distance: "8.2 km",
      duration: "3.5 h",
      elevationGainM: 350,
    },
    protectedArea: "Pallas-Yllästunturi National Park",
  },
  {
    id: "sokosti",
    name: "Sokosti",
    category: "peak",
    region: "Sodankylä, Lapland",
    description:
      "Sokosti is the highest fell in Urho Kekkonen National Park and in eastern Lapland. It rises from the remote heart of the park, a few kilometres east of Lake Luirojärvi, and is usually climbed as part of a multi-day wilderness trek. From the bouldery summit the Saariselkä fells roll away in every direction.",
    elevationM: 718,
    image: "",
    lat: 68.219,
    lng: 28.1376,
    difficulty: 4.5,
    hike: {
      name: "Luirojärven kierros + Sokostin huiputus",
      trailhead: "Kiilopää",
      distance: "71 km + 12 km",
      duration: "5 days",
      elevationGainM: 430,
    },
    protectedArea: "Urho Kekkonen National Park",
  },
  {
    id: "kiilopaa",
    name: "Kiilopää",
    category: "peak",
    region: "Sodankylä, Lapland",
    description:
      "Kiilopää is one of the best-known fells of the Saariselkä area, a rounded, bare-topped summit right next to the Kiilopää fell centre. A well-marked trail climbs to the top in about two kilometres, with long sections of steps. From the summit the wilderness of Urho Kekkonen National Park stretches as far as the eye can see.",
    elevationM: 546,
    image: "",
    lat: 68.341703,
    lng: 27.503431,
    difficulty: 2.5,
    hike: {
      name: "Kiirunapolku",
      trailhead: "Kiilopää fell centre",
      distance: "5.7 km",
      duration: "2.5 h",
      elevationGainM: 210,
    },
    protectedArea: "Urho Kekkonen National Park",
  },
  {
    id: "riisitunturi",
    name: "Riisitunturi",
    category: "peak",
    region: "Posio, Lapland",
    description:
      "Riisitunturi is a twin-topped fell and the highest point of Riisitunturi National Park in Posio. In winter its spruces disappear under thick crown snow, turning the slopes into a landscape of frozen white figures. A short loop trail from the car park climbs to the open summit.",
    elevationM: 465,
    image: "",
    lat: 66.223,
    lng: 28.5591,
    difficulty: 1.5,
    hike: {
      name: "Riisin rääpäsy",
      trailhead: "Riisitunturi car park",
      distance: "4.5 km",
      duration: "2 h",
      elevationGainM: 120,
    },
    protectedArea: "Riisitunturi National Park",
  },
  {
    id: "noitatunturi",
    name: "Noitatunturi",
    category: "peak",
    region: "Pelkosenniemi, Lapland",
    description:
      "Noitatunturi, the 'witch fell', is the highest top of the Pyhätunturi fell chain and of Pyhä-Luosto National Park. The final climb is steep and rocky. From the summit the view opens over the forests and wide aapa mires of southern Lapland.",
    elevationM: 540,
    image: "",
    lat: 67.0138,
    lng: 27.1483,
    relief: { label: "Prominence", metres: 339 },
    difficulty: 3.5,
    hike: {
      name: "Noitatunturin valloitus",
      trailhead: "Pyhä Nature Centre Naava",
      distance: "12.5 km",
      duration: "5 h",
      elevationGainM: 340,
    },
    protectedArea: "Pyhä-Luosto National Park",
  },

  {
    id: "sarkitunturi",
    name: "Särkitunturi",
    category: "peak",
    region: "Muonio, Lapland",
    description:
      "Särkitunturi is a compact fell in Muonio, just outside Pallas-Yllästunturi National Park, with its trailhead right by road 79 between Muonio and Levi. A short, signposted trail leads past a campfire shelter to the summit. It is one of the quickest ways to reach open fell-top views in western Lapland.",
    elevationM: 492,
    image: "",
    lat: 67.867643,
    lng: 23.94985,
    difficulty: 2.5,
    hike: {
      name: "Särkitunturin saavutus",
      trailhead: "Särkitunturi parking area, road 79",
      distance: "6.4 km",
      duration: "3 h",
      elevationGainM: 190,
    },
    // Elevation: 492 m in most sources, but one Komoot listing gives 510 m.
    // Protected area: none found; the fell is just outside the national park.
  },
  {
    id: "kumputunturi",
    name: "Kumputunturi",
    category: "peak",
    region: "Kittilä, Lapland",
    description:
      "Kumputunturi is a solitary fell in Kittilä with a steep northern face and a gentler southern slope. The fell and its surroundings are a Natura 2000 site, and Metsähallitus lists it as a historical site. There are no facilities on the open summit, and fog or storms can roll in within hours.",
    elevationM: 581,
    image: "",
    lat: 67.722,
    lng: 25.5612,
    difficulty: 3,
    hike: {
      name: "Kumputunturin reitti",
      trailhead: "Kittilä–Sodankylä road (road 80), then a gravel road",
      distance: "8.4 km",
      duration: "3.5 h",
      elevationGainM: 320,
    },
    protectedArea: "Natura 2000 site",
  },

  // Wilderness areas, ranked from wildest (scores and sizes from the site owner).
  // All are in Lapland, so regions list only the municipalities.
  {
    id: "muotkatunturi",
    name: "Muotkatunturi",
    category: "wilderness-area",
    region: "Inari",
    description:
      "Muotkatunturi stretches from a rolling, treeless fell plateau cut by river valleys in the north to mountain birch woods, bogs and old pine forests in the south. Lake Peltojärvi is its largest lake, fed by countless rivers and brooks. There are no marked trails, so visitors plan their own routes.",
    areaKm2: 1570,
    image: "",
    lat: 69.151889,
    lng: 26.306,
    rank: 1,
    wildernessScore: 5,
    wildlife: ["Reindeer", "Golden eagle", "Willow grouse", "Mountain hare"],
    reindeer: "Likely",
    reindeerBasis:
      "Part of the Muotkatunturi and Paistunturi herding districts, with about 2 to 2.6 reindeer per km².",
  },
  {
    id: "kaldoaivi",
    name: "Kaldoaivi",
    category: "wilderness-area",
    region: "Utsjoki",
    description:
      "Kaldoaivi is Finland's largest wilderness area, a roadless expanse of fells that continues across the border into Norway. Its landscape ranges from deep, steep-sided river valleys to gentle fell slopes, and it is one of Finland's most important breeding grounds for arctic waders. The only marked route, the Sevettijärvi–Pulmanki trail, crosses it from south to north.",
    areaKm2: 2924,
    image: "",
    lat: 69.69125,
    lng: 27.867861,
    rank: 2,
    wildernessScore: 5,
    wildlife: ["Golden plover", "Gyrfalcon", "Snowy owl", "Bar-tailed godwit", "Otter", "Reindeer"],
    reindeer: "Very likely",
    reindeerBasis:
      "About 10,000 reindeer graze here, and herding is a main livelihood.",
  },
  {
    id: "paistunturi",
    name: "Paistunturi",
    category: "wilderness-area",
    region: "Utsjoki",
    description:
      "Paistunturi is a land of fell heaths, mountain birch forest and aapa and palsa mires, split in two by the Kevo Strict Nature Reserve. Rolling highlands and deep river valleys fill its middle and north, where Gáimmoivi, its highest fell, looks out toward Norway's snowy peaks. Old nesting mounds recall the Arctic fox, which last bred here in 1996.",
    areaKm2: 1570,
    image: "",
    lat: 69.594333,
    lng: 26.713389,
    rank: 3,
    wildernessScore: 4,
    wildlife: ["Reindeer", "Lemmings", "Voles"],
    reindeer: "Very likely",
    reindeerBasis:
      "Almost half of the Paistunturi herding district's land lies inside the area.",
  },
  {
    id: "hammastunturi",
    name: "Hammastunturi",
    category: "wilderness-area",
    region: "Inari",
    description:
      "Hammastunturi lies between Urho Kekkonen and Lemmenjoki national parks. Pine forests and low fells grow on nutrient-poor granulite bedrock, and the Ivalojoki river winds through the area. Its gold-rush past lives on at Kultala, where hundreds of prospectors once lived.",
    areaKm2: 1825,
    image: "",
    lat: 68.571583,
    lng: 26.683083,
    rank: 4,
    wildernessScore: 4,
    wildlife: ["Golden eagle", "Siberian jay", "Siberian tit", "Northern hawk owl", "Willow grouse", "Otter"],
    reindeer: "Very likely",
    reindeerBasis:
      "Reindeer use it all year round, with summer, winter, calving and rutting pastures.",
  },
  {
    id: "vatsari",
    name: "Vätsäri",
    category: "wilderness-area",
    region: "Inari",
    description:
      "Vätsäri runs from the north-eastern shore of Lake Inari to the Norwegian border, a maze of thousands of small lakes, rocky ground and Scots pine taiga. The rocky bays of Lake Inari reach deep into its backwoods. The difficult terrain makes it one of Lapland's most demanding hiking destinations.",
    areaKm2: 1550,
    image: "",
    lat: 69.340778,
    lng: 28.831944,
    rank: 5,
    wildernessScore: 4,
    wildlife: ["Brown bear", "Pine marten", "Red fox", "Stoat", "Spotted redshank"],
    reindeer: "Likely",
    reindeerBasis:
      "Shared by four herding districts, with about 2 reindeer per km².",
  },
  {
    id: "poyrisjarvi",
    name: "Pöyrisjärvi",
    category: "wilderness-area",
    region: "Enontekiö",
    description:
      "Pöyrisjärvi is known for its sand dunes and long sandy ridges, most of them on the north side of Lake Pöyrisjärvi. Small lakes with sandy shores dot the area, dry pine forest gives way to birch further north, and the Pöyrisvuoma mire is one of Finland's most valuable palsa bogs. Late summer and early autumn are the most popular times to visit.",
    areaKm2: 1280,
    image: "",
    lat: 68.583722,
    lng: 24.133972,
    rank: 6,
    wildernessScore: 4,
    wildlife: ["Brown bear", "Wolverine", "Lynx", "Wading birds", "Waterfowl"],
    reindeer: "Very likely",
    reindeerBasis:
      "The Näkkälä herding district's summer pasture.",
  },
  {
    id: "kasivarsi",
    name: "Käsivarsi",
    category: "wilderness-area",
    region: "Enontekiö",
    description:
      "Käsivarsi, in Finland's north-western 'arm', lies mostly above the treeline and holds all but one of the country's fells over 1,000 metres. The average yearly temperature stays below freezing and the growing season lasts only about a hundred days. Its rocky plateau is home to rare plants and animals found nowhere else in Finland.",
    areaKm2: 2206,
    image: "",
    lat: 68.977278,
    lng: 21.587333,
    rank: 7,
    wildernessScore: 3,
    wildlife: ["Arctic fox", "Wolverine", "Lynx", "Snowy owl", "Peregrine falcon", "Reindeer"],
    reindeer: "Likely",
    reindeerBasis:
      "Lies entirely within the Käsivarsi herding district, with about 2 reindeer per km².",
  },
  {
    id: "tarvantovaara",
    name: "Tarvantovaara",
    category: "wilderness-area",
    region: "Enontekiö",
    description:
      "Tarvantovaara is a landscape of free-flowing rivers, wetlands and low fells, bordered to the north-west by the Lätäseno-Hietajoki mire reserve. The Tarvantojoki river through its centre is gentle enough for beginner canoeists. Nature writer Yrjö Kokko found his first whooper swan nests here, work that helped save the species in Finland.",
    areaKm2: 670,
    image: "",
    lat: 68.568639,
    lng: 22.91625,
    rank: 8,
    wildernessScore: 3,
    wildlife: ["Whooper swan", "Willow grouse", "Mountain hare", "Waterfowl"],
    reindeer: "Very likely",
    reindeerBasis:
      "5,000 to 7,000 reindeer graze here: about 40% of the Käsivarsi district's pasture.",
  },
  {
    id: "pulju",
    name: "Pulju",
    category: "wilderness-area",
    region: "Enontekiö",
    description:
      "Pulju is a land of large mires and rounded hills and fells, with spruce on the southern hills giving way to pine and fell birch in the north. Road 956 runs through its centre, making it one of the easiest wilderness areas to reach. In late summer its mires draw cloudberry pickers.",
    areaKm2: 614,
    image: "",
    lat: 68.342333,
    lng: 24.915361,
    rank: 9,
    wildernessScore: 3,
    wildlife: ["Willow grouse", "Mountain hare", "Capercaillie", "Black grouse", "Stoat"],
    reindeer: "Likely",
    reindeerBasis:
      "Shared by three herding districts, with about 1.7 to 2.3 reindeer per km².",
  },
  {
    id: "kemihaara",
    name: "Kemihaara",
    category: "wilderness-area",
    region: "Savukoski",
    description:
      "Kemihaara borders Urho Kekkonen National Park to the north and the Kemijoki river to the east. Pine backwoods, spruce-filled ravines and rocky fells over 420 metres high meet wide aapa mires that feed the headwaters of the Kemijoki and Pihtijoki rivers. Its mires are an important breeding ground for wading birds.",
    areaKm2: 302,
    image: "",
    lat: 67.963734,
    lng: 28.710301,
    rank: 10,
    wildernessScore: 2,
    wildlife: ["Wading birds", "Willow grouse", "Reindeer"],
    reindeer: "Very likely",
    reindeerBasis:
      "An important summer pasture on the reindeer's route to their calving grounds.",
  },
  {
    id: "tuntsa",
    name: "Tuntsa",
    category: "wilderness-area",
    region: "Savukoski",
    description:
      "Tuntsa lies where the northern limit of spruce forest crosses eastern Lapland. In 1960 it was hit by Finland's largest recorded forest fire, and much of the burnt land is still open today, visible from the UKK hiking trail. Its bogs yield rich cloudberry crops and its slopes are covered in blueberry and lingonberry.",
    areaKm2: 212,
    image: "",
    lat: 67.646583,
    lng: 29.52725,
    rank: 11,
    wildernessScore: 2,
    wildlife: ["Boreal forest birds"],
    reindeer: "Likely",
    reindeerBasis:
      "Part of the Pohjois-Salla herding district, with about 2 reindeer per km², though a 1960 forest fire destroyed much of its pasture.",
    notes: {
      wildlife:
        "BirdLife says 13 of Europe's 15 boreal-forest bird species breed in the wider Värriö–Tuntsa area, but names no animals for Tuntsa itself.",
    },
  },
  {
    id: "tsarmitunturi",
    name: "Tsarmitunturi",
    category: "wilderness-area",
    region: "Inari",
    description:
      "Tsarmitunturi lies in south-eastern Inari on the Russian border, between the roads to Nellim and Raja-Jooseppi. Spruce and pine forests cover the Tsarmitunturi highland and Akalauttapää, separated by the deep Pahakuru gorge. It protects Finland's northernmost continuous spruce forest untouched by people.",
    areaKm2: 150,
    image: "",
    lat: 68.679972,
    lng: 28.389028,
    rank: 12,
    wildernessScore: 2,
    wildlife: ["Brown bear", "Moose", "Reindeer", "Red fox", "Capercaillie", "Willow grouse"],
    reindeer: "Likely",
    reindeerBasis:
      "Part of the Ivalo herding district, with about 2 reindeer per km².",
  },

  // National parks, in the site owner's order (region, year and size from
  // the site owner; nature types, descriptions and trails from Metsähallitus and
  // other sources).
  {
    id: "etela-konnevesi",
    name: "Etelä-Konnevesi",
    category: "national-park",
    region: "Keski-Suomi",
    description:
      "Rocky, forested hills rise straight out of the clear waters of Lake Konnevesi. Its trails climb to sweeping lake views and pass through groves of giant aspens.",
    areaKm2: 15.44,
    image: "",
    established: 2014,
    nature: ["Lake Scenery"],
    trail: { name: "Kolmen vuoren vaellus (Three Hills hike)", distance: "14 km", duration: "6–12 h" },
  },
  {
    id: "helvetinjarvi",
    name: "Helvetinjärvi",
    category: "national-park",
    region: "Pirkanmaa",
    description:
      "A rugged forest park of steep rocky hills, narrow lakes and deep gorges cut along fault lines in the bedrock. It is best known for Helvetinkolu, a steep, narrow cleft in the rock.",
    areaKm2: 49.8,
    image: "",
    established: 1982,
    nature: ["Forest", "Lake Scenery"],
    trail: { name: "Helvetistä itään nature trail", distance: "4 km" },
    notes: {
      trail: "No official duration found. The Haukanhieta–Helvetinkolu section has been reported closed due to flooding.",
    },
  },
  {
    id: "hiidenportti",
    name: "Hiidenportti",
    category: "national-park",
    region: "Kainuu",
    description:
      "Old spruce forests, small mires and ponds fill this backwoods park in Kainuu. Its centrepiece is the Hiidenportti gorge, where sheer cliff walls drop up to 20 metres.",
    areaKm2: 45,
    image: "",
    established: 1982,
    nature: ["Forest"],
    trail: { name: "Hiidenkierros", distance: "3–5 km", duration: "2–4 h" },
  },
  {
    id: "hossa",
    name: "Hossa",
    category: "national-park",
    region: "Kainuu",
    description:
      "Clear lakes, rivers and pine-clad eskers make up this park on the edge of the Kainuu backwoods. Its best-known sights are the Värikallio rock paintings and the Julma-Ölkky canyon lake.",
    areaKm2: 11,
    image: "",
    established: 2017,
    nature: ["Lake Scenery"],
    trail: { name: "Värikallion kaarros", distance: "8 km", duration: "3–4 h" },
  },
  {
    id: "isojarvi",
    name: "Isojärvi",
    category: "national-park",
    region: "Keski-Suomi",
    description:
      "Rugged forested hills and lakes whose woods still tell the story of a century of logging. The oldest trees grow in the Latokuusikko old-growth forest, and today the only loggers at work are beavers.",
    areaKm2: 19,
    image: "",
    established: 1982,
    nature: ["Forest"],
    trail: { name: "Savottapolku (Logging Trail)", distance: "10 km", duration: "3–5 h" },
  },
  {
    id: "itainen-suomenlahti",
    name: "Itäinen Suomenlahti",
    category: "national-park",
    region: "Kymenlaakso",
    description:
      "Rocky outer islands and skerries scattered across the eastern Gulf of Finland. On Ulko-Tammio, a nature trail and a wartime history trail cross the island.",
    areaKm2: 6.7,
    image: "",
    established: 1982,
    nature: ["Archipelago"],
    trail: { name: "Ulko-Tammio nature trail", distance: "2.8 km", duration: "1–2 h" },
  },
  {
    id: "kauhaneva-pohjankangas",
    name: "Kauhaneva–Pohjankangas",
    category: "national-park",
    region: "Etelä-Pohjanmaa",
    description:
      "Here the vast Kauhaneva raised bog meets the sandy ridge of the Pohjankangas esker. Duckboard trails lead out to bog pools and a viewing tower.",
    areaKm2: 57,
    image: "",
    established: 1982,
    nature: ["Mire"],
    trail: { name: "Kauhalammin kierros", distance: "2.7 km", duration: "2 h" },
  },
  {
    id: "koli-national-park",
    name: "Koli",
    category: "national-park",
    region: "Pohjois-Karjala",
    description:
      "Ancient quartzite hills rise above Lake Pielinen, mixing old forests, slash-and-burn meadows and lake shores. The island-dotted view from Ukko-Koli became a symbol of the Finnish national landscape.",
    areaKm2: 30,
    image: "",
    established: 1991,
    nature: ["Forest", "Lake Scenery"],
    trail: { name: "Herajärven kierros", distance: "about 61 km", duration: "3–4 days" },
  },
  {
    id: "kolovesi",
    name: "Kolovesi",
    category: "national-park",
    region: "Etelä-Savo",
    description:
      "Steep rocky shores, narrow straits and forested islands on Lake Saimaa, best explored by canoe. Rock paintings around 5,000 years old decorate the cliffs of Ukonvuori.",
    areaKm2: 23,
    image: "",
    established: 1990,
    nature: ["Lake Scenery"],
    trail: { name: "Mäntysalo trail", distance: "3.8 km", duration: "about 2 h" },
    notes: {
      trail: "The trail can only be reached by water.",
    },
  },
  {
    id: "kurjenrahka",
    name: "Kurjenrahka",
    category: "national-park",
    region: "Varsinais-Suomi",
    description:
      "Open bogs and forested islands of higher ground make up this mire park north of Turku. At its heart stands the Kuhankuono boundary mark, reached by a short boardwalk.",
    areaKm2: 29,
    image: "",
    established: 1998,
    nature: ["Mire"],
    trail: { name: "Savojärvi trail", distance: "6 km", duration: "2.5 h" },
  },
  {
    id: "lauhanvuori",
    name: "Lauhanvuori",
    category: "national-park",
    region: "Etelä-Pohjanmaa",
    description:
      "A broad forested hill rises about 100 metres above the surrounding plains, its top reaching around 231 metres above sea level. Its slopes are scattered with vast stone fields, the largest of them Kivijata.",
    areaKm2: 53,
    image: "",
    established: 1982,
    nature: ["Forest", "Mire"],
    trail: { name: "Pirunkierros", distance: "4.5 km", duration: "2 h" },
  },
  {
    id: "leivonmaki",
    name: "Leivonmäki",
    category: "national-park",
    region: "Keski-Suomi",
    description:
      "Eskers, mires and clear lakes shaped by the Ice Age meet in this compact park. Its geology trail passes kettle holes, erratic boulders and esker ridges.",
    areaKm2: 29,
    image: "",
    established: 2003,
    nature: ["Forest", "Mire", "Lake Scenery"],
    trail: { name: "Luupään lenkki", distance: "2.1 km", duration: "1 h" },
  },
  {
    id: "lemmenjoki",
    name: "Lemmenjoki",
    category: "national-park",
    region: "Lapland",
    description:
      "Finland's largest national park is a roadless expanse of fells, pine forests and river valleys. Gold prospectors still pan its streams, and the Gold Trail leads through the old prospecting grounds.",
    areaKm2: 2850,
    image: "",
    established: 1956,
    nature: ["Fell", "Forest"],
    trail: { name: "Lemmenjoki Gold Trail", distance: "25.5 km", duration: "2–3 days" },
  },
  {
    id: "liesjarvi",
    name: "Liesjärvi",
    category: "national-park",
    region: "Kanta-Häme",
    description:
      "Old spruce and pine forests surround clear lakes, crossed by the narrow, pine-topped Kyynäränharju esker. The Korteniemi heritage farm keeps traditional farming alive.",
    areaKm2: 22,
    image: "",
    established: 1956,
    nature: ["Forest", "Lake Scenery"],
    trail: { name: "Pohjantikan kierros", distance: "5 km" },
    notes: {
      trail: "No official duration found.",
    },
  },
  {
    id: "linnansaari",
    name: "Linnansaari",
    category: "national-park",
    region: "Etelä-Savo",
    description:
      "Rocky islands and forested shores in Lake Haukivesi, part of the Saimaa lake system, reached by boat. It is home to the endangered Saimaa ringed seal, one of the world's rarest seals.",
    areaKm2: 38,
    image: "",
    established: 1956,
    nature: ["Lake Scenery"],
    trail: { name: "Linnavuori trail", distance: "6.5 km", duration: "3–4 h" },
  },
  {
    id: "nuuksio",
    name: "Nuuksio",
    category: "national-park",
    region: "Uusimaa",
    description:
      "Rocky hills, small lakes and spruce valleys less than an hour from central Helsinki. The Siberian flying squirrel is the park's emblem.",
    areaKm2: 45,
    image: "",
    established: 1994,
    nature: ["Forest"],
    trail: { name: "Haukankierros", distance: "3.9 km", duration: "1.5–2 h" },
  },
  {
    id: "oulanka",
    name: "Oulanka",
    category: "national-park",
    region: "Pohjois-Pohjanmaa",
    description:
      "Fast rivers, roaring rapids, sandy riverbanks and suspension bridges wind through old forest. It is famous for the Karhunkierros, one of Finland's most popular long-distance trails.",
    areaKm2: 270,
    image: "",
    established: 1956,
    nature: ["Rivers and Rapids"],
    trail: { name: "Karhunkierros", distance: "about 80 km", duration: "4–6 days" },
  },
  {
    id: "pallas-yllastunturi",
    name: "Pallas-Yllästunturi",
    category: "national-park",
    region: "Lapland",
    description:
      "A chain of bare fells rises above the forests of western Lapland. The Hetta–Pallas trail across its fell tops, first marked in 1934, is one of Finland's classic hikes.",
    areaKm2: 1020,
    image: "",
    established: 2005,
    nature: ["Fell"],
    trail: { name: "Hetta–Pallas hiking trail", distance: "47.7 km", duration: "3 days" },
  },
  {
    id: "patvinsuo",
    name: "Patvinsuo",
    category: "national-park",
    region: "Pohjois-Karjala",
    description:
      "Wide open bogs and old forests surround Lake Suomunjärvi. Sandy lake shores and long duckboard trails make it an easy wilderness escape.",
    areaKm2: 105,
    image: "",
    established: 1982,
    nature: ["Mire"],
    trail: { name: "Suomunkierto", distance: "15.9 km", duration: "4–8 h" },
  },
  {
    id: "perameri",
    name: "Perämeri",
    category: "national-park",
    region: "Lapland",
    description:
      "A sea park in the Kemi outer archipelago, almost entirely open water dotted with low islands. On Selkä-Sarvi, a short trail leads to an old fishing base.",
    image: "",
    established: 1991,
    nature: ["Archipelago"],
    trail: { name: "Selkä-Sarvi nature trail", distance: "1 km", duration: "0.5–1 h" },
  },
  {
    id: "petkeljarvi",
    name: "Petkeljärvi",
    category: "national-park",
    region: "Pohjois-Karjala",
    description:
      "Narrow eskers wind between clear lakes in this small park near the eastern border. Its esker trail is a compact introduction to the North Karelian landscape.",
    areaKm2: 6,
    image: "",
    established: 1956,
    nature: ["Forest", "Lake Scenery"],
    trail: { name: "Harjupolku (Esker Trail)", distance: "3.5 km", duration: "1–2 h" },
    notes: {
      trail: "Official figures. A newer local listing gives 2.5 km and about 45 minutes.",
    },
  },
  {
    id: "puurijarvi-isosuo",
    name: "Puurijärvi–Isosuo",
    category: "national-park",
    region: "Satakunta",
    description:
      "Puurijärvi, a shallow lake rich in birds, sits beside the Isosuo raised bog. An 18-metre tower at Kärjenkallio looks out over the lake.",
    areaKm2: 27,
    image: "",
    established: 1993,
    nature: ["Mire", "Lake Scenery"],
    trail: { name: "Kärjenkallio bird lake trail", distance: "0.8 km there and back" },
    notes: {
      trail: "No duration listed; it is a short walk to the bird tower.",
    },
  },
  {
    id: "pyha-hakki",
    name: "Pyhä-Häkki",
    category: "national-park",
    region: "Keski-Suomi",
    description:
      "One of southern Finland's finest old-growth forests, where some pines are over 400 years old. Its landmark, the Big Old Tree, stands just off the Kotajärvi trail.",
    areaKm2: 13,
    image: "",
    established: 1956,
    nature: ["Forest"],
    trail: { name: "Kotajärven polku", distance: "6.8 km", duration: "2–3 h" },
  },
  {
    id: "pyha-luosto",
    name: "Pyhä-Luosto",
    category: "national-park",
    region: "Lapland",
    description:
      "Two chains of ancient fells linked by old-growth forest and wide aapa mires. Deep gorges such as Isokuru cut through the fells, and amethyst is still mined on Lampivaara.",
    areaKm2: 142,
    image: "",
    established: 2005,
    nature: ["Fell"],
    trail: { name: "Pyhä–Luosto hiking trail", distance: "about 30 km", duration: "2–3 days" },
    notes: {
      trail: "Luontoon.fi lists 47.6 km, including the extension to Yli-Luosto.",
    },
  },
  {
    id: "repovesi",
    name: "Repovesi",
    category: "national-park",
    region: "Kymenlaakso",
    description:
      "Sheer cliffs, clear lakes and pine-topped ridges in a former logging area. It is known for the hand-pulled Ketunlossi raft ferry and the Lapinsalmi suspension bridge.",
    areaKm2: 15,
    image: "",
    established: 2003,
    nature: ["Forest", "Lake Scenery"],
    trail: { name: "Ketunlenkki", distance: "3.6 km", duration: "1–2 h" },
    notes: {
      trail: "The Lapinsalmi suspension bridge has been closed since January 2024.",
    },
  },
  {
    id: "riisitunturi-national-park",
    name: "Riisitunturi",
    category: "national-park",
    region: "Lapland",
    description:
      "Rounded fells in Posio, famous for crown snow that turns the spruces into frozen white figures each winter. Its slopes are also known for rare hillside mires.",
    areaKm2: 77,
    image: "",
    established: 1982,
    nature: ["Fell"],
    trail: { name: "Riisin rääpäsy", distance: "4.5 km", duration: "2–3 h" },
  },
  {
    id: "rokua",
    name: "Rokua",
    category: "national-park",
    region: "Pohjois-Pohjanmaa",
    description:
      "Pine heaths on a huge esker, with inland dunes, kettle-hole lakes and white carpets of lichen. It is part of Rokua Geopark, Finland's first UNESCO Global Geopark.",
    areaKm2: 4.3,
    image: "",
    established: 1956,
    nature: ["Forest"],
    trail: { name: "Syvyydenkierros", distance: "6.3 km", duration: "2–3 h" },
  },
  {
    id: "archipelago",
    name: "Saaristomeri",
    category: "national-park",
    region: "Varsinais-Suomi",
    description:
      "More than 2,000 islands and skerries in the outer Archipelago Sea, most of the park open water. Traditional farming keeps meadows open on the larger islands, with a nature centre at Kasnäs.",
    image: "",
    established: 1982,
    nature: ["Archipelago"],
    trail: { name: "Holma nature trail", distance: "about 2 km" },
    notes: {
      trail: "No official duration found.",
    },
  },
  {
    id: "salamajarvi",
    name: "Salamajärvi",
    category: "national-park",
    region: "Keski-Pohjanmaa",
    description:
      "Wide aapa mires and wild forests cover the uplands where Central Ostrobothnia meets Central Finland. It is home to the rare wild forest reindeer.",
    areaKm2: 62,
    image: "",
    established: 1982,
    nature: ["Mire", "Forest"],
    trail: { name: "Vaatimen kierros", distance: "17.4 km", duration: "5–7 h" },
  },
  {
    id: "salla",
    name: "Salla",
    category: "national-park",
    region: "Lapland",
    description:
      "Finland's newest national park protects old, rounded fells and ancient forests near the Russian border. From Iso Pyhätunturi the views reach across the border.",
    areaKm2: 99.83,
    image: "",
    established: 2022,
    nature: ["Fell"],
    trail: { name: "Pahanojankuru trail", distance: "14.4 km", duration: "4–5 h" },
  },
  {
    id: "seitseminen",
    name: "Seitseminen",
    category: "national-park",
    region: "Pirkanmaa",
    description:
      "Old-growth pine forests, mires and eskers, with pines over 400 years old in the Multiharju forest. Kovero, a restored tenant farm, shows how people lived in the backwoods.",
    areaKm2: 45.5,
    image: "",
    established: 1982,
    nature: ["Forest"],
    trail: { name: "Torpparintaival", distance: "6.2 km", duration: "about 2 h" },
  },
  {
    id: "selkameri",
    name: "Selkämeri",
    category: "national-park",
    region: "Satakunta",
    description:
      "A sea park off the Satakunta coast, almost all of it open water with only about 15 km² of land. Short island trails on Iso-Enskeri, Säppi and Kuuskajaskari offer a taste of the outer archipelago.",
    image: "",
    established: 2011,
    nature: ["Archipelago"],
    trail: { name: "Iso-Enskeri nature trail", distance: "3 km" },
    notes: {
      trail: "No official duration found.",
    },
  },
  {
    id: "sipoonkorpi",
    name: "Sipoonkorpi",
    category: "national-park",
    region: "Uusimaa",
    description:
      "Rocky hills, spruce woods and brooks on the northern edge of the Helsinki region. Despite being so close to the city, much of it still feels like deep backwoods.",
    areaKm2: 18.6,
    image: "",
    established: 2011,
    nature: ["Forest"],
    trail: { name: "Kalkinpolttaja trail", distance: "4.9 km", duration: "2–3 h" },
  },
  {
    id: "syote",
    name: "Syöte",
    category: "national-park",
    region: "Pohjois-Pohjanmaa",
    description:
      "Old spruce forests cover rounded fells, eskers and mires in Finland's southernmost fell area. The Syöte circular trail loops over the Pytkynharju ridge.",
    areaKm2: 299,
    image: "",
    established: 2000,
    nature: ["Forest", "Fell"],
    trail: { name: "Syötteen kierros", distance: "19.3 km", duration: "4–6 h" },
  },
  {
    id: "tammisaaren-saaristo",
    name: "Tammisaaren saaristo",
    category: "national-park",
    region: "Uusimaa",
    description:
      "Islands, skerries and open sea off the south coast near Raasepori. Short nature trails on Älgö, Modermagan and Jussarö make it a favourite with paddlers.",
    areaKm2: 52,
    image: "",
    established: 1989,
    nature: ["Archipelago"],
    trail: { name: "Älgö nature trail", distance: "2 km" },
    notes: {
      trail: "No official duration found.",
    },
  },
  {
    id: "teijo",
    name: "Teijo",
    category: "national-park",
    region: "Varsinais-Suomi",
    description:
      "Pine heaths, lakes and mires in the Salo region of Southwest Finland. Lake Matildanjärvi, ringed by a popular trail, is its best-known spot.",
    areaKm2: 33.85,
    image: "",
    established: 2015,
    nature: ["Forest", "Lake Scenery", "Mire"],
    trail: { name: "Lake Matildanjärvi trail", distance: "6.1 km", duration: "2.5 h" },
  },
  {
    id: "tiilikkajarvi",
    name: "Tiilikkajärvi",
    category: "national-park",
    region: "Pohjois-Savo",
    description:
      "Mires, eskers and lakes in the backwoods between North Savo and Kainuu. Venäjänhiekka, a long sandy shore on Lake Tiilikkajärvi, is its most popular spot.",
    areaKm2: 34,
    image: "",
    established: 1982,
    nature: ["Mire", "Lake Scenery"],
    trail: { name: "Uiton kierto", distance: "7.1 km", duration: "3 h" },
  },
  {
    id: "torronsuo",
    name: "Torronsuo",
    category: "national-park",
    region: "Kanta-Häme",
    description:
      "One of Finland's deepest bogs, with peat layers more than 12 metres thick. Long duckboard trails cross the open bog to viewing towers.",
    areaKm2: 25.5,
    image: "",
    established: 1990,
    nature: ["Mire"],
    trail: { name: "Suotaival", distance: "8.6 km", duration: "2–3 h" },
  },
  {
    id: "urho-kekkonen",
    name: "Urho Kekkonen",
    category: "national-park",
    region: "Lapland",
    description:
      "This vast park covers the Saariselkä fells and the wilderness to their south and east. Open wilderness huts make it a favourite for multi-day treks, with Kiilopää and Saariselkä as gateways.",
    areaKm2: 2550,
    image: "",
    established: 1983,
    nature: ["Fell"],
    trail: { name: "Luirojärvi loop from Kiilopää", distance: "about 71 km", duration: "about 7 days" },
  },
  {
    id: "valkmusa",
    name: "Valkmusa",
    category: "national-park",
    region: "Kymenlaakso",
    description:
      "Open bogs and pine mires near the Gulf of Finland coast. It is known for its rich mire butterflies, best seen in spring and summer.",
    areaKm2: 17,
    image: "",
    established: 1996,
    nature: ["Mire"],
    trail: { name: "Valkmusa circle trail", distance: "2.5 km" },
    notes: {
      trail: "No official duration found.",
    },
  },
  {
    id: "paijanne",
    name: "Päijänne",
    category: "national-park",
    region: "Päijät-Häme",
    description:
      "Islands in Päijänne, Finland's second-largest lake. Its highlight is Kelvenne, a long, narrow esker island with sandy shores.",
    areaKm2: 14,
    image: "",
    established: 1993,
    nature: ["Lake Scenery"],
    trail: { name: "Kelvenne trail", distance: "9.7 km", duration: "2–4 h" },
  },
];
