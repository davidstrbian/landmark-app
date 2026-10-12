export type LandmarkCategory = "peak" | "national-park" | "other";

export type Hike = {
  name?: string; // the trail's own name, if it has one
  trailhead: string;
  distance: string; // e.g. "8.2 km loop", "55 km one way"
  duration?: string;
};

// Fields shown in the fell detail view that can carry a note for review.
export type FellField =
  | "coordinates"
  | "relief"
  | "difficulty"
  | "hike"
  | "protectedArea";

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
  relief?: { label: string; metres: number }; // prominence or height gain
  difficulty?: string;
  hike?: Hike;
  protectedArea?: string; // national park or wilderness area
  notes?: Partial<Record<FellField, string>>; // shown under the field
};

export const CATEGORY_LABELS: Record<LandmarkCategory, string> = {
  peak: "Peak",
  "national-park": "National park",
  other: "Other",
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
    difficulty: "Demanding",
    hike: {
      name: "Kilpisjärvi–Halti route",
      trailhead: "Kilpisjärvi",
      distance: "55 km one way",
      duration: "7–10 days",
    },
    protectedArea: "Käsivarsi Wilderness Area",
    notes: {
      coordinates: "From Mapcarta; please check against an official map.",
      relief:
        "The Finnish high point is a shoulder of the Norwegian summit, so it has no prominence of its own (listed as 0 m). No height-gain figure found.",
      difficulty:
        "Metsähallitus calls it one of the most demanding hiking routes in Finland.",
    },
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
    hike: {
      name: "Saana summit trail",
      trailhead: "Malla and Saana parking area, Kilpisjärvi",
      distance: "4.3 km one way",
      duration: "4–6 h there and back",
    },
    protectedArea: "Saana Nature Reserve",
    notes: {
      difficulty:
        "No official rating found. Third-party guides range from easy to hard.",
      hike: "One hut guide reports the summit trail closed since summer 2025 to protect sensitive habitat. Not confirmed by Metsähallitus; please check luontoon.fi.",
    },
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
    difficulty: "Medium",
    hike: {
      name: "Huippujen kierros (Trail of the Tops)",
      trailhead: "Koli Nature Centre Ukko",
      distance: "1.4 km loop",
      duration: "30 min–1 h",
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
    relief: { label: "Prominence", metres: 509 },
    difficulty: "Medium",
    hike: {
      name: "Taivaskeron kierros",
      trailhead: "Pallastunturi Visitor Centre",
      distance: "8.2 km loop",
      duration: "about 3.5 h",
    },
    protectedArea: "Pallas-Yllästunturi National Park",
    notes: {
      coordinates: "No reliable summit coordinates found.",
    },
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
    hike: {
      name: "Luirojärvi loop with a side trip to the summit",
      trailhead: "Kiilopää",
      distance: "about 71 km loop",
      duration: "about 7 days",
    },
    protectedArea: "Urho Kekkonen National Park",
    notes: {
      relief: "No prominence or height-gain figure found.",
      difficulty: "No official difficulty rating found.",
      hike: "The summit is about 6 km one way from the Luirojärvi lakeshore; guides suggest setting aside a full day for it.",
    },
  },
  {
    id: "kiilopaa",
    name: "Kiilopää",
    category: "peak",
    region: "Inari and Sodankylä, Lapland",
    description:
      "Kiilopää is one of the best-known fells of the Saariselkä area, a rounded, bare-topped summit right next to the Kiilopää fell centre. A well-marked trail climbs to the top in about two kilometres, with long sections of steps. From the summit the wilderness of Urho Kekkonen National Park stretches as far as the eye can see.",
    elevationM: 546,
    image: "",
    difficulty: "Medium",
    hike: {
      name: "Kiirunapolku",
      trailhead: "Kiilopää fell centre",
      distance: "5.7 km loop",
      duration: "2–3 h",
    },
    protectedArea: "Urho Kekkonen National Park",
    notes: {
      coordinates: "No reliable summit coordinates found.",
      relief: "No prominence or height-gain figure found.",
    },
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
    difficulty: "Medium",
    hike: {
      name: "Riisin rääpäsy",
      trailhead: "Riisitunturi car park",
      distance: "4.5 km loop",
      duration: "2–3 h",
    },
    protectedArea: "Riisitunturi National Park",
    notes: {
      coordinates:
        "From the National Land Survey benchmark named Riisitunturi (465.7 m), which may not be the exact summit.",
      relief: "No prominence or height-gain figure found.",
    },
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
    difficulty: "Hard",
    hike: {
      name: "Trail to Noitatunturi Fell",
      trailhead: "Pyhä Nature Centre Naava",
      distance: "12.5 km partial loop",
      duration: "4–6 h",
    },
    protectedArea: "Pyhä-Luosto National Park",
    notes: {
      hike: "The trailhead is from an older Metsähallitus listing, which gave the length as 14.5 km.",
    },
  },

  // National parks
  {
    id: "koli-national-park",
    name: "Koli National Park",
    category: "national-park",
    region: "Lieksa and Joensuu, North Karelia",
    description:
      "Koli protects a ridge of ancient quartzite hills on the western shore of Lake Pielinen, together with the slash-and-burn meadows and pastures that traditional farming left behind. Its lake views are among the most celebrated in Finland. Trails range from short summit loops to longer walks along the shore.",
    areaKm2: 30,
    bestSeason: "Year-round; September for autumn colours",
    nearestTown: "Koli",
    image: "",
    lat: 63.0944,
    lng: 29.8086,
  },
  {
    id: "nuuksio",
    name: "Nuuksio National Park",
    category: "national-park",
    region: "Espoo, Kirkkonummi and Vihti, Uusimaa",
    description:
      "Nuuksio is a patchwork of rocky hills, small lakes and spruce forest less than an hour from central Helsinki. It is one of Finland's most visited parks and an easy first taste of the Finnish backcountry. Look out for the Siberian flying squirrel, which has made the park its emblem.",
    areaKm2: 53,
    bestSeason: "May to October",
    nearestTown: "Espoo",
    image: "",
    lat: 60.3075,
    lng: 24.4992,
  },
  {
    id: "pallas-yllastunturi",
    name: "Pallas-Yllästunturi National Park",
    category: "national-park",
    region: "Enontekiö, Kittilä, Kolari and Muonio, Lapland",
    description:
      "This park follows a 100-kilometre chain of fells from Ylläs in the south to Pallas and Ounastunturi in the north. The Hetta–Pallas trail across its bare fell tops is one of Finland's classic hikes. The air here is measured as some of the cleanest in the world.",
    areaKm2: 1020,
    bestSeason: "July to September; March to April for skiing",
    nearestTown: "Muonio",
    image: "",
    lat: 68.1589,
    lng: 24.0403,
  },
  {
    id: "urho-kekkonen",
    name: "Urho Kekkonen National Park",
    category: "national-park",
    region: "Inari, Sodankylä and Savukoski, Lapland",
    description:
      "Named after Finland's long-serving president, this vast park covers the Saariselkä fells and the wilderness to their south and east. Open-access huts make it a favourite for multi-day treks, and reindeer herding still goes on inside its borders. Kiilopää and Saariselkä are the main gateways.",
    areaKm2: 2550,
    bestSeason: "Late June to September; March to April for skiing",
    nearestTown: "Saariselkä",
    image: "",
    lat: 68.3333,
    lng: 28,
  },
  {
    id: "oulanka",
    name: "Oulanka National Park",
    category: "national-park",
    region: "Kuusamo and Salla",
    description:
      "Oulanka is known for its fast rivers, sandy riverbanks and suspension bridges over roaring rapids. The Karhunkierros (Bear's Ring) trail runs through it and is one of Finland's most popular long-distance hikes. Its location where several vegetation zones meet makes the flora unusually rich.",
    areaKm2: 290,
    bestSeason: "June to September",
    nearestTown: "Kuusamo",
    image: "",
    lat: 66.3756,
    lng: 29.3386,
  },
  {
    id: "lemmenjoki",
    name: "Lemmenjoki National Park",
    category: "national-park",
    region: "Inari and Kittilä, Lapland",
    description:
      "Lemmenjoki is Finland's largest national park, a roadless expanse of fells, pine forests and river valleys. Gold prospectors still pan its streams, and boats carry hikers up the Lemmenjoki river to the old gold fields. Sámi reindeer herding has shaped the area for centuries.",
    areaKm2: 2850,
    bestSeason: "Late June to mid-September",
    nearestTown: "Inari",
    image: "",
    lat: 68.5,
    lng: 25.5,
  },
  {
    id: "pyha-luosto",
    name: "Pyhä-Luosto National Park",
    category: "national-park",
    region: "Pelkosenniemi, Sodankylä and Kemijärvi, Lapland",
    description:
      "Pyhä-Luosto joins two fell areas into one park, linked by old-growth forest and wide aapa mires. Deep gorges such as Isokuru cut through fells that are the worn-down remains of an ancient mountain range. Amethyst is still mined on Lampivaara fell inside the park.",
    areaKm2: 142,
    bestSeason: "September for autumn colours; March to April for skiing",
    nearestTown: "Sodankylä",
    image: "",
    lat: 67.0664,
    lng: 26.9736,
  },
  {
    id: "repovesi",
    name: "Repovesi National Park",
    category: "national-park",
    region: "Kouvola and Mäntyharju, Kymenlaakso",
    description:
      "Repovesi packs sheer cliffs, clear lakes and pine-topped ridges into a compact park in southeastern Finland. A former logging area, it is now best known for the hand-pulled Ketunlossi raft ferry and the Lapinsalmi suspension bridge. It is an easy weekend trip from the Helsinki region.",
    areaKm2: 15,
    bestSeason: "May to October",
    nearestTown: "Kouvola",
    image: "",
    lat: 61.1833,
    lng: 26.8833,
  },
  {
    id: "linnansaari",
    name: "Linnansaari National Park",
    category: "national-park",
    region: "Savonlinna, Rantasalmi and Varkaus, South Savo",
    description:
      "Linnansaari is a lake park in Haukivesi, part of the Saimaa lake system, made up of the large Linnansaari island and hundreds of smaller ones. It is home to the endangered Saimaa ringed seal, one of the world's rarest seals. Most visitors arrive by boat, canoe or kayak.",
    areaKm2: 97,
    bestSeason: "June to August",
    nearestTown: "Rantasalmi",
    image: "",
    lat: 62.1106,
    lng: 28.5094,
  },
  {
    id: "archipelago",
    name: "Archipelago National Park",
    category: "national-park",
    region: "Pargas and Kimitoön, Southwest Finland",
    description:
      "Set in the outer Archipelago Sea, this park covers thousands of islands and skerries, and most of its area is open water. Traditional farming has kept meadows and pastures open on many of the larger islands. Ferries and water taxis connect the islands in summer, with the nature centre at Kasnäs.",
    areaKm2: 527,
    bestSeason: "June to August",
    nearestTown: "Kasnäs",
    image: "",
    lat: 59.9147,
    lng: 21.8775,
  },
  {
    id: "patvinsuo",
    name: "Patvinsuo National Park",
    category: "national-park",
    region: "Lieksa and Ilomantsi, North Karelia",
    description:
      "Patvinsuo protects one of the largest mire complexes in southern Finland, crossed by long duckboard trails. The open bogs alternate with old-growth forest and the shores of Lake Suomunjärvi. Bears, cranes and swans are regularly seen here.",
    areaKm2: 105,
    bestSeason: "June to September",
    nearestTown: "Lieksa",
    image: "",
    lat: 63.1114,
    lng: 30.7044,
  },
  {
    id: "liesjarvi",
    name: "Liesjärvi National Park",
    category: "national-park",
    region: "Tammela, Kanta-Häme",
    description:
      "Liesjärvi centres on a clear lake and the narrow, pine-covered Kyynäränharju esker that runs across it. The park also preserves the old Korteniemi heritage farm, where traditional farming is still demonstrated. It is a quiet, family-friendly park between Helsinki and Tampere.",
    areaKm2: 21,
    bestSeason: "May to October",
    nearestTown: "Forssa",
    image: "",
    lat: 60.6806,
    lng: 23.8583,
  },
];
