export type LandmarkCategory = "peak" | "national-park" | "other";

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
  lat: number; // not displayed in V0.1; needed for a later map
  lng: number;
};

export const CATEGORY_LABELS: Record<LandmarkCategory, string> = {
  peak: "Peak",
  "national-park": "National park",
  other: "Other",
};

// Figures follow Metsähallitus (nationalparks.fi / luontoon.fi) where available,
// otherwise Wikipedia/Wikidata. Park coordinates are a representative centre point.
export const landmarks: Landmark[] = [
  // Peaks and fells
  {
    id: "halti",
    name: "Halti",
    category: "peak",
    region: "Enontekiö, Lapland",
    description:
      "Finland's highest point sits on a shoulder of Halti fell, right on the Norwegian border in the far northwest. Reaching it is a multi-day trek across open, treeless Käsivarsi wilderness, usually from Kilpisjärvi along the Nordkalott Trail. The summit cairn rewards the effort with views over Norway's higher peaks.",
    elevationM: 1324,
    bestSeason: "Late June to mid-September",
    nearestTown: "Kilpisjärvi",
    image: "",
    lat: 69.3081,
    lng: 21.2633,
  },
  {
    id: "saana",
    name: "Saana",
    category: "peak",
    region: "Enontekiö, Lapland",
    description:
      "Saana's flat-topped, steep-sided silhouette towers over Kilpisjärvi village and lake, making it one of Finland's most recognisable fells. A marked trail with long wooden staircases climbs to the summit plateau. On a clear day you can see into Sweden and Norway.",
    elevationM: 1029,
    bestSeason: "Late June to September",
    nearestTown: "Kilpisjärvi",
    image: "",
    lat: 69.0436,
    lng: 20.8561,
  },
  {
    id: "yllastunturi",
    name: "Yllästunturi",
    category: "peak",
    region: "Kolari, Lapland",
    description:
      "Ylläs is the southern anchor of the Pallas-Yllästunturi fell chain and one of Lapland's best-known ski fells. In summer its slopes open up to hikers and mountain bikers heading into the national park. The villages of Äkäslompolo and Ylläsjärvi sit at its feet.",
    elevationM: 718,
    bestSeason: "February to April for skiing; July to September for hiking",
    nearestTown: "Äkäslompolo",
    image: "",
    lat: 67.5644,
    lng: 24.2244,
  },
  {
    id: "taivaskero",
    name: "Taivaskero",
    category: "peak",
    region: "Muonio, Lapland",
    description:
      "Taivaskero is the highest summit of the Pallastunturi fells and of the whole Pallas-Yllästunturi National Park. A popular loop trail starts at the Pallastunturi visitor centre and crosses bare, rocky fell tops. In 1952 a flame for the Helsinki Olympic torch relay was lit on its summit by the midnight sun.",
    elevationM: 809,
    bestSeason: "July to September",
    nearestTown: "Muonio",
    image: "",
    lat: 68.0535,
    lng: 24.0961,
  },
  {
    id: "pyhatunturi",
    name: "Pyhätunturi",
    category: "peak",
    region: "Pelkosenniemi, Lapland",
    description:
      "Pyhätunturi is the southern end of Pyhä-Luosto National Park, a chain of old, worn-down fells rising out of the forests and mires. Its highest top, Noitatunturi, looks down into the Isokuru gorge. The area is a favourite for autumn-colour hikes and winter skiing.",
    elevationM: 540,
    bestSeason: "September for autumn colours; March to April for skiing",
    nearestTown: "Pyhätunturi village",
    image: "",
    lat: 67.0138,
    lng: 27.1483,
  },
  {
    id: "rukatunturi",
    name: "Rukatunturi",
    category: "peak",
    region: "Kuusamo, North Ostrobothnia",
    description:
      "Ruka is the largest fell in the Kuusamo uplands and home to one of Finland's busiest ski resorts. Its season starts early, and the resort hosts World Cup ski jumping and cross-country races. In summer, trails link it to the wilderness of nearby Oulanka.",
    elevationM: 492,
    bestSeason: "November to May for snow; summer for hiking",
    nearestTown: "Kuusamo",
    image: "",
    lat: 66.1633,
    lng: 29.1233,
  },
  {
    id: "levitunturi",
    name: "Levitunturi",
    category: "peak",
    region: "Kittilä, Lapland",
    description:
      "Levi is a rounded fell above the village of Sirkka and the heart of one of Finland's largest ski resorts. Gondolas run to the top all year, so the summit views over western Lapland are easy to reach. In autumn the surrounding birch forests turn deep orange.",
    elevationM: 531,
    bestSeason: "December to April for skiing; September for autumn colours",
    nearestTown: "Kittilä",
    image: "",
    lat: 67.805,
    lng: 24.8019,
  },
  {
    id: "ukko-koli",
    name: "Ukko-Koli",
    category: "peak",
    region: "Lieksa, North Karelia",
    description:
      "Ukko-Koli is the highest of the Koli hills, rising about 250 metres above Lake Pielinen. Its view of islands scattered across the lake inspired Finnish painters and composers in the 1890s and became a symbol of Finnish national landscape. A short path leads from the Koli visitor centre to the summit rocks.",
    elevationM: 347,
    bestSeason: "Year-round; September for autumn colours",
    nearestTown: "Koli",
    image: "",
    lat: 63.0944,
    lng: 29.8086,
  },
  {
    id: "sokosti",
    name: "Sokosti",
    category: "peak",
    region: "Urho Kekkonen National Park, Lapland",
    description:
      "Sokosti is the highest fell in Urho Kekkonen National Park and in eastern Lapland. It rises from the remote heart of the park, a few kilometres east of Lake Luirojärvi, and is usually climbed as part of a multi-day wilderness trek. From the bouldery summit the Saariselkä fells roll away in every direction.",
    elevationM: 718,
    bestSeason: "Late June to mid-September",
    nearestTown: "Saariselkä",
    image: "",
    lat: 68.219,
    lng: 28.1376,
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

  // Other notable landmarks
  {
    id: "kevo-canyon",
    name: "Kevo Canyon",
    category: "other",
    region: "Utsjoki, Lapland",
    description:
      "The Kevojoki river has carved a canyon about 40 kilometres long through the fells of the far north, in places some 80 metres deep. It lies inside Kevo Strict Nature Reserve, where visitors must stay on the marked route along the valley. Waterfalls, steep scree slopes and lush valley floors make it one of Lapland's most dramatic hikes.",
    bestSeason: "Late June to mid-September",
    nearestTown: "Utsjoki",
    image: "",
    lat: 69.5808,
    lng: 26.7156,
  },
  {
    id: "julma-olkky",
    name: "Julma-Ölkky",
    category: "other",
    region: "Kuusamo, North Ostrobothnia",
    description:
      "Julma-Ölkky is the largest of Finland's canyon lakes: a narrow lake roughly three kilometres long, enclosed by cliffs that rise almost 50 metres from the water. It lies at the edge of Hossa National Park. In summer you can explore it by boat or canoe, or hike the rim on the Ölökyn ähkäsy trail.",
    bestSeason: "June to September",
    nearestTown: "Kuusamo",
    image: "",
    lat: 65.55,
    lng: 29.3283,
  },
];
