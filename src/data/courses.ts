import { Course, Lesson } from "../types";

const sampleVideo = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const captionPack = [
  {
    id: "captions-en",
    language: "en",
    label: "English",
    src: "#",
    isDefault: true,
  },
  {
    id: "captions-id",
    language: "id",
    label: "Bahasa Indonesia",
    src: "#",
  },
];

const resource = (
  id: string,
  title: string,
  type: "pdf" | "checklist" | "worksheet" = "pdf",
) => ({
  id,
  title,
  language: "en",
  type,
  url: "#",
});

function lesson(
  id: string,
  title: string,
  description: string,
  theory: string,
  practice: string[],
  assessment: string,
  duration: number,
  resources = [] as Lesson["resources"],
): Lesson {
  return {
    id,
    title,
    description,
    theory,
    practice,
    assessment,
    duration,
    videoUrl: sampleVideo,
    subtitles: captionPack,
    resources,
  };
}

export const courses: Course[] = [
  {
    id: "barista-foundations",
    title: "Barista Foundations",
    slug: "barista-foundations",
    description:
      "A zero-experience professional foundation covering coffee basics, bar safety, espresso preparation, milk drinks, workflow, cleaning, and service.",
    level: "beginner",
    instructor: "Falfalla Academy",
    instructorBio:
      "SCA-aligned beginner training for students who have never worked as a barista. It prepares students for espresso and latte art with essential professional habits.",
    duration: 360,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=85",
    outcomes: [
      "Explain coffee's journey and core flavor vocabulary",
      "Set up a safe, clean, and organized espresso workstation",
      "Prepare espresso using dose, distribution, tamp, yield, and time",
      "Steam milk for basic drinks and reset the bar professionally",
    ],
    equipment: [
      "Espresso machine with steam wand",
      "Burr grinder",
      "Portafilter and baskets",
      "Tamper and distribution tool",
      "Digital scale (0.1g precision)",
      "Milk pitcher (350ml/600ml)",
      "Thermometer",
      "Cleaning cloths (3 separate)",
      "Knock box",
    ],
    enrollmentCount: 428,
    reviews: [
      {
        id: "review-foundation-1",
        author: "Maya R.",
        rating: 5,
        title: "Best starting point",
        comment:
          "I had no barista experience and this made espresso workflow feel clear instead of intimidating.",
        createdAt: "2026-04-18",
      },
      {
        id: "review-foundation-2",
        author: "Daniel K.",
        rating: 5,
        title: "Very practical",
        comment:
          "The cleaning, safety, and espresso recipe sections are exactly what a beginner needs before latte art.",
        createdAt: "2026-04-24",
      },
    ],
    modules: [
      {
        id: "coffee-basics",
        title: "Coffee Basics",
        description: "Specialty coffee, seed to cup, freshness, and sensory language.",
        lessons: [
          lesson(
            "specialty-coffee-meaning",
            "What Specialty Coffee Means",
            "Learn what makes specialty coffee valuable and why quality is more than a score.",
            "The Specialty Coffee Association describes specialty coffee through a holistic view of distinctive attributes and value. For beginners, quality is shaped by sensory experience, consistency, sustainability, and the people involved from production to service.",
            [
              "Map coffee's chain: producer, processor, exporter, roaster, barista, customer.",
              "Taste or smell two coffees and describe differences without using good or bad.",
              "Write a simple definition of specialty coffee in your own words.",
            ],
            "You can explain specialty coffee as a complete value experience, not only a drink with latte art on top.",
            540,
            [resource("specialty-glossary", "Specialty Coffee Beginner Glossary")],
          ),
          lesson(
            "seed-to-cup",
            "Coffee From Seed to Cup",
            "Understand origin, processing, roasting, storage, grinding, brewing, and service.",
            "SCA Introduction to Coffee learning emphasizes coffee's journey from farm to cup. Each stage changes freshness, grind behavior, extraction, aroma, sweetness, acidity, body, and aftertaste.",
            [
              "Create a seed-to-cup timeline with one quality risk at each step.",
              "Compare whole bean aroma with ground coffee aroma after five minutes.",
              "Identify where a barista has direct control and where they rely on upstream quality.",
            ],
            "You can describe the major steps from farm to cup and name the barista-controlled variables.",
            600,
            [resource("seed-to-cup-map", "Seed-to-Cup Study Map", "worksheet")],
          ),
          lesson(
            "flavor-language",
            "Flavor, Freshness, and Sensory Language",
            "Build beginner sensory vocabulary before tasting espresso.",
            "Professional coffee training uses sensory language to make quality observable. Students start with aroma, acidity, sweetness, bitterness, body, balance, cleanliness, and aftertaste so feedback becomes specific.",
            [
              "Smell coffee dry and wet, then write three aroma words.",
              "Taste sweet, sour, bitter, and salty references safely with food-grade examples.",
              "Describe one coffee using aroma, acidity, sweetness, body, and finish.",
            ],
            "You can give specific sensory feedback instead of only saying strong, weak, nice, or bad.",
            660,
          ),
        ],
      },
      {
        id: "espresso-bar-foundation",
        title: "Espresso Bar Foundation",
        description: "Tools, safety, grinder setup, espresso recipe, and extraction.",
        lessons: [
          lesson(
            "tools-and-safety",
            "Espresso Bar Tools and Safety",
            "Meet the machine, grinder, portafilter, tamper, scale, pitcher, cloth system, and cleaning tools.",
            "SCA Barista Skills Foundation includes safe operation, workspace organization, and service habits. Beginners should understand each tool, hot surfaces, steam pressure, grinder safety, electrical awareness, and clean cloth separation before making drinks.",
            [
              "Name every workstation tool and describe its purpose.",
              "Demonstrate steam wand safety: purge, steam, wipe, purge.",
              "Set up separate cloths for steam wand, bench, and portafilter basket.",
            ],
            "You can set up a clean workstation and demonstrate the steam wand safety routine without prompting.",
            600,
            [resource("bar-setup-checklist", "Espresso Bar Setup Checklist", "checklist")],
          ),
          lesson(
            "grind-dose-distribute-tamp",
            "Grind, Dose, Distribute, Tamp",
            "Build a repeatable puck preparation routine.",
            "Consistency is central to SCA-aligned barista training. Dose must be measured, grounds distributed evenly, tamping level and repeatable, and the basket rim clean so extraction variables can be understood.",
            [
              "Weigh three doses and keep them within 0.2 g of target.",
              "Distribute evenly and tamp level without polishing pressure.",
              "Inspect the spent puck for obvious channeling clues.",
            ],
            "You can prepare three consistent portafilters with repeatable dose, distribution, and tamp.",
            720,
            [resource("espresso-puck-prep", "Espresso Puck Preparation Checklist", "checklist")],
          ),
          lesson(
            "espresso-extraction-recipe",
            "Espresso Extraction Recipe",
            "Track dose, yield, time, grind, and taste to create a reliable espresso recipe.",
            "SCA Barista Skills includes espresso preparation and extraction control. Beginners should track dose, beverage yield, time, grind change, and sensory result so adjustments are intentional rather than random.",
            [
              "Pull one short, one target, and one long espresso, then taste each.",
              "Record dose, yield, time, grind setting, and flavor notes.",
              "Make one grinder adjustment and explain why you made it.",
            ],
            "You can record an espresso recipe and explain a basic adjustment for sour, bitter, fast, or slow shots.",
            780,
            [resource("espresso-recipe-log", "Espresso Recipe Log", "worksheet")],
          ),
        ],
      },
      {
        id: "milk-drinks-service",
        title: "Milk Drinks, Cleaning, and Service",
        description: "Milk drink types, workflow, hygiene, and customer-ready reset.",
        lessons: [
          lesson(
            "milk-drink-menu",
            "Latte, Cappuccino, Flat White, and Macchiato",
            "Understand common espresso-based milk drinks before latte art.",
            "A professional barista understands beverage definitions before decorating. Milk drink differences include cup size, espresso strength, milk texture, foam depth, and customer expectation.",
            [
              "Create basic recipe cards for latte, cappuccino, flat white, and macchiato.",
              "Compare foam depth and texture expectations across each drink.",
              "Practice naming the drink before preparing it.",
            ],
            "You can describe the difference between core espresso-based milk drinks and prepare a basic recipe card.",
            600,
          ),
          lesson(
            "workflow-and-customer-service",
            "Workflow and Customer-Ready Service",
            "Learn the order of tasks that keeps drinks consistent and service calm.",
            "Professional barista workflow reduces waste and mistakes. Students learn mise en place, cup preparation, order sequencing, clean handoff, station reset, and respectful customer communication.",
            [
              "Practice a complete drink cycle: prepare, serve, clean, reset.",
              "Use a timer to reduce unnecessary movement around the bar.",
              "Prepare a clean handoff with cup direction, saucer if used, and no drips.",
            ],
            "You can complete one drink workflow and reset the station to customer-ready condition.",
            540,
          ),
          lesson(
            "cleaning-and-hygiene",
            "Cleaning, Hygiene, and Bar Reset",
            "Build the habits that protect quality and safety.",
            "Cleaning is an essential barista skill, not a closing task only. Professional routines include purging and wiping steam wands, flushing group heads, keeping baskets dry, cleaning grinders, managing milk safely, and resetting surfaces.",
            [
              "Run a full station reset after preparing a drink.",
              "List three safety risks around steam, hot water, and wet floors.",
              "Demonstrate separate cloth usage without cross-contamination.",
            ],
            "You can prepare a simple drink and reset the station without leaving milk, grounds, or unsafe clutter.",
            540,
            [resource("daily-cleaning-routine", "Daily Cleaning Routine", "checklist")],
          ),
        ],
      },
    ],
  },
  {
    id: "latte-art-fundamentals",
    title: "Latte Art Fundamentals",
    slug: "latte-art-fundamentals",
    description:
      "Essential latte art training covering espresso contrast, consistent microfoam, cup angle, pitcher control, hearts, and tulip foundations.",
    level: "intermediate",
    instructor: "Falfalla Academy",
    instructorBio:
      "SCA-aligned latte art fundamentals for students who understand espresso bar basics and want repeatable milk texture and clean pours.",
    duration: 245,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=85",
    outcomes: [
      "Create integrated microfoam for latte art",
      "Build espresso contrast without washing out the crema",
      "Control cup angle, pitcher height, and flow rate",
      "Pour clean hearts and basic tulips with repeatable assessment criteria",
    ],
    equipment: [
      "Espresso machine with steam wand",
      "Burr grinder",
      "Milk pitcher (350ml recommended)",
      "Latte art cups (180–240ml)",
      "Whole milk (full fat, fresh)",
      "Digital scale",
      "Phone or camera for video review",
    ],
    enrollmentCount: 612,
    reviews: [
      {
        id: "review-fundamentals-1",
        author: "Ari S.",
        rating: 5,
        title: "The milk texture lesson helped most",
        comment:
          "I finally understood why my foam was separating and how to fix it before pouring.",
        createdAt: "2026-04-21",
      },
      {
        id: "review-fundamentals-2",
        author: "Lina P.",
        rating: 4,
        title: "Clear practice drills",
        comment:
          "The heart and tulip scorecards make practice feel structured, not random.",
        createdAt: "2026-04-28",
      },
    ],
    modules: [
      {
        id: "milk-texture-foundation",
        title: "Milk Texture Foundation",
        description: "Controlled aeration, whirlpool, temperature, and texture diagnosis.",
        lessons: [
          lesson(
            "consistent-microfoam",
            "Consistent Microfoam",
            "Steam integrated milk texture for latte art and menu consistency.",
            "SCA Barista Skills includes creating consistent milk texture. Students learn controlled aeration, whirlpool integration, temperature awareness, milk waste reduction, and texture differences for latte, cappuccino, and flat white.",
            [
              "Steam three pitchers and compare gloss, bubble size, and flow.",
              "Pour steamed milk into an empty cup to check whether foam and liquid stay integrated.",
              "Record what changed when aeration was too short or too long.",
            ],
            "Your milk has a reflective surface, integrated texture, and appropriate foam for the selected drink.",
            720,
            [resource("milk-texture-guide", "Milk Texture Troubleshooting Guide")],
          ),
          lesson(
            "milk-troubleshooting",
            "Milk Texture Troubleshooting",
            "Diagnose bubbles, stiff foam, thin milk, overheating, and separation.",
            "Professional latte art depends on consistent milk structure. Texture faults usually come from wand position, aeration timing, roll quality, temperature, milk freshness, or delay between steaming and pouring.",
            [
              "Steam one pitcher with too much air and one with too little air, then compare flow.",
              "Practice tap-and-swirl recovery for small surface bubbles.",
              "Write a cause and correction for stiff foam, thin milk, and large bubbles.",
            ],
            "You can identify the most likely cause of a milk texture problem and name a practical correction.",
            660,
          ),
        ],
      },
      {
        id: "pour-control-foundation",
        title: "Pour Control Foundation",
        description: "Canvas building, placement, flow rate, and essential patterns.",
        lessons: [
          lesson(
            "building-the-canvas",
            "Building the Canvas",
            "Use height and flow to mix crema and milk without washing out contrast.",
            "The base pour uses higher pitcher position and a narrow stream to integrate milk under the crema. This creates an even canvas while preserving contrast for the pattern phase.",
            [
              "Pour from higher position into the center until the cup is halfway full.",
              "Keep the stream narrow and avoid splashing or pale patches.",
              "Repeat with different cup tilts and note which angle gives the best canvas.",
            ],
            "The cup is evenly colored before pattern placement, with no large white marks or broken crema.",
            660,
          ),
          lesson(
            "heart-foundation",
            "Heart Foundation",
            "Place, expand, and finish a centered heart with a clean line.",
            "A heart is the foundation shape for many latte art patterns. Lower the pitcher close to the surface to place foam, increase flow to expand the shape, then raise slightly and finish through the center.",
            [
              "Pour ten hearts and score symmetry, contrast, and finish line.",
              "Pause at the surface before increasing flow so the shape anchors in one place.",
              "Finish with a thin line through the center rather than dragging too slowly.",
            ],
            "At least six of ten hearts are centered, have clear contrast, and finish with a clean center line.",
            780,
            [resource("heart-practice-scorecard", "Heart Practice Scorecard", "worksheet")],
          ),
          lesson(
            "basic-tulip-foundation",
            "Basic Tulip Foundation",
            "Build two-stack and three-stack tulips without losing alignment.",
            "Tulips build on heart control. Each stack needs placement, controlled expansion, and a gentle push that moves the previous layer without flooding the cup.",
            [
              "Pour two stacked dots without finishing, focusing only on spacing.",
              "Use the second pour to push the first layer forward.",
              "Add a third layer only when the first two remain clear and centered.",
            ],
            "Your tulip layers are visible, separated, and aligned with the cup center.",
            760,
            [resource("latte-art-scorecard", "Latte Art Practice Scorecard", "worksheet")],
          ),
        ],
      },
    ],
  },
  {
    id: "latte-art-advanced",
    title: "Latte Art Advanced",
    slug: "latte-art-advanced",
    description:
      "Advanced free-pour latte art training for rosettas, winged tulips, ripples, composition, consistency, and professional pour assessment.",
    level: "advanced",
    instructor: "Falfalla Academy",
    instructorBio:
      "Advanced free-pour instruction for students who can already steam consistent milk and pour foundational hearts and tulips.",
    duration: 240,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1522992319-0365e5f11656?auto=format&fit=crop&w=1200&q=85",
    outcomes: [
      "Pour rosettas with balanced leaf structure",
      "Develop free-pour ripple control and winged tulips",
      "Combine patterns with strong contrast and composition",
      "Assess pours using professional repeatability standards",
    ],
    equipment: [
      "Espresso machine with steam wand",
      "Burr grinder",
      "Multiple milk pitchers (300–600ml)",
      "Latte art cups (various sizes)",
      "Whole milk (full fat, fresh)",
      "Phone/camera with slow-motion capability",
      "Scoring rubric printouts",
    ],
    enrollmentCount: 289,
    reviews: [
      {
        id: "review-advanced-1",
        author: "Noah T.",
        rating: 5,
        title: "Great for free pour goals",
        comment:
          "The ripple control and video review approach made rosetta practice much more measurable.",
        createdAt: "2026-04-26",
      },
    ],
    modules: [
      {
        id: "free-pour-technique",
        title: "Free-Pour Technique",
        description: "Advanced pitcher motion, flow control, and pattern construction.",
        lessons: [
          lesson(
            "rosetta-foundation",
            "Rosetta Foundation",
            "Build leaf structure with rhythm, drift, and a clean stem.",
            "A rosetta depends on steady flow, close pitcher position, and rhythmic lateral movement while drifting backward through the cup. The finish line should define the stem without washing out the leaves.",
            [
              "Practice wrist movement with water before steaming milk.",
              "Pour five slow rosettas and five faster rosettas, then compare leaf definition.",
              "Keep the pitcher close to the surface until the finish line.",
            ],
            "The rosetta has balanced leaves on both sides and a clear stem through the center.",
            780,
            [resource("rosetta-practice-rubric", "Rosetta Practice Rubric", "worksheet")],
          ),
          lesson(
            "ripple-control",
            "Ripple Control for Free Pour",
            "Develop consistent ripple width, pace, and placement for advanced patterns.",
            "Advanced free pour requires deliberate rhythm. Ripple quality comes from coordinated wrist motion, pitcher proximity, flow rate, milk texture, and cup rotation rather than random shaking.",
            [
              "Pour five ripple bases and score width consistency.",
              "Compare slow, medium, and fast ripple speeds using video review.",
              "Keep the ripple centered while changing cup tilt.",
            ],
            "Your ripple movement is controlled enough to repeat similar width and placement across three pours.",
            720,
          ),
          lesson(
            "winged-tulip",
            "Winged Tulip",
            "Turn tulip layers into a dynamic free-pour centerpiece.",
            "A winged tulip combines ripple control, stack placement, contrast preservation, and a decisive finish. The pattern should look intentional from the first glance and remain balanced in the cup.",
            [
              "Pour a small rippled base before adding the tulip stack.",
              "Keep cup rotation consistent so the wings stay symmetrical.",
              "Review each pour against contrast, symmetry, fill level, and service presentation.",
            ],
            "The pattern is recognizable at first glance, served at an appropriate fill level, and repeatable across three consecutive pours.",
            840,
            [resource("winged-tulip-rubric", "Winged Tulip Rubric", "worksheet")],
          ),
        ],
      },
      {
        id: "advanced-assessment",
        title: "Composition and Assessment",
        description: "Design, repetition, video review, and professional scoring.",
        lessons: [
          lesson(
            "pattern-composition",
            "Pattern Composition",
            "Use space, contrast, symmetry, and finish direction to make advanced pours clearer.",
            "Professional latte art is evaluated by clarity, symmetry, contrast, cup fill, cleanliness, and repeatability. Advanced students plan pattern placement before pouring so the design fits the cup.",
            [
              "Sketch three pattern layouts before pouring.",
              "Pour the same design three times and compare cup position, scale, and finish.",
              "Score each pour for contrast, symmetry, clarity, and service quality.",
            ],
            "You can plan and repeat a pattern with consistent placement and a clear finish line.",
            660,
            [resource("advanced-composition-scorecard", "Advanced Composition Scorecard", "worksheet")],
          ),
          lesson(
            "video-review-practice",
            "Video Review and Practice Plan",
            "Use video feedback to correct advanced free-pour technique.",
            "Video review helps identify issues that are difficult to feel in real time: pitcher height, late flow increase, cup angle changes, uneven drift, and rushed finish lines. Practice should target one variable at a time.",
            [
              "Record one pour from the side and one from above.",
              "Identify one technical issue and choose one correction drill.",
              "Create a weekly practice plan for milk texture, rosetta, tulip, and composition.",
            ],
            "You can use video review to create a focused practice plan instead of repeating mistakes.",
            600,
            [resource("advanced-practice-plan", "Advanced Free-Pour Practice Plan", "worksheet")],
          ),
        ],
      },
    ],
  },
  {
    id: "coffee-sensory",
    title: "Coffee Sensory & Tasting",
    slug: "coffee-sensory",
    description:
      "Develop a professional palate for coffee evaluation. Learn cupping protocols, flavor wheel vocabulary, and sensory calibration used by Q Graders and specialty roasters.",
    level: "intermediate",
    instructor: "Falfalla Academy",
    instructorBio:
      "Sensory training aligned with SCA Coffee Skills Program Sensory module. Built for baristas who want to taste and describe coffee with professional precision.",
    duration: 200,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85",
    outcomes: [
      "Use the SCA flavor wheel to describe coffee attributes",
      "Set up and execute a professional cupping session",
      "Calibrate sensory perception with triangulation exercises",
      "Identify roast defects and processing flavors",
    ],
    equipment: [
      "Cupping bowls (6–12)",
      "Cupping spoons",
      "Digital scale (0.1g precision)",
      "Gooseneck kettle",
      "Timer",
      "Flavor wheel reference chart",
      "Sensory reference kit (optional)",
    ],
    enrollmentCount: 195,
    reviews: [
      {
        id: "review-sensory-1",
        author: "Priya M.",
        rating: 5,
        title: "Game changer for my palate",
        comment: "The triangulation exercises trained my taste buds faster than years of casual cupping.",
        createdAt: "2026-04-30",
      },
    ],
    modules: [
      {
        id: "sensory-foundations",
        title: "Sensory Foundations",
        description: "Taste perception, aroma identification, and cupping protocols.",
        lessons: [
          lesson("taste-perception", "Taste Perception Basics", "Understand sweet, sour, bitter, salty, and umami in coffee context.", "Professional sensory evaluation starts with isolating basic tastes. Baristas who train their palate can give precise feedback on extraction quality, roast profile, and green coffee selection.", ["Taste reference solutions for sweet, sour, bitter, and salty.", "Rank intensity of three coffee samples on each taste axis.", "Describe the aftertaste of each sample in two words."], "You can identify and rank basic tastes in coffee without confusion.", 600),
          lesson("cupping-protocol", "Cupping Protocol", "Set up and execute SCA-style cupping for consistent evaluation.", "SCA cupping uses standardized ratios, grind size, water temperature, and timing to create a level field for evaluation. Professional cuppers follow the protocol to reduce bias and improve calibration.", ["Set up a cupping table with six samples at 8.25g per 150ml.", "Break the crust at four minutes and evaluate aroma.", "Score each sample for fragrance, flavor, aftertaste, acidity, body, and balance."], "You can run a basic cupping session and produce consistent notes across samples.", 720, [resource("cupping-form", "SCA Cupping Form Template", "worksheet")]),
          lesson("flavor-wheel-practice", "Flavor Wheel Practice", "Navigate the SCA flavor wheel from general to specific descriptors.", "The SCA Coffee Taster's Flavor Wheel organizes flavor descriptors from broad categories to specific attributes. Training moves from recognizing category level to identifying precise descriptors with confidence.", ["Place five coffees on the flavor wheel at category level.", "Narrow each placement to a specific descriptor.", "Compare your wheel placement with a partner's assessment."], "You can place a coffee on the flavor wheel at the specific descriptor level with reasonable accuracy.", 660, [resource("flavor-wheel-ref", "Flavor Wheel Reference Card")]),
        ],
      },
    ],
  },
  {
    id: "cafe-business",
    title: "Café Business Essentials",
    slug: "cafe-business",
    description:
      "Practical business training for opening, managing, or improving a specialty coffee café. Covers operations, costing, menu design, staffing, and customer experience.",
    level: "advanced",
    instructor: "Falfalla Academy",
    instructorBio:
      "Business fundamentals for specialty café owners and managers. Combines operational best practices with financial literacy and team management.",
    duration: 280,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85",
    outcomes: [
      "Build a café operations plan with clear cost structure",
      "Design a profitable menu with proper pricing",
      "Create a staffing plan and training workflow",
      "Plan customer experience from entry to departure",
    ],
    equipment: [
      "Spreadsheet software",
      "Menu costing template",
      "Point of sale system (for reference)",
    ],
    enrollmentCount: 142,
    reviews: [
      {
        id: "review-business-1",
        author: "Sam K.",
        rating: 5,
        title: "Saved me from costly mistakes",
        comment: "The costing module alone justified the course. I was underpricing my menu by 30%.",
        createdAt: "2026-05-01",
      },
    ],
    modules: [
      {
        id: "cafe-operations",
        title: "Café Operations",
        description: "Day-to-day operations, costing, menu pricing, and staffing.",
        lessons: [
          lesson("cafe-costing", "Café Cost Structure", "Understand fixed costs, variable costs, COGS, and break-even for a specialty café.", "Running a profitable café requires understanding cost categories: rent, utilities, and insurance are fixed; coffee, milk, and cups are variable. COGS as a percentage of revenue determines menu pricing flexibility.", ["List all fixed and variable costs for a sample café.", "Calculate COGS for three core menu items.", "Determine the daily break-even in cups sold."], "You can calculate break-even and identify the largest cost drivers for a small café.", 720),
          lesson("menu-design", "Menu Design & Pricing", "Design a focused menu with strategic pricing and margin targets.", "Menu engineering combines psychology, costing, and operational efficiency. Professional menus balance variety with workflow speed, price perception with margin targets, and seasonal items with core revenue.", ["Design a 12-item core menu with categories.", "Price each item using a cost-plus model with 70% margin target.", "Identify the three highest-margin and three highest-volume items."], "You have a costed menu that meets margin targets without overwhelming the bar workflow.", 660, [resource("menu-template", "Menu Engineering Template", "worksheet")]),
          lesson("staffing-training", "Staffing & Training Plans", "Create shift structures, role definitions, and onboarding workflows.", "Staff costs are typically the largest expense. Efficient scheduling, clear role definitions, cross-training, and structured onboarding reduce turnover and improve consistency.", ["Create a weekly shift plan for a two-barista, one-floor setup.", "Write a five-day onboarding checklist for a new barista.", "Define three measurable performance benchmarks per role."], "You have a staffing plan and onboarding checklist ready for hiring.", 600, [resource("onboarding-checklist", "Barista Onboarding Checklist", "checklist")]),
        ],
      },
    ],
  },
  {
    id: "brewing-methods",
    title: "Brewing Methods",
    slug: "brewing-methods",
    description:
      "Explore pour-over, immersion, and hybrid brewing methods. Learn extraction theory, recipe development, and how to dial in any brewer for consistent results.",
    level: "intermediate",
    instructor: "Falfalla Academy",
    instructorBio:
      "SCA-aligned brewing education for baristas and home enthusiasts. Covers the science of extraction and practical recipe development across popular brew methods.",
    duration: 220,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=85",
    outcomes: [
      "Explain extraction theory and the brewing control chart",
      "Develop recipes for V60, Chemex, AeroPress, and French Press",
      "Adjust grind, ratio, and pour technique for different coffees",
      "Evaluate brew quality with refractometer and taste",
    ],
    equipment: [
      "V60 dripper and filters",
      "Chemex and filters",
      "AeroPress",
      "French Press",
      "Gooseneck kettle with temperature control",
      "Burr grinder",
      "Digital scale (0.1g precision)",
      "Timer",
      "Refractometer (optional)",
    ],
    enrollmentCount: 234,
    reviews: [
      {
        id: "review-brewing-1",
        author: "Kai L.",
        rating: 5,
        title: "Finally understand extraction",
        comment: "The brewing control chart lesson connected theory to my daily V60 routine perfectly.",
        createdAt: "2026-04-29",
      },
    ],
    modules: [
      {
        id: "extraction-theory",
        title: "Extraction Theory",
        description: "Understanding how water extracts flavor compounds from ground coffee.",
        lessons: [
          lesson("extraction-variables", "Extraction Variables", "Learn how grind, ratio, temperature, time, and agitation affect extraction.", "Coffee extraction is governed by contact time, temperature, grind size, coffee-to-water ratio, and turbulence. Understanding these variables lets a brewer adjust any recipe systematically instead of by trial and error.", ["Brew three cups changing only grind size (fine, medium, coarse).", "Taste each and describe the extraction level.", "Record which variables you would adjust to improve each cup."], "You can identify under-extraction, ideal extraction, and over-extraction by taste.", 660),
          lesson("pour-over-recipes", "Pour-Over Recipes", "Develop repeatable V60 and Chemex recipes with bloom, pulse, and continuous pours.", "Pour-over brewing gives the brewer direct control over flow rate, pour pattern, and timing. V60 recipes typically use a 1:15–1:17 ratio with 92–96°C water and a 30-second bloom.", ["Brew a V60 using a 15g:250ml recipe with 30-second bloom.", "Compare a pulse pour versus continuous pour on the same coffee.", "Adjust the recipe for a different origin and note the taste change."], "You can produce a clean, balanced V60 cup and explain your recipe choices.", 720, [resource("pourover-recipe-log", "Pour-Over Recipe Log", "worksheet")]),
          lesson("immersion-brewing", "Immersion & Hybrid Brewing", "Master French Press, AeroPress, and hybrid methods for different contexts.", "Immersion brewing offers full contact time control with simpler technique. French Press uses coarse grinds and four minutes. AeroPress is versatile with recipes from espresso-style to long immersion.", ["Brew a French Press at 1:15 ratio with four-minute steep.", "Try three AeroPress recipes: standard, inverted, and bypass.", "Compare body and clarity across immersion versus pour-over."], "You can brew consistently with two immersion methods and explain the taste differences.", 660),
        ],
      },
    ],
  },
  {
    id: "espresso-machine-care",
    title: "Espresso Machine & Grinder Care",
    slug: "espresso-machine-care",
    description:
      "Complete equipment maintenance training for espresso machines and grinders. Learn daily, weekly, and monthly routines that protect quality, extend equipment life, and meet health standards.",
    level: "beginner",
    instructor: "Falfalla Academy",
    instructorBio:
      "Equipment care training for café staff and home enthusiasts. Proper maintenance protects drink quality, extends machine life, and ensures workplace safety.",
    duration: 160,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=1200&q=85",
    outcomes: [
      "Perform daily backflush and group head cleaning",
      "Execute weekly deep-clean with detergent and descaling awareness",
      "Maintain grinder burrs, hopper, and retention management",
      "Recognize early signs of mechanical problems",
    ],
    equipment: [
      "Espresso machine",
      "Blind basket / backflush disc",
      "Group head brush",
      "Espresso machine detergent",
      "Descaling solution",
      "Burr grinder",
      "Grinder brush and vacuum",
      "Food-safe lubricant",
    ],
    enrollmentCount: 178,
    reviews: [
      {
        id: "review-equipment-1",
        author: "Jess W.",
        rating: 5,
        title: "Essential knowledge",
        comment: "Our shots improved immediately after implementing the daily flush routine from this course.",
        createdAt: "2026-05-02",
      },
    ],
    modules: [
      {
        id: "daily-maintenance",
        title: "Daily & Weekly Maintenance",
        description: "Routine cleaning, backflushing, and grinder care schedules.",
        lessons: [
          lesson("daily-routine", "Daily Machine Routine", "Start-up, backflush, purge, wipe, and shutdown procedures.", "Daily machine care prevents rancid oil buildup, maintains extraction quality, and extends gasket and solenoid life. Every shift should begin with a flush cycle and end with a backflush using detergent.", ["Perform a start-up sequence: flush, temperature check, test shot.", "Backflush with detergent following machine manufacturer guidelines.", "Clean steam wand, drip tray, and work surfaces."], "You can run a complete daily open and close routine without a checklist prompt.", 540, [resource("daily-machine-checklist", "Daily Machine Checklist", "checklist")]),
          lesson("grinder-maintenance", "Grinder Maintenance", "Clean burrs, manage retention, calibrate grind settings.", "Grinder hygiene directly affects taste. Old grounds trapped in the chamber become stale and contaminate fresh doses. Regular purging, burr cleaning, and retention management keep flavor clean.", ["Purge the grinder with 2–3g of fresh beans before service.", "Remove burrs and brush away retained grounds weekly.", "Recalibrate after reassembly and pull a test shot."], "You can clean and recalibrate a grinder without affecting shot quality.", 600),
          lesson("deep-clean-descale", "Deep Clean & Descaling Awareness", "Weekly deep clean and understanding when descaling is needed.", "Deep cleaning removes oils that daily backflushing misses. Descaling addresses mineral buildup in boilers and lines. Frequency depends on water hardness and machine volume.", ["Perform a full group head soak with detergent.", "Inspect shower screen and replace if buildup is visible.", "Check water softener or filter status."], "You can complete a weekly deep clean and identify when descaling or filter replacement is needed.", 540, [resource("weekly-deep-clean", "Weekly Deep Clean Guide", "checklist")]),
        ],
      },
    ],
  },
];
