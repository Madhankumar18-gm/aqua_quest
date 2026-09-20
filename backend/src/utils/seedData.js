require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Article = require('../models/Article');
const Challenge = require('../models/Challenge');
const Quiz = require('../models/Quiz');
const Badge = require('../models/Badge');
const UserProgress = require('../models/UserProgress');
const connectDB = require('../config/db');

const initialBadges = [
  {
    code: 'FIRST_SPLASH',
    name: 'First Splash',
    description: 'Earn your first 50 points on AquaQuest!',
    iconName: 'droplet',
    category: 'points',
    requirementType: 'totalPoints',
    requirementThreshold: 50,
  },
  {
    code: 'AQUIFER_DEFENDER',
    name: 'Aquifer Defender',
    description: 'Reach 250 total conservation points.',
    iconName: 'shield',
    category: 'points',
    requirementType: 'totalPoints',
    requirementThreshold: 250,
  },
  {
    code: 'HYDRO_LEGEND',
    name: 'Hydro Legend',
    description: 'Reach 500 total conservation points and lead the community.',
    iconName: 'award',
    category: 'points',
    requirementType: 'totalPoints',
    requirementThreshold: 500,
  },
  {
    code: 'STREAK_3_DAYS',
    name: 'Hydro Scholar',
    description: 'Maintain a 3-day active streak of water saving.',
    iconName: 'flame',
    category: 'streak',
    requirementType: 'currentStreak',
    requirementThreshold: 3,
  },
  {
    code: 'STREAK_7_DAYS',
    name: 'Groundwater Mastermind',
    description: 'Maintain a 7-day active streak.',
    iconName: 'zap',
    category: 'streak',
    requirementType: 'currentStreak',
    requirementThreshold: 7,
  },
  {
    code: 'WATER_SAVER_100L',
    name: '100 Liters Saved',
    description: 'Save 100 liters of water through verified missions.',
    iconName: 'waves',
    category: 'water_saved',
    requirementType: 'waterSavedLiters',
    requirementThreshold: 100,
  },
  {
    code: 'WATER_SAVER_500L',
    name: 'Groundwater Guardian',
    description: 'Save 500 liters of water through verified missions.',
    iconName: 'shield-check',
    category: 'water_saved',
    requirementType: 'waterSavedLiters',
    requirementThreshold: 500,
  },
  {
    code: 'QUIZ_MASTER_1',
    name: 'Quiz Whiz',
    description: 'Successfully complete your first groundwater quiz.',
    iconName: 'help-circle',
    category: 'quizzes',
    requirementType: 'quizzesCompleted',
    requirementThreshold: 1,
  },
  {
    code: 'QUIZ_MASTER_5',
    name: 'Quiz Master',
    description: 'Successfully complete 5 groundwater quizzes.',
    iconName: 'book-open',
    category: 'quizzes',
    requirementType: 'quizzesCompleted',
    requirementThreshold: 5,
  },
  {
    code: 'CHALLENGE_CHAMP_1',
    name: 'Action Hero',
    description: 'Complete your first water conservation challenge.',
    iconName: 'check-circle',
    category: 'challenges',
    requirementType: 'challengesCompleted',
    requirementThreshold: 1,
  },
  {
    code: 'COMMUNITY_CHAMPION',
    name: 'Community Champion',
    description: 'Complete 5 challenges across daily and community categories.',
    iconName: 'users',
    category: 'challenges',
    requirementType: 'challengesCompleted',
    requirementThreshold: 5,
  },
];

const initialArticles = [
  {
    title: 'Understanding Groundwater: Earth’s Invisible Reserve',
    summary: 'Discover how groundwater feeds rivers, supplies drinking water to billions, and why over-extraction threatens global aquifers.',
    content: `Groundwater is water located beneath the earth's surface in soil pore spaces and in the fractures of rock formations. An aquifer is a unit of rock or an unconsolidated deposit when it can yield a usable quantity of water.

### Why Groundwater Matters
Over 2 billion people worldwide rely on groundwater as their primary source of drinking water. It also supplies nearly 40% of global agricultural irrigation.

### The Threat of Depletion
When groundwater is extracted faster than it is naturally recharged by rainfall and snowmelt, groundwater levels drop drastically. Consequences include:
- Land subsidence (sinking ground)
- Drying up of nearby wells and lakes
- Saltwater intrusion into coastal aquifers
- Decreased river base flows during dry periods

### What We Can Do
By adopting rainwater harvesting, constructing recharge pits, reducing agricultural runoff, and fixing household leaks, communities can restore aquifer balances.`,
    category: 'Groundwater Depletion',
    readingTimeMinutes: 4,
    author: 'Dr. Alisha Roy, Hydrogeologist',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    likesCount: 42,
  },
  {
    title: 'Rainwater Harvesting 101: Simple Rooftop Systems',
    summary: 'Learn how collecting rainwater from rooftops can directly recharge shallow aquifers and cut municipal water supply dependence.',
    content: `Rainwater harvesting (RWH) is the collection and storage of rain, rather than allowing it to run off. Rainwater is collected from a roof-like surface and redirected to a tank, cistern, deep pit, shaft, or aquifer.

### Key Components of a Rooftop System
1. **Catchment Surface**: The roof that receives direct rainfall.
2. **Gutters & Downpipes**: Channels transporting rain to storage or recharge pits.
3. **First Flush Diverter**: Flushes out the initial debris and atmospheric dust.
4. **Filter Unit**: Sand, gravel, and charcoal bed to remove suspended solids.
5. **Recharge Well / Bore**: Directs clean water straight into underground water tables.

### Benefits for Your Home & Community
- Reduces water bills by up to 40%.
- Prevents urban flooding and soil erosion.
- Replenishes depleted local wells within one rainy season.`,
    category: 'Rainwater Harvesting',
    readingTimeMinutes: 5,
    author: 'Markus Vance, Environmental Engineer',
    imageUrl: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    likesCount: 38,
  },
  {
    title: '5 Easy Household Fixes to Save 50+ Liters a Day',
    summary: 'Small daily adjustments in taps, showers, and flushing systems make a massive cumulative impact on water conservation.',
    content: `Saving water at home is easier than you think. Here are 5 high-impact daily habits:

1. **Install Aerators on Faucet Nozzles**: Reduces water flow by up to 50% without dropping pressure. Saves ~15L/day.
2. **Fix Leaky Taps Immediately**: A tap dripping at 1 drip per second wastes over 30 liters per day!
3. **Turn Off Tap While Brushing Teeth**: A running tap wastes 6 liters per minute.
4. **Dual-Flush Toilet Conversion**: A standard flush uses 9-12 liters. Dual flush uses only 3-6 liters.
5. **Re-use RO Purifier Wastewater**: Direct rejected RO water into buckets for mopping, washing cars, or watering gardens.`,
    category: 'Water Conservation Tips',
    readingTimeMinutes: 3,
    author: 'AquaQuest Conservation Desk',
    imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    likesCount: 56,
  },
  {
    title: 'Combating Groundwater Depletion & Land Subsidence',
    summary: 'An in-depth analysis of structural aquifer subsidence in megacities and technical mitigation frameworks.',
    content: `When groundwater extraction exceeds natural recharge for prolonged periods, the pore pressure in clay layers decreases. This leads to irreversible compaction of fine-grained sediments, causing land subsidence.

### Global Case Studies
Cities like Jakarta, Mexico City, and parts of California's Central Valley have experienced land subsidence ranging from 1 to 25 centimeters per year.

### Engineering Mitigations
- **Managed Aquifer Recharge (MAR)**: Injecting treated storm runoff directly into deep permeable strata.
- **Infiltration Basins**: Constructing unlined retention ponds above porous soil deposits.
- **Voluntary Extraction Caps**: Implementing smart telemetry flow meters on commercial agricultural wells.`,
    category: 'Groundwater Depletion',
    readingTimeMinutes: 6,
    author: 'Prof. Elena Rostova, Hydrologist',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
    likesCount: 29,
  },
  {
    title: 'Urban Aquifer Recharge: Pits, Wells, and Permeable Pavements',
    summary: 'How modern civil engineering transforms concrete jungles into sponges that absorb monsoon rains.',
    content: `Urbanization replaces natural soil with impervious surfaces like asphalt and concrete. Rainwater turns into destructive urban runoff instead of infiltrating into aquifers.

### Sponge City Innovations
1. **Permeable Pavement**: Porous concrete allowing rainfall to percolate into sub-base storage beds.
2. **Percolation Tanks**: Underground gravel-filled chambers that hold storm runoff while it slowly seeps into shallow water tables.
3. **Bio-swales**: Vegetated channels that slow down storm run-off and filter out heavy metals before groundwater entry.`,
    category: 'Aquifer Recharge',
    readingTimeMinutes: 5,
    author: 'David Chen, Civil & Urban Hydrologist',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    likesCount: 45,
  },
  {
    title: 'Water Pollution & Aquifer Protection: Keeping Our Wells Safe',
    summary: 'Protecting unconfined aquifers from industrial effluents, agricultural nitrates, and septic leakage.',
    content: `Groundwater pollution is insidious because contaminants travel invisibly through porous rock strata. Once an aquifer is contaminated, cleaning it can take decades and cost millions.

### Common Contaminants
- **Nitrates from Fertilizers**: Causes blue baby syndrome and aquatic eutrophication.
- **Heavy Metals & Solvents**: Industrial waste leaching through unlined landfills.
- **Pathogens**: Leakage from damaged underground sewage pipes into shallow dug wells.

### Protection Zones & Best Practices
Establishing wellhead protection radii where agricultural pesticide application and industrial storage are strictly prohibited is essential for municipal water security.`,
    category: 'Policy & Science',
    readingTimeMinutes: 5,
    author: 'Dr. Sarah Jenkins, Environmental Toxicologist',
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
    likesCount: 31,
  },
];

const initialChallenges = [
  {
    title: 'Fix a Leaky Tap or Pipe',
    description: 'Inspect every tap, shower, and toilet valve in your home. Fix any leaks or notify your maintenance team.',
    instructions: 'Check your kitchen, bathroom, and outdoor taps. Tighten loose washers or install a low-flow aerator.',
    category: 'Audit & Fix',
    difficulty: 'Easy',
    pointsReward: 40,
    waterSavedRewardLiters: 30,
    durationType: 'daily',
    iconName: 'wrench',
    isFeatured: true,
  },
  {
    title: 'The 5-Minute Shower Challenge',
    description: 'Cap your shower duration to under 5 minutes today. Every minute saved preserves up to 10 liters of water!',
    instructions: 'Use a timer or playlist song to track your shower. Turn off the shower head while soaping.',
    category: 'Daily Habits',
    difficulty: 'Easy',
    pointsReward: 30,
    waterSavedRewardLiters: 25,
    durationType: 'daily',
    iconName: 'shower-head',
    isFeatured: true,
  },
  {
    title: 'RO Reject Water Reuse',
    description: 'Collect wastewater from your Reverse Osmosis (RO) water purifier and reuse it for cleaning or gardening.',
    instructions: 'Place a clean bucket beneath your RO wastewater discharge pipe. Use the collected water to mop floors or water household plants.',
    category: 'Household Saving',
    difficulty: 'Medium',
    pointsReward: 60,
    waterSavedRewardLiters: 50,
    durationType: 'daily',
    iconName: 'bucket',
    isFeatured: true,
  },
  {
    title: 'Rooftop Rainwater Survey',
    description: 'Survey your home or building roof to evaluate its potential for rooftop rainwater harvesting.',
    instructions: 'Calculate your approximate roof area in square meters. Note down potential downspout locations for recharge pits.',
    category: 'Rainwater Harvesting',
    difficulty: 'Hard',
    pointsReward: 120,
    waterSavedRewardLiters: 100,
    durationType: 'one-time',
    iconName: 'home',
    isFeatured: true,
  },
  {
    title: 'Kitchen Bucket Water Saver',
    description: 'Rinse vegetables and fruits in a water bowl instead of under a running tap.',
    instructions: 'Fill a pan or bucket with water to wash vegetables. Reuse the wash water for pot plants.',
    category: 'Household Saving',
    difficulty: 'Easy',
    pointsReward: 35,
    waterSavedRewardLiters: 20,
    durationType: 'daily',
    iconName: 'droplet',
    isFeatured: false,
  },
  {
    title: 'Community Well Inspection & Awareness',
    description: 'Visit a local borewell or community well, check its surrounding sanitation zone, and share groundwater safety tips.',
    instructions: 'Ensure no stagnant wastewater accumulates near the wellhead. Share conservation brochures with neighbors.',
    category: 'Community Action',
    difficulty: 'Hard',
    pointsReward: 150,
    waterSavedRewardLiters: 150,
    durationType: 'weekly',
    iconName: 'users',
    isFeatured: false,
  },
  {
    title: 'Greywater Garden Irrigation',
    description: 'Divert non-toxic laundry or washbasin rinse water to irrigate outdoor garden beds.',
    instructions: 'Ensure eco-friendly biodegradable soap is used. Water soil directly near plant roots.',
    category: 'Household Saving',
    difficulty: 'Medium',
    pointsReward: 70,
    waterSavedRewardLiters: 60,
    durationType: 'daily',
    iconName: 'leaf',
    isFeatured: false,
  },
];

const initialQuizzes = [
  {
    title: 'Groundwater Fundamentals',
    description: 'Test your basic knowledge about aquifers, water tables, and natural recharge processes.',
    category: 'Groundwater Basics',
    difficulty: 'Beginner',
    pointsReward: 50,
    passingScorePercentage: 70,
    questions: [
      {
        questionText: 'What is an aquifer?',
        options: [
          'An artificial water pipe',
          'An underground layer of water-bearing permeable rock or sediment',
          'A type of surface river dam',
          'A rainwater filter machine',
        ],
        correctOptionIndex: 1,
        explanation: 'An aquifer is an underground geological formation of permeable rock, sand, or gravel that stores and yields groundwater.',
      },
      {
        questionText: 'What happens when groundwater is pumped faster than its natural recharge rate?',
        options: [
          'The water table rises',
          'The water table drops and wells can go dry',
          'The water becomes saltier automatically',
          'Ground pressure increases',
        ],
        correctOptionIndex: 1,
        explanation: 'Over-pumping causes groundwater depletion, dropping the water table level and drying up surrounding shallow wells.',
      },
      {
        questionText: 'Which sector accounts for the largest share of global groundwater extraction?',
        options: ['Household drinking', 'Industrial manufacturing', 'Agricultural irrigation', 'Golf courses'],
        correctOptionIndex: 2,
        explanation: 'Agriculture accounts for nearly 70% of global freshwater withdrawals and around 40% of groundwater usage.',
      },
      {
        questionText: 'What is land subsidence?',
        options: [
          'Flooding caused by heavy rainfall',
          'The gradual settling or sinking of the Earth’s surface due to subsurface water removal',
          'The growth of underground plants',
          'Evaporation of river water',
        ],
        correctOptionIndex: 1,
        explanation: 'When aquifers are drained of water, the soil and rock layers compress, causing the ground above to sink (subsidence).',
      },
    ],
  },
  {
    title: 'Rainwater Harvesting & Aquifer Recharge',
    description: 'Demonstrate your understanding of how rooftop harvesting restores depleted underground aquifers.',
    category: 'Rainwater Harvesting',
    difficulty: 'Intermediate',
    pointsReward: 80,
    passingScorePercentage: 70,
    questions: [
      {
        questionText: 'What is the primary function of a "First Flush Diverter" in rainwater harvesting?',
        options: [
          'To heat the collected water',
          'To discard the first rain run-off carrying roof dust and debris',
          'To pump water directly into taps',
          'To measure rainfall intensity',
        ],
        correctOptionIndex: 1,
        explanation: 'The first flush diverter routes the initial rain run-off away from storage because it carries dirt, leaves, and bird droppings accumulated on the roof.',
      },
      {
        questionText: 'How does artificial aquifer recharge help cities?',
        options: [
          'It increases urban temperatures',
          'It injects rainwater directly underground to replenish depleted water tables and prevent saltwater intrusion',
          'It replaces the need for storm drains entirely',
          'It converts saltwater to freshwater instantly',
        ],
        correctOptionIndex: 1,
        explanation: 'Artificial recharge structures direct surplus monsoon rainwater into underground aquifers, replenishing depleted groundwater stocks.',
      },
      {
        questionText: 'Which material is commonly used in a simple gravel-sand filter bed for rainwater?',
        options: ['Plastic beads and clay', 'Coarse sand, gravel, and activated charcoal', 'Salt and iron filings', 'Glass shards and cement'],
        correctOptionIndex: 1,
        explanation: 'A classic rainwater filter uses layers of coarse sand, gravel, and activated charcoal to trap suspended particles and odors.',
      },
      {
        questionText: 'What parameter determines rooftop rainwater yield?',
        options: ['Roof color and angle', 'Catchment surface area and annual rainfall depth', 'Distance to sea', 'Wind velocity'],
        correctOptionIndex: 1,
        explanation: 'Harvesting volume equals Catchment Area × Rainfall Depth × Runoff Coefficient.',
      },
    ],
  },
  {
    title: 'Water Pollution & Contamination Safeguards',
    description: 'Learn how pollutants migrate into aquifers and how to protect municipal wellhead protection zones.',
    category: 'Aquifers & Hydrogeology',
    difficulty: 'Intermediate',
    pointsReward: 75,
    passingScorePercentage: 70,
    questions: [
      {
        questionText: 'Why is nitrate contamination in rural drinking wells particularly dangerous?',
        options: [
          'It turns water green',
          'It can cause infant methemoglobinemia (blue baby syndrome)',
          'It freezes water at room temperature',
          'It causes mild soil erosion',
        ],
        correctOptionIndex: 1,
        explanation: 'High nitrate concentrations in drinking water impair oxygen transport in infants, causing methemoglobinemia.',
      },
      {
        questionText: 'What is saltwater intrusion in coastal aquifers?',
        options: [
          'Sprinkling salt on frozen rivers',
          'Seawater migrating into fresh groundwater aquifers due to excessive inland pumping',
          'Dams overflowing into ocean bays',
          'Desalination plant runoff',
        ],
        correctOptionIndex: 1,
        explanation: 'Lowering freshwater hydraulic head allows ocean saltwater to seep inland into drinking water wells.',
      },
      {
        questionText: 'Which geological formation acts as a natural aquitard (impermeable barrier)?',
        options: ['Coarse gravel bed', 'Dense un-fractured clay layer', 'Porously fractured sandstone', 'Coarse river sand'],
        correctOptionIndex: 1,
        explanation: 'Clay has extremely low permeability, retarding groundwater flow and acting as a confining aquitard.',
      },
      {
        questionText: 'What is a wellhead protection area (WHPA)?',
        options: [
          'A fence around a swimming pool',
          'A designated surface & subsurface zone surrounding a supply well where polluting activities are restricted',
          'A decorative roof over a hand pump',
          'A water testing lab building',
        ],
        correctOptionIndex: 1,
        explanation: 'WHPAs safeguard public supply wells by regulating hazardous land uses within the groundwater capture zone.',
      },
    ],
  },
  {
    title: 'Household Water Footprint & Audit',
    description: 'Evaluate daily direct and indirect water usage and discover efficient conservation alternatives.',
    category: 'Water Footprint',
    difficulty: 'Beginner',
    pointsReward: 60,
    passingScorePercentage: 70,
    questions: [
      {
        questionText: 'What is "virtual water"?',
        options: [
          'Water used in video games',
          'The volume of freshwater used to produce a good or service along its full supply chain',
          'Distilled water used in batteries',
          'Atmospheric water vapor',
        ],
        correctOptionIndex: 1,
        explanation: 'Virtual water represents embedded water consumed during agricultural or industrial production of food, clothes, and goods.',
      },
      {
        questionText: 'Roughly how much water does a leaking toilet flapper valve waste per day?',
        options: ['1 to 2 liters', 'Up to 200 liters', 'Zero liters', 'Exactly 10 liters'],
        correctOptionIndex: 1,
        explanation: 'A silent toilet leak past the flapper valve can waste between 100 to 300 liters of potable water daily.',
      },
      {
        questionText: 'How much water flow does a standard faucet aerator save?',
        options: ['0%', 'Up to 30-50%', '100%', '5%'],
        correctOptionIndex: 1,
        explanation: 'Aerators mix air into the water stream, reducing volume by 30-50% while maintaining strong stream pressure.',
      },
      {
        questionText: 'Which dishwashing method generally uses LESS water per item cleaned?',
        options: [
          'Running a full-load ENERGY STAR certified dishwasher',
          'Handwashing dishes under a continuous running tap',
          'Soaking dishes in boiling water for hours',
          'Rinsing each plate separately under full tap pressure',
        ],
        correctOptionIndex: 0,
        explanation: 'Modern efficient dishwashers use ~12L per cycle, whereas handwashing under a running tap uses up to 60L.',
      },
    ],
  },
  {
    title: 'Advanced Conservation & Sustainable Policy',
    description: 'Master hydro-geological principles, water pricing policies, and watershed governance frameworks.',
    category: 'Conservation Strategies',
    difficulty: 'Advanced',
    pointsReward: 100,
    passingScorePercentage: 70,
    questions: [
      {
        questionText: 'What is Integrated Water Resources Management (IWRM)?',
        options: [
          'Pumping water exclusively at night',
          'A process promoting coordinated development and management of water, land, and related resources to maximize equity and sustainability',
          'Building higher dams on every river',
          'Privatizing all groundwater wells',
        ],
        correctOptionIndex: 1,
        explanation: 'IWRM balances economic growth, social equity, and environmental sustainability across entire river basins.',
      },
      {
        questionText: 'What is Darcy’s Law in hydrogeology?',
        options: [
          'An equation describing groundwater flow rate through porous media proportional to hydraulic gradient',
          'A rule for rainwater tank sizing',
          'A law governing oceanic tides',
          'A formula for water boiling points',
        ],
        correctOptionIndex: 0,
        explanation: 'Darcy’s Law (Q = -K * A * dh/dl) calculates volumetric flow rate through subterranean aquifers.',
      },
      {
        questionText: 'What is the primary benefit of check dams in rural micro-watersheds?',
        options: [
          'Generating high-voltage hydroelectric power',
          'Slowing runoff speed to increase groundwater infiltration and trap silt',
          'Providing commercial boat navigation',
          'Attracting ocean migratory fish',
        ],
        correctOptionIndex: 1,
        explanation: 'Check dams slow down stream runoff, allowing water time to percolate into local unconfined aquifers.',
      },
      {
        questionText: 'Which monitoring tool uses satellites to measure global groundwater storage changes?',
        options: ['GRACE (Gravity Recovery and Climate Experiment)', 'GPS Speedometer', 'Weather Doppler Radar', 'Seismograph Network'],
        correctOptionIndex: 0,
        explanation: 'NASA/DLR GRACE twin satellites detect minute gravity variations caused by underground water mass displacement.',
      },
    ],
  },
];

// High quality demo users to create realistic leaderboard and user profiles
const demoUsersData = [
  {
    username: 'aarav_hydro',
    email: 'aarav@aquaquest.org',
    role: 'user',
    totalPoints: 680,
    level: 4,
    levelTitle: 'Aquifer Champion',
    currentStreak: 12,
    maxStreak: 14,
    waterSavedLiters: 480,
    avatar: 'droplet-green',
    badgeCodes: ['FIRST_SPLASH', 'AQUIFER_DEFENDER', 'HYDRO_LEGEND', 'STREAK_7_DAYS', 'WATER_SAVER_100L', 'QUIZ_MASTER_1', 'CHALLENGE_CHAMP_1'],
  },
  {
    username: 'priya_saver',
    email: 'priya@aquaquest.org',
    role: 'user',
    totalPoints: 450,
    level: 3,
    levelTitle: 'Hydro Guardian',
    currentStreak: 6,
    maxStreak: 8,
    waterSavedLiters: 310,
    avatar: 'droplet-blue',
    badgeCodes: ['FIRST_SPLASH', 'AQUIFER_DEFENDER', 'STREAK_3_DAYS', 'WATER_SAVER_100L', 'QUIZ_MASTER_1', 'CHALLENGE_CHAMP_1'],
  },
  {
    username: 'rohan_aquifer',
    email: 'rohan@aquaquest.org',
    role: 'user',
    totalPoints: 340,
    level: 3,
    levelTitle: 'Hydro Guardian',
    currentStreak: 5,
    maxStreak: 6,
    waterSavedLiters: 240,
    avatar: 'droplet-gold',
    badgeCodes: ['FIRST_SPLASH', 'AQUIFER_DEFENDER', 'STREAK_3_DAYS', 'WATER_SAVER_100L', 'CHALLENGE_CHAMP_1'],
  },
  {
    username: 'ananya_green',
    email: 'ananya@aquaquest.org',
    role: 'user',
    totalPoints: 210,
    level: 2,
    levelTitle: 'Water Shield',
    currentStreak: 3,
    maxStreak: 4,
    waterSavedLiters: 140,
    avatar: 'droplet-green',
    badgeCodes: ['FIRST_SPLASH', 'STREAK_3_DAYS', 'WATER_SAVER_100L'],
  },
  {
    username: 'vikram_rain',
    email: 'vikram@aquaquest.org',
    role: 'user',
    totalPoints: 130,
    level: 2,
    levelTitle: 'Water Shield',
    currentStreak: 2,
    maxStreak: 3,
    waterSavedLiters: 85,
    avatar: 'droplet-blue',
    badgeCodes: ['FIRST_SPLASH', 'CHALLENGE_CHAMP_1'],
  },
  {
    username: 'divya_eco',
    email: 'divya@aquaquest.org',
    role: 'user',
    totalPoints: 60,
    level: 1,
    levelTitle: 'Water Saver Trainee',
    currentStreak: 1,
    maxStreak: 2,
    waterSavedLiters: 30,
    avatar: 'droplet-blue',
    badgeCodes: ['FIRST_SPLASH'],
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('[Seed] Starting database check and seeding...');

    // 1. Seed Badges (idempotent check by badge code)
    for (const badgeData of initialBadges) {
      await Badge.updateOne({ code: badgeData.code }, { $set: badgeData }, { upsert: true });
    }
    console.log(`[Seed] Badges check complete (${initialBadges.length} defined).`);

    // 2. Seed Articles (idempotent check by title)
    for (const articleData of initialArticles) {
      await Article.updateOne({ title: articleData.title }, { $set: articleData }, { upsert: true });
    }
    console.log(`[Seed] Articles check complete (${initialArticles.length} defined).`);

    // 3. Seed Challenges (idempotent check by title)
    for (const challengeData of initialChallenges) {
      await Challenge.updateOne({ title: challengeData.title }, { $set: challengeData }, { upsert: true });
    }
    console.log(`[Seed] Challenges check complete (${initialChallenges.length} defined).`);

    // 4. Seed Quizzes (idempotent check by title)
    for (const quizData of initialQuizzes) {
      await Quiz.updateOne({ title: quizData.title }, { $set: quizData }, { upsert: true });
    }
    console.log(`[Seed] Quizzes check complete (${initialQuizzes.length} defined).`);

    // 5. Seed Default Admin User safely using process.env
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@aquaquest.org';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass123!';
    const adminUsername = process.env.ADMIN_USERNAME || 'AdminAqua';

    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
    if (!existingAdmin) {
      const newAdmin = new User({
        username: adminUsername,
        email: adminEmail.toLowerCase(),
        password: adminPassword,
        role: 'admin',
        totalPoints: 1200,
        level: 5,
        levelTitle: 'Water Conservation Hero',
        currentStreak: 7,
        maxStreak: 15,
        waterSavedLiters: 550,
        badges: [
          { badgeCode: 'FIRST_SPLASH' },
          { badgeCode: 'AQUIFER_DEFENDER' },
          { badgeCode: 'HYDRO_LEGEND' },
          { badgeCode: 'STREAK_7_DAYS' },
          { badgeCode: 'WATER_SAVER_500L' },
          { badgeCode: 'QUIZ_MASTER_5' },
          { badgeCode: 'COMMUNITY_CHAMPION' },
        ],
        avatar: 'droplet-gold',
      });
      await newAdmin.save();
      console.log(`[Seed] Created Default Admin User: ${adminEmail}`);
    } else {
      existingAdmin.role = 'admin';
      existingAdmin.totalPoints = Math.max(existingAdmin.totalPoints || 0, 1200);
      existingAdmin.level = 5;
      existingAdmin.levelTitle = 'Water Conservation Hero';
      await existingAdmin.save();
      console.log(`[Seed] Updated Default Admin User stats: ${adminEmail}`);
    }

    // 6. Seed Demo Users (idempotent check by email)
    const demoPassword = process.env.DEMO_USER_PASSWORD || 'DemoUser@123';
    for (const uData of demoUsersData) {
      const existingUser = await User.findOne({ email: uData.email.toLowerCase() });
      const badgesArray = uData.badgeCodes.map((code) => ({ badgeCode: code, earnedAt: new Date() }));

      if (!existingUser) {
        const newUser = new User({
          username: uData.username,
          email: uData.email.toLowerCase(),
          password: demoPassword,
          role: uData.role,
          totalPoints: uData.totalPoints,
          level: uData.level,
          levelTitle: uData.levelTitle,
          currentStreak: uData.currentStreak,
          maxStreak: uData.maxStreak,
          waterSavedLiters: uData.waterSavedLiters,
          badges: badgesArray,
          avatar: uData.avatar,
        });
        await newUser.save();
        console.log(`[Seed] Created Demo User: ${uData.username}`);
      } else {
        existingUser.totalPoints = uData.totalPoints;
        existingUser.level = uData.level;
        existingUser.levelTitle = uData.levelTitle;
        existingUser.currentStreak = uData.currentStreak;
        existingUser.maxStreak = uData.maxStreak;
        existingUser.waterSavedLiters = uData.waterSavedLiters;
        existingUser.badges = badgesArray;
        await existingUser.save();
        console.log(`[Seed] Refreshed Demo User stats: ${uData.username}`);
      }
    }

    // 7. Seed UserProgress for Demo Users (idempotent via userId & activityKey)
    const allChallenges = await Challenge.find({});
    const allQuizzes = await Quiz.find({});
    const mainDemoUser = await User.findOne({ email: 'aarav@aquaquest.org' });

    if (mainDemoUser && allChallenges.length > 0 && allQuizzes.length > 0) {
      const sampleChallenge = allChallenges[0];
      const sampleQuiz = allQuizzes[0];

      // Seed 1 challenge progress
      await UserProgress.updateOne(
        { userId: mainDemoUser._id, activityKey: `challenge_${sampleChallenge._id}_demo` },
        {
          $setOnInsert: {
            userId: mainDemoUser._id,
            activityType: 'challenge',
            activityId: sampleChallenge._id.toString(),
            activityKey: `challenge_${sampleChallenge._id}_demo`,
            pointsEarned: sampleChallenge.pointsReward,
            waterSavedLiters: sampleChallenge.waterSavedRewardLiters,
            details: { title: sampleChallenge.title },
          },
        },
        { upsert: true }
      );

      // Seed 1 quiz progress
      await UserProgress.updateOne(
        { userId: mainDemoUser._id, activityKey: `quiz_${sampleQuiz._id}_demo` },
        {
          $setOnInsert: {
            userId: mainDemoUser._id,
            activityType: 'quiz',
            activityId: sampleQuiz._id.toString(),
            activityKey: `quiz_${sampleQuiz._id}_demo`,
            pointsEarned: sampleQuiz.pointsReward,
            scorePercentage: 100,
            details: { title: sampleQuiz.title, totalQuestions: sampleQuiz.questions.length },
          },
        },
        { upsert: true }
      );
    }

    console.log('[Seed] Database seeding completed successfully.');
    if (require.main === module) {
      process.exit(0);
    }
  } catch (err) {
    console.error(`[Seed Error] Database seeding failed: ${err.message}`);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
