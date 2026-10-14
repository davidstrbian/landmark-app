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
  | "wildlife";

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
  rank?: number; // 1 = wildest
  wildernessScore?: number; // 1–5, shown as stars
  wildlife?: string[]; // animals visitors may encounter
};

export const CATEGORY_LABELS: Record<LandmarkCategory, string> = {
  peak: "Peak",
  "national-park": "National park",
  "wilderness-area": "Wilderness area",
};

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
    region: "Inari and Sodankylä, Lapland",
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
    region: "Inari and Utsjoki",
    description:
      "Muotkatunturi stretches from a rolling, treeless fell plateau cut by river valleys in the north to mountain birch woods, bogs and old pine forests in the south. Lake Peltojärvi is its largest lake, fed by countless rivers and brooks. There are no marked trails, so visitors plan their own routes.",
    areaKm2: 1570,
    image: "",
    rank: 1,
    wildernessScore: 5,
    wildlife: ["Reindeer", "Golden eagle", "Willow grouse", "Mountain hare"],
  },
  {
    id: "kaldoaivi",
    name: "Kaldoaivi",
    category: "wilderness-area",
    region: "Utsjoki and Inari",
    description:
      "Kaldoaivi is Finland's largest wilderness area, a roadless expanse of fells that continues across the border into Norway. Its landscape ranges from deep, steep-sided river valleys to gentle fell slopes, and it is one of Finland's most important breeding grounds for arctic waders. The only marked route, the Sevettijärvi–Pulmanki trail, crosses it from south to north.",
    areaKm2: 2924,
    image: "",
    rank: 2,
    wildernessScore: 5,
    wildlife: ["Golden plover", "Gyrfalcon", "Snowy owl", "Bar-tailed godwit", "Otter", "Reindeer"],
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
    rank: 3,
    wildernessScore: 4,
    wildlife: ["Reindeer", "Lemmings", "Voles"],
  },
  {
    id: "hammastunturi",
    name: "Hammastunturi",
    category: "wilderness-area",
    region: "Inari, Kittilä and Sodankylä",
    description:
      "Hammastunturi lies between Urho Kekkonen and Lemmenjoki national parks. Pine forests and low fells grow on nutrient-poor granulite bedrock, and the Ivalojoki river winds through the area. Its gold-rush past lives on at Kultala, where hundreds of prospectors once lived.",
    areaKm2: 1825,
    image: "",
    rank: 4,
    wildernessScore: 4,
    wildlife: ["Golden eagle", "Siberian jay", "Siberian tit", "Northern hawk owl", "Willow grouse", "Otter"],
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
    rank: 5,
    wildernessScore: 4,
    wildlife: ["Brown bear", "Pine marten", "Red fox", "Stoat", "Spotted redshank"],
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
    rank: 6,
    wildernessScore: 4,
    wildlife: ["Brown bear", "Wolverine", "Lynx", "Wading birds", "Waterfowl"],
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
    rank: 7,
    wildernessScore: 3,
    wildlife: ["Arctic fox", "Wolverine", "Lynx", "Snowy owl", "Peregrine falcon", "Reindeer"],
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
    rank: 8,
    wildernessScore: 3,
    wildlife: ["Whooper swan", "Willow grouse", "Mountain hare", "Waterfowl"],
  },
  {
    id: "pulju",
    name: "Pulju",
    category: "wilderness-area",
    region: "Enontekiö and Kittilä",
    description:
      "Pulju is a land of large mires and rounded hills and fells, with spruce on the southern hills giving way to pine and fell birch in the north. Road 956 runs through its centre, making it one of the easiest wilderness areas to reach. In late summer its mires draw cloudberry pickers.",
    areaKm2: 614,
    image: "",
    rank: 9,
    wildernessScore: 3,
    wildlife: ["Willow grouse", "Mountain hare", "Capercaillie", "Black grouse", "Stoat"],
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
    rank: 10,
    wildernessScore: 2,
    wildlife: ["Wading birds", "Willow grouse", "Reindeer"],
  },
  {
    id: "tuntsa",
    name: "Tuntsa",
    category: "wilderness-area",
    region: "Salla and Savukoski",
    description:
      "Tuntsa lies where the northern limit of spruce forest crosses eastern Lapland. In 1960 it was hit by Finland's largest recorded forest fire, and much of the burnt land is still open today, visible from the UKK hiking trail. Its bogs yield rich cloudberry crops and its slopes are covered in blueberry and lingonberry.",
    areaKm2: 212,
    image: "",
    rank: 11,
    wildernessScore: 2,
    wildlife: ["Boreal forest birds"],
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
    rank: 12,
    wildernessScore: 2,
    wildlife: ["Brown bear", "Moose", "Reindeer", "Red fox", "Capercaillie", "Willow grouse"],
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
