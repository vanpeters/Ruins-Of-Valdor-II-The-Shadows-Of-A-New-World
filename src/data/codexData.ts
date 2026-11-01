import { CodexEntry } from '../types/game';

// The Comprehensive 309-Entry World Codex for Realms of Valdor: Shadow Mark
// 14 Categories strictly structured with live combat stats, rarity, origin, tags, and field notes.

export const CODEX_ENTRIES: CodexEntry[] = [
  // ==========================================
  // 1. BESTIARY (50 Entries)
  // ==========================================
  {
    id: 'mon-01',
    name: 'Corrupted Thrall',
    category: 'Bestiary',
    rarity: 'Common',
    origin: 'The Ashen Reach',
    classification: 'Undead Humanoid',
    description: 'Former pilgrims caught in the awakening of the Shadow Mark, their flesh desiccated and their minds consumed by the whisper of the Ashen Sovereign.',
    fieldNotes: 'Slow movement but strikes in swarms. Vulnerable to fire and radiant strikes. Deflecting their clumsy flails easily breaks their frail poise.',
    tags: ['Undead', 'Swarm', 'Ashen', 'Low-Threat'],
    icon: '💀',
    stats: { hp: 120, attack: 18, defense: 5, speed: 8, poise: 30, xpReward: 35, weakness: 'Fire / Radiant', drops: ['Bone Fragment', 'Tattered Cloth', 'Ashen Dust'] }
  },
  {
    id: 'mon-02',
    name: 'Crypt Ghoul',
    category: 'Bestiary',
    rarity: 'Common',
    origin: 'Forsaken Catacombs',
    classification: 'Abyssal Scavenger',
    description: 'A ravenous humanoid twisted by decades of gorging on corrupted marrow within the royal mausoleums.',
    fieldNotes: 'Leaps from shadows with feral frenzy. Use a timely parry as it lunges to stagger it instantly.',
    tags: ['Scavenger', 'Undead', 'Aggressive', 'Bleed'],
    icon: '🧟',
    stats: { hp: 180, attack: 28, defense: 8, speed: 14, poise: 45, xpReward: 55, weakness: 'Radiant', drops: ['Ghoul Claws', 'Putrid Flesh'] }
  },
  {
    id: 'mon-03',
    name: 'Ashen Sentry',
    category: 'Bestiary',
    rarity: 'Uncommon',
    origin: 'Valdor Gatehouse',
    classification: 'Animated Armor',
    description: 'Plate-clad guardians whose souls were bound to blackened iron during the Siege of the Ashen Crown.',
    fieldNotes: 'Carries a heavy tower shield. Attacks bounce unless timed during its heavy windup or broken with an Umbral Detonation.',
    tags: ['Construct', 'Shieldbearer', 'Heavy Armor', 'Poise'],
    icon: '🛡️',
    stats: { hp: 320, attack: 35, defense: 22, speed: 7, poise: 85, xpReward: 95, weakness: 'Lightning / Umbral', drops: ['Iron Scrap', 'Sentry Crest'] }
  },
  {
    id: 'mon-04',
    name: 'Gloom Stalker',
    category: 'Bestiary',
    rarity: 'Uncommon',
    origin: 'Whispering Marshes',
    classification: 'Umbral Beast',
    description: 'A quadrapedal predator woven from damp peat and shadow tendrils that stalks the miasmic fens.',
    fieldNotes: 'Can cloak itself in mist before executing an unblockable pounce. Watch for the violet glint in its eyes.',
    tags: ['Beast', 'Stealth', 'Ambush', 'Marshes'],
    icon: '🐺',
    stats: { hp: 260, attack: 42, defense: 12, speed: 18, poise: 50, xpReward: 85, weakness: 'Fire', drops: ['Shadow Pelt', 'Gloom Fang'] }
  },
  {
    id: 'mon-05',
    name: 'Bone Knight',
    category: 'Bestiary',
    rarity: 'Rare',
    origin: 'Hall of the Fallen Kings',
    classification: 'Elite Undead',
    description: 'An ancient champion of Valdor reanimated with dark runic inscriptions carved directly onto its skeletal frame.',
    fieldNotes: 'Wields a serrated zweihander. Executes a triple-strike combo that requires consecutive parries to counter.',
    tags: ['Elite', 'Undead', 'Combo', 'Zweihander'],
    icon: '⚔️',
    stats: { hp: 450, attack: 52, defense: 18, speed: 11, poise: 100, xpReward: 160, weakness: 'Blunt / Radiant', drops: ['Ancient Rib', 'Serrated Shard'] }
  },
  {
    id: 'mon-06',
    name: 'Void Cultist',
    category: 'Bestiary',
    rarity: 'Uncommon',
    origin: 'Sunken Vaults',
    classification: 'Human Heretic',
    description: 'Fanatics who offered their own blood to open the abyssal fissures running beneath the royal capital.',
    fieldNotes: 'Casts tracking void orbs. Interrupt their incantations with rapid light strikes before the orb manifests.',
    tags: ['Caster', 'Void', 'Ranged', 'Frail'],
    icon: '🔮',
    stats: { hp: 200, attack: 48, defense: 6, speed: 9, poise: 35, xpReward: 75, weakness: 'Physical', drops: ['Void Sigil', 'Cultist Cowl'] }
  },
  {
    id: 'mon-07',
    name: 'Abyssal Fiend',
    category: 'Bestiary',
    rarity: 'Rare',
    origin: 'The Great Fissure',
    classification: 'Lesser Demon',
    description: 'A towering creature of obsidian carapace and molten shadow blood that tore through the barrier during the Eclipse.',
    fieldNotes: 'Slams the earth to send shockwaves across the floor. Jump or dodge roll through the expanding ring.',
    tags: ['Demon', 'Area-Effect', 'Heavy', 'Void'],
    icon: '👹',
    stats: { hp: 600, attack: 60, defense: 25, speed: 8, poise: 130, xpReward: 220, weakness: 'Frost / Radiant', drops: ['Abyssal Horn', 'Fiend Heart'] }
  },
  {
    id: 'mon-08',
    name: 'Cinder Wight',
    category: 'Bestiary',
    rarity: 'Uncommon',
    origin: 'The Smoldering Bastion',
    classification: 'Elemental Undead',
    description: 'Corrupted warriors burned to ash during the fiery purges, yet kept animated by unending malice.',
    fieldNotes: 'Leaves trails of flaming embers upon dodging. Explodes into molten fragments upon death.',
    tags: ['Undead', 'Fire', 'Explosive', 'Hazard'],
    icon: '🔥',
    stats: { hp: 240, attack: 38, defense: 10, speed: 12, poise: 40, xpReward: 80, weakness: 'Water / Void', drops: ['Cinder Core', 'Charred Bone'] }
  },
  {
    id: 'mon-09',
    name: 'Mire Leech-Colossus',
    category: 'Bestiary',
    rarity: 'Rare',
    origin: 'Drowned Necropolis',
    classification: 'Monstrosity',
    description: 'A bloated annelid that has nested among submerged royal sarcophagi, drinking decades of embalming essence.',
    fieldNotes: 'Sucks player blood to regenerate its massive hit point pool. Break its poise swiftly to disrupt the siphon.',
    tags: ['Monstrosity', 'Regen', 'Toxic', 'Siphon'],
    icon: '🪱',
    stats: { hp: 750, attack: 45, defense: 15, speed: 6, poise: 120, xpReward: 250, weakness: 'Fire / Lightning', drops: ['Leech Mucus', 'Bloated Siphon'] }
  },
  {
    id: 'mon-10',
    name: 'Spectral Maiden',
    category: 'Bestiary',
    rarity: 'Rare',
    origin: 'Weeping Gallery',
    classification: 'Wraith',
    description: 'The wailing apparitions of noble court ladies drowned in the citadel cistern during the purge.',
    fieldNotes: 'Ethereal form grants 50% physical resistance. Hit with Umbral spells or detonate Shadow Marks to banish.',
    tags: ['Wraith', 'Ethereal', 'Scream', 'Curse'],
    icon: '👻',
    stats: { hp: 310, attack: 55, defense: 30, speed: 15, poise: 60, xpReward: 180, weakness: 'Radiant / Umbral', drops: ['Ethereal Veil', 'Silver Locket'] }
  },
  {
    id: 'mon-11',
    name: 'Gorgorath the Unbroken Bone-Titan',
    category: 'Bestiary',
    rarity: 'Epic',
    origin: 'The Ossuary of Titans',
    classification: 'Colossal Undead Boss',
    description: 'An amalgamation of thousand fallen legionnaires woven into a towering skeletal colossus that guards the lower seal.',
    fieldNotes: 'Colossal sweep attacks cover the entire arena. Requires breaking his knee plates to bring him down for a visceral riposte.',
    tags: ['Boss', 'Colossus', 'Multi-Phase', 'Bone'],
    icon: '☠️',
    stats: { hp: 2200, attack: 75, defense: 35, speed: 6, poise: 220, xpReward: 750, boss: true, phaseCount: 2, weakness: 'Blunt / Holy', drops: ['Titan Bone Core', 'Crown of the Legion'] }
  },
  {
    id: 'mon-12',
    name: 'Vespera the Shadow Weaver',
    category: 'Bestiary',
    rarity: 'Legendary',
    origin: 'The Crimson Loom',
    classification: 'Arch-Sorceress Boss',
    description: 'Former grand astrologer of the Valdor court who discovered how to weave the threads of the Void into living nightmares.',
    fieldNotes: 'Creates phantom mirror images and traps the floor in silk snare runes. Detonate Shadow Marks to unravel her barrier.',
    tags: ['Boss', 'Sorceress', 'Illusions', 'Shadow Mark'],
    icon: '🕸️',
    stats: { hp: 2800, attack: 88, defense: 28, speed: 16, poise: 180, xpReward: 1200, boss: true, phaseCount: 3, weakness: 'Radiant / Pierce', drops: ['Weaver Spindle', 'Tears of the Eclipse'] }
  },
  {
    id: 'mon-13',
    name: 'Malakor the Hollow Sovereign',
    category: 'Bestiary',
    rarity: 'Mythic',
    origin: 'Throne of the Ashen Crown',
    classification: 'Fallen God-King Boss',
    description: 'The supreme monarch of Valdor who refused mortality and bound the Shadow Mark into his chest, becoming the eternal nexus of corruption.',
    fieldNotes: 'Wields the Greatsword of the Eclipse. Phase 2 ignites black flame arena walls; phase 3 unleashes the Void Singularity. Master your parry or perish.',
    tags: ['Final Boss', 'Sovereign', 'Black Flame', 'Mythic'],
    icon: '👑',
    stats: { hp: 4200, attack: 110, defense: 45, speed: 14, poise: 300, xpReward: 2500, boss: true, phaseCount: 3, weakness: 'Radiant', drops: ['Heart of the Sovereign', 'The Ashen Crown'] }
  },
  // Bestiary 14-50 (Authoritative roster filling the full 50 entries)
  ...[
    { name: 'Ashen Hound', origin: 'Ashen Reach', class: 'Beast', hp: 140, atk: 22, def: 6, spd: 16, poise: 35, xp: 45, tag: 'Pack Hunter', icon: '🐕' },
    { name: 'Carrion Crow of Valdor', origin: 'High Ramparts', class: 'Flying Vermin', hp: 90, atk: 15, def: 3, spd: 20, poise: 20, xp: 30, tag: 'Air', icon: '🦅' },
    { name: 'Bog Lurker', origin: 'Whispering Marshes', class: 'Monstrosity', hp: 340, atk: 36, def: 14, spd: 8, poise: 70, xp: 90, tag: 'Submerged', icon: '🐸' },
    { name: 'Crestfallen Duelist', origin: 'Royal Gardens', class: 'Corrupted Knight', hp: 380, atk: 45, def: 16, spd: 15, poise: 80, xp: 120, tag: 'Parry Master', icon: '🤺' },
    { name: 'Void Drake', origin: 'The Bleak Spire', class: 'Draconic', hp: 850, atk: 70, def: 30, spd: 12, poise: 160, xp: 320, tag: 'Dragon', icon: '🐉' },
    { name: 'Pestilent Swarm', origin: 'Sewers of Valdor', class: 'Insects', hp: 110, atk: 20, def: 2, spd: 18, poise: 15, xp: 40, tag: 'Poison', icon: '🦟' },
    { name: 'Abyssal Crab', origin: 'Sunken Coast', class: 'Carapace Beast', hp: 420, atk: 32, def: 40, spd: 5, poise: 110, xp: 105, tag: 'Armor', icon: '🦀' },
    { name: 'Ironfang Wolf', origin: 'Frostpeak Pass', class: 'Beast', hp: 280, atk: 40, def: 12, spd: 17, poise: 55, xp: 85, tag: 'Cold', icon: '🐺' },
    { name: 'Charnel Juggernaut', origin: 'Graveyard of Kings', class: 'Undead Behemoth', hp: 980, atk: 68, def: 26, spd: 6, poise: 190, xp: 280, tag: 'Slam', icon: '🪨' },
    { name: 'Umbral Assassin', origin: 'Shadowed Alleys', class: 'Rogue', hp: 260, atk: 58, def: 10, spd: 22, poise: 45, xp: 140, tag: 'Dagger / Crit', icon: '🗡️' },
    { name: 'Catacomb Necromancer', origin: 'Sepulcher of Sorrows', class: 'Mage', hp: 290, atk: 50, def: 11, spd: 9, poise: 40, xp: 150, tag: 'Summoner', icon: '📜' },
    { name: 'Gargoyle of the Archway', origin: 'Cathedral Heights', class: 'Stone Construct', hp: 520, atk: 48, def: 38, spd: 10, poise: 130, xp: 175, tag: 'Stone / Dive', icon: '🗿' },
    { name: 'Blood Leech Queen', origin: 'Drowned Cellar', class: 'Parasite', hp: 650, atk: 44, def: 18, spd: 7, poise: 95, xp: 210, tag: 'Lifesteal', icon: '🩸' },
    { name: 'Duskwood Treant', origin: 'The Tangled Thicket', class: 'Plant Horror', hp: 820, atk: 54, def: 24, spd: 5, poise: 150, xp: 240, tag: 'Root Snare', icon: '🌲' },
    { name: 'Blighted Cleric', origin: 'Desecrated Chapel', class: 'Corrupted Caster', hp: 320, atk: 46, def: 15, spd: 10, poise: 50, xp: 110, tag: 'Dark Healing', icon: '⛪' },
    { name: 'Executioner of Valdor', origin: 'Gibbet Square', class: 'Heavy Elite', hp: 890, atk: 72, def: 22, spd: 8, poise: 170, xp: 290, tag: 'Guillotine Strike', icon: '🪓' },
    { name: 'Voidling Broodmother', origin: 'Deep Chasm', class: 'Arachnid', hp: 740, atk: 52, def: 20, spd: 13, poise: 105, xp: 230, tag: 'Eggs / Web', icon: '🕷️' },
    { name: 'Obsidian Golem', origin: 'The Foundry of Regret', class: 'Magma Construct', hp: 1100, atk: 64, def: 48, spd: 4, poise: 220, xp: 340, tag: 'Immune Bleed', icon: '🌋' },
    { name: 'Phantom Spearman', origin: 'Fortress Courtyard', class: 'Specter', hp: 300, atk: 44, def: 25, spd: 14, poise: 65, xp: 130, tag: 'Thrust / Reach', icon: '🔱' },
    { name: 'Crimson Bat Swarm', origin: 'Belfry of Valdor', class: 'Flying Swarm', hp: 160, atk: 24, def: 4, spd: 19, poise: 25, xp: 50, tag: 'Agile', icon: '🦇' },
    { name: 'Rift Fiend', origin: 'Astral Rift', class: 'Aberration', hp: 490, atk: 62, def: 16, spd: 13, poise: 85, xp: 190, tag: 'Phase Shift', icon: '🌀' },
    { name: 'Tortured Alchemist', origin: 'Subterranean Lab', class: 'Mutated Human', hp: 360, atk: 54, def: 12, spd: 11, poise: 55, xp: 145, tag: 'Acid Vials', icon: '🧪' },
    { name: 'Shadow Knight Commander', origin: 'The Black Bastion', class: 'Elite Knight', hp: 920, atk: 76, def: 32, spd: 12, poise: 180, xp: 360, tag: 'Dark Aura', icon: '🛡️' },
    { name: 'Cinder Salamander', origin: 'Brimstone Trench', class: 'Reptile', hp: 410, atk: 42, def: 22, spd: 11, poise: 75, xp: 125, tag: 'Flame Breath', icon: '🦎' },
    { name: 'Wailing Penitent', origin: 'Iron Maiden Vault', class: 'Cursed Penitent', hp: 280, atk: 38, def: 14, spd: 9, poise: 60, xp: 95, tag: 'Spike Armor', icon: '⛓️' },
    { name: 'Grave Robber Captain', origin: 'Outlaw Ravine', class: 'Human Bandit', hp: 390, atk: 47, def: 15, spd: 13, poise: 70, xp: 115, tag: 'Crossbow / Traps', icon: '🏹' },
    { name: 'Ashen Hydra Whelp', origin: 'Sulphur Lake', class: 'Hydra', hp: 680, atk: 56, def: 19, spd: 9, poise: 115, xp: 225, tag: 'Multi-Head', icon: '🐍' },
    { name: 'Evershifting Doppelganger', origin: 'Mirror Hall', class: 'Shapeshifter', hp: 430, atk: 55, def: 20, spd: 16, poise: 80, xp: 200, tag: 'Player Clone', icon: '👥' },
    { name: 'Frostbound Reaver', origin: 'Glacial Cavern', class: 'Barbarian Wraith', hp: 580, atk: 61, def: 22, spd: 10, poise: 125, xp: 215, tag: 'Chill Stomp', icon: '❄️' },
    { name: 'Sunken Leviathan Larva', origin: 'Abyssal Trench', class: 'Aquatic Aberration', hp: 790, atk: 53, def: 28, spd: 7, poise: 140, xp: 270, tag: 'Whirlpool', icon: '🦑' },
    { name: 'Void-Touched Griffin', origin: 'Shattered Peak', class: 'Mythic Beast', hp: 860, atk: 69, def: 25, spd: 17, poise: 150, xp: 330, tag: 'Aerial Dive', icon: '🦅' },
    { name: 'Corrupted Royal Paladin', origin: 'Sanctum of the Sun', class: 'Corrupted Holy', hp: 640, atk: 63, def: 34, spd: 11, poise: 135, xp: 255, tag: 'Smite', icon: '⚔️' },
    { name: 'Weeping Marionette', origin: 'Clockwork Gallery', class: 'Haunted Toy', hp: 220, atk: 36, def: 12, spd: 15, poise: 40, xp: 85, tag: 'Strings / Jerky', icon: '🎭' },
    { name: 'Spore-Gorged Beetle', origin: 'Fungal Grotto', class: 'Insect', hp: 370, atk: 30, def: 32, spd: 8, poise: 90, xp: 100, tag: 'Poison Spores', icon: '🪲' },
    { name: 'Soul-Bound Ballista', origin: 'Siege Works', class: 'Siege Engine', hp: 610, atk: 85, def: 30, spd: 3, poise: 140, xp: 240, tag: 'Heavy Bolt', icon: '🏹' },
    { name: 'Hollow Charioteer', origin: 'Royal Arena', class: 'Mounted Elite', hp: 780, atk: 66, def: 24, spd: 19, poise: 160, xp: 310, tag: 'Trample', icon: '🐎' },
    { name: 'Eclipse Herald', origin: 'Lunar Spire', class: 'Arch-Priest', hp: 590, atk: 71, def: 21, spd: 12, poise: 95, xp: 280, tag: 'Black Starfall', icon: '🌑' },
  ].map((b, idx) => ({
    id: `mon-${idx + 14}`,
    name: b.name,
    category: 'Bestiary' as const,
    rarity: (idx > 28 ? 'Epic' : idx > 15 ? 'Rare' : 'Uncommon') as any,
    origin: b.origin,
    classification: b.class,
    description: `A formidable creature documented in the royal chronicles. Possesses dangerous predatory instincts and dark adaptations.`,
    fieldNotes: `Known for ${b.tag.toLowerCase()}. Time attacks around its recovery frames for optimal counter-damage.`,
    tags: [b.class, b.tag, 'Combat Ready'],
    icon: b.icon,
    stats: {
      hp: b.hp,
      attack: b.atk,
      defense: b.def,
      speed: b.spd,
      poise: b.poise,
      xpReward: b.xp,
      weakness: 'Physical / Elemental',
      drops: ['Beast Essence', 'Ancient Coin']
    }
  })),

  // ==========================================
  // 2. WILDLIFE (20 Entries)
  // ==========================================
  ...[
    { name: 'Ashen Stag', icon: '🦌', rarity: 'Uncommon', origin: 'The Ashmere Woods', desc: 'A majestic deer with silver antlers coated in fine volcanic ash.' },
    { name: 'Cinder Fox', icon: '🦊', rarity: 'Common', origin: 'Ember Valley', desc: 'A swift fox with blazing tail tips that warmth-hunts small burrowing vermin.' },
    { name: 'Gloom Raven', icon: '🪶', rarity: 'Common', origin: 'Whispering Marshes', desc: 'Intelligent scavengers that echo the last words of dying travelers.' },
    { name: 'Mire Toad', icon: '🐸', rarity: 'Common', origin: 'Drowned Fens', desc: 'A bulbous amphibious creature secreting mild paralyzing mucus.' },
    { name: 'Cave Blind-Fish', icon: '🐟', rarity: 'Common', origin: 'Subterranean River', desc: 'Translucent fish thriving in pitch-black mineral-rich underground pools.' },
    { name: 'Pale Hare', icon: '🐇', rarity: 'Common', origin: 'Frostpeak Slopes', desc: 'Camouflaged herbivore capable of darting through snowdrifts unseen.' },
    { name: 'Soot Owl', icon: '🦉', rarity: 'Uncommon', origin: 'The Old Chimneys', desc: 'A nocturnal hunter that preys on bats and corrupted mice.' },
    { name: 'Gilded Chameleon', icon: '🦎', rarity: 'Rare', origin: 'Ruined Solarium', desc: 'Shifts scales to mirror raw gold ore, confusing prospectors.' },
    { name: 'Bramble Viper', icon: '🐍', rarity: 'Uncommon', origin: 'Briar Maze', desc: 'Its venom thins blood rapidly, causing profuse hemorrhaging.' },
    { name: 'Crag Goat', icon: '🐐', rarity: 'Common', origin: 'Iron Crags', desc: 'Horns strong enough to crack granite while competing on steep cliffs.' },
    { name: 'Luminescent Jelly', icon: '🪼', rarity: 'Uncommon', origin: 'Sunken Grotto', desc: 'Glows in rhythm with lunar tides beneath the flooded caves.' },
    { name: 'Bog Turtle', icon: '🐢', rarity: 'Common', origin: 'Murk Shallow', desc: 'Moss-covered shell mimics submerged stepping stones.' },
    { name: 'Silver Trout', icon: '🎣', rarity: 'Common', origin: 'Clearwater Brook', desc: 'Prized river catch packed with restorative stamina minerals.' },
    { name: 'Dusk Moth', icon: '🦋', rarity: 'Rare', origin: 'Violet Glade', desc: 'Wing dust can be refined into potent soothing sleep tonics.' },
    { name: 'Bone-Eating Vulture', icon: '🦅', rarity: 'Uncommon', origin: 'Gallows Plain', desc: 'Possesses stomach acid potent enough to dissolve iron nails.' },
    { name: 'Mire Heron', icon: '🪶', rarity: 'Common', origin: 'Reed Flats', desc: 'Stands motionless for hours before spearing prey with surgical speed.' },
    { name: 'Obsidian Beetle', icon: '🪲', rarity: 'Uncommon', origin: 'Basalt Fields', desc: 'Carries heat within its shell, used by wanderers as pocket warmers.' },
    { name: 'Weeping Badger', icon: '🦡', rarity: 'Common', origin: 'Roots of Valdor', desc: 'Digs deep tunnels that sometimes breach forgotten catacomb walls.' },
    { name: 'Storm Petrel', icon: '🕊️', rarity: 'Rare', origin: 'Cliffs of Sorrow', desc: 'Its appearance signals impending void storms across the coast.' },
    { name: 'Echo Bat', icon: '🦇', rarity: 'Uncommon', origin: 'Resonance Caverns', desc: 'Uses harmonic ultrasonic bursts to disorient insects mid-flight.' }
  ].map((w, idx) => ({
    id: `wild-${idx + 1}`,
    name: w.name,
    category: 'Wildlife' as const,
    rarity: w.rarity as any,
    origin: w.origin,
    classification: 'Flora & Fauna',
    description: w.desc,
    fieldNotes: 'Passive or reactive wild beast of the realm. Vital source of foraging and leather crafting materials.',
    tags: ['Wildlife', 'Nature', 'Valdor Ecosystem'],
    icon: w.icon
  })),

  // ==========================================
  // 3. COMPANIONS & PETS (16 Entries)
  // ==========================================
  ...[
    { name: 'Void Lynx', icon: '🐈‍⬛', rarity: 'Epic', desc: 'A feline whose footsteps leave silent violet sparks. Sniffs out hidden secret walls and treasure chests.' },
    { name: 'Ember Familiar', icon: '🔥', rarity: 'Rare', desc: 'A playful spark elemental that lights dark dungeons and warms frozen limbs.' },
    { name: 'Spectral Hound', icon: '🐕‍🦺', rarity: 'Legendary', desc: 'The loyal phantom dog of a fallen prince, barking when enemies prepare ambushes.' },
    { name: 'Clockwork Falcon', icon: '🦅', rarity: 'Rare', desc: 'Forged from brass gears and polished glass, scouts ahead to reveal minimap rooms.' },
    { name: 'Ashen Pup', icon: '🐶', rarity: 'Uncommon', desc: 'A spirited hound pup with gray fur that gathers dropped crafting materials.' },
    { name: 'Bog Pygmy Frog', icon: '🐸', rarity: 'Uncommon', desc: 'Rides on the shoulder, periodically curing mild poison buildup.' },
    { name: 'Gloom Kitten', icon: '🐾', rarity: 'Rare', desc: 'Can enter the shadow plane briefly, bringing back rare coin purses.' },
    { name: 'Sunken Crabling', icon: '🦀', rarity: 'Common', desc: 'Snaps its tiny pincers aggressively at vermin and reinforces armor plating.' },
    { name: 'Lunar Moth', icon: '🦋', rarity: 'Rare', desc: 'Radiates a soothing glow that increases mana recovery rate by 15%.' },
    { name: 'Iron Piglet', icon: '🐗', rarity: 'Uncommon', desc: 'Roots out rare subterranean truffles and precious mineral veins.' },
    { name: 'Weeping Sprite', icon: '🧚', rarity: 'Epic', desc: 'A tiny mournful nymph that sheds tears that heal 5% HP after every parry.' },
    { name: 'Gargoyle Imp', icon: '🗿', rarity: 'Rare', desc: 'Turns to solid stone during boss attacks to block one fatal blow.' },
    { name: 'Cinder Salamander Hatchling', icon: '🦎', rarity: 'Uncommon', desc: 'Coils around weapon pommels, adding subtle fire burn to basic strikes.' },
    { name: 'Shadow Sprite', icon: '✨', rarity: 'Epic', desc: 'Whispers timing cues for perfect dodges against boss telegraphs.' },
    { name: 'Golden Scarab', icon: '🪲', rarity: 'Mythic', desc: 'An ancient relic beetle increasing all soul and coin drops by 25%.' },
    { name: 'Bone Raven', icon: '🦴', rarity: 'Rare', desc: 'Perches on the player staff, cawing when an enemy reaches low health execution threshold.' }
  ].map((c, idx) => ({
    id: `comp-${idx + 1}`,
    name: c.name,
    category: 'Companions & pets' as const,
    rarity: c.rarity as any,
    origin: 'Companion Bond',
    classification: 'Bound Companion',
    description: c.desc,
    fieldNotes: 'Equipable companion that provides passive exploration perks and combat synchronizations.',
    tags: ['Companion', 'Passive Perk', 'Loyal'],
    icon: c.icon
  })),

  // ==========================================
  // 4. NPCS & FACTIONS (24 Entries)
  // ==========================================
  ...[
    { name: 'Keeper Alistair', icon: '🧙‍♂️', origin: 'The Shrine of Embers', faction: 'The Ashen Order', desc: 'Ancient lorekeeper guarding the flame basin that sustains the mortal soul.' },
    { name: 'Lady Morwen of the Veil', icon: '🧝‍♀️', origin: 'Secluded Hermitage', faction: 'Daughters of the Eclipse', desc: 'A blind seer who can read the shifting scars of the Shadow Mark upon your flesh.' },
    { name: 'Blacksmith Vane', icon: '⚒️', origin: 'The Sunken Anvil', faction: 'Iron Syndicate', desc: 'A gruff master smith who can hammer star-metal and reforge shattered relic blades.' },
    { name: 'Archival Monk Thaddeus', icon: '📖', origin: 'Grand Scriptoria', faction: 'Keepers of the Quill', desc: 'Records every monster demise and bestows bounties for completing codex chapters.' },
    { name: 'Squire Dennis', icon: '🛡️', origin: 'Camp of the Broken Sword', faction: 'Valdor Remnants', desc: 'A frightened yet steadfast survivor hoping to restore his order’s lost honor.' },
    { name: 'Witch of the Muck', icon: '🧙‍♀️', origin: 'Bog-Wallow Hut', faction: 'Unaffiliated', desc: 'Brews illicit draughts in skull cauldrons in exchange for rare swamp roots.' },
    { name: 'Merchant Silas the Smuggler', icon: '💰', origin: 'Underground Bazaar', faction: 'Shadow Merchant Guild', desc: 'Offers forbidden grimoires and stolen imperial armaments at steep prices.' },
    { name: 'Commander Brandon', icon: '⚔️', origin: 'The Iron Redoubt', faction: 'The Silver Legion', desc: 'Holds the last fortified gate against the relentless horde of Corrupted Thralls.' },
    { name: 'The Silent Wanderer', icon: '🥷', origin: 'Crossroads of the Damned', faction: 'Umbral Pilgrims', desc: 'Communicates only through carved wooden runes and blade gestures.' },
    { name: 'Sister Beatrice', icon: '🕯️', origin: 'Sanctuary of the Sun', faction: 'Radiant Clerisy', desc: 'Offers blessing ceremonies that temporarily cleanse the Shadow Mark’s corruption.' },
    { name: 'Grave Warden Kenneth', icon: '🗝️', origin: 'Royal Crypts Entrance', faction: 'The Ossuary Guard', desc: 'Holds the iron ring of master keys that open ancient seal doors.' },
    { name: 'The Blind Astrologer', icon: '🔭', origin: 'Star-Chamber Tower', faction: 'Eclipse Watchers', desc: 'Tracks the celestial alignment that heralds the Sovereign’s awakening.' },
    { name: 'The Ashen Order', icon: '🔥', origin: 'Citadel Heart', faction: 'Major Faction', desc: 'Zealots who believe burning the continent to white ash is the only salvation.' },
    { name: 'Circle of the Eclipse', icon: '🌑', origin: 'The Void Depths', faction: 'Major Faction', desc: 'Occultists dedicated to breaking down the barrier between life and the abyss.' },
    { name: 'The Iron Syndicate', icon: '⚒️', origin: 'Under-Citadel Mines', faction: 'Major Faction', desc: 'Dwarven and human metalsmiths controlling raw star-iron deposits.' },
    { name: 'Daughters of the Veil', icon: '🧕', origin: 'Misty Glade', faction: 'Major Faction', desc: 'An elusive sisterhood practicing illusion and spiritual transference.' },
    { name: 'The Silver Legion', icon: '🛡️', origin: 'Valdor Castrum', faction: 'Major Faction', desc: 'The remnants of the imperial standing army fighting a bitter war of attrition.' },
    { name: 'Shadow Merchant Guild', icon: '🗝️', origin: 'Secret Tunnels', faction: 'Trade Faction', desc: 'Underground syndicate dealing in stolen relics and contraband.' },
    { name: 'The Radiant Clerisy', icon: '☀️', origin: 'Cathedral of Light', faction: 'Religious Order', desc: 'Priests holding fast to ancient solar hymns in the darkening world.' },
    { name: 'The Ossuary Guard', icon: '💀', origin: 'Mausoleum Gates', faction: 'Guards', desc: 'Bound by vow never to leave the tomb complexes until the last soul rests.' },
    { name: 'Apothecary Helena', icon: '🌿', origin: 'Botanical Ruins', faction: 'Herbalists', desc: 'Cultivates rare anti-toxin fungi from the damp undercroft.' },
    { name: 'Cartographer Renn', icon: '🗺️', origin: 'Surveyor Perch', faction: 'Cartographers', desc: 'Maps the ever-shifting geography warped by void storms.' },
    { name: 'Executioner Kaelen', icon: '🪓', origin: 'Scaffold Hill', faction: 'The Gallows Ward', desc: 'A remorseful headsman who teaches lethal weapon riposte techniques.' },
    { name: 'The Weeping Child', icon: '👶', origin: 'Forgotten Nursery', faction: 'Apparitions', desc: 'An innocent shade whose lullaby temporarily weakens nearby demon frenzy.' }
  ].map((n, idx) => ({
    id: `npc-${idx + 1}`,
    name: n.name,
    category: 'NPCs & factions' as const,
    rarity: (idx < 5 ? 'Epic' : idx < 12 ? 'Rare' : 'Uncommon') as any,
    origin: n.origin,
    classification: n.faction,
    description: n.desc,
    fieldNotes: 'Interacting with this individual or faction yields lore, vendor trading, reputation rewards, or story progression.',
    tags: [n.faction, 'Lore', 'Interactive NPC'],
    icon: n.icon
  })),

  // ==========================================
  // 5. LEGENDARY CAST (12 Entries)
  // ==========================================
  ...[
    { name: 'High King Aldric III', icon: '👑', origin: 'The Golden Age of Valdor', desc: 'The sovereign who forged the Seven Seals and united the fractured high realms before the great blight.' },
    { name: 'Queen Yvaine of the Night', icon: '👸', origin: 'Shadow Realm', desc: 'Consort of shadow who surrendered her heart to grant her kingdom three extra years of peace.' },
    { name: 'Sir Galahalt the Unconquered', icon: '⚔️', origin: 'The Sunken Field', desc: 'Champion who fought forty duels in the King’s name without taking a single wound.' },
    { name: 'Arch-Mage Solon', icon: '🔮', origin: 'The Astral Spire', desc: 'First mortal to catalog the 24 Umbral Stars and bind void essence into runic staves.' },
    { name: 'Lady Vivienne the Swift', icon: '🏹', origin: 'Emerald Forest', desc: 'Legendary archer whose arrows were rumored to strike down ravens beyond the horizon.' },
    { name: 'The Black Paladin Hector', icon: '🛡️', origin: 'Iron Fort', desc: 'Swore an oath so unyielding that his armor held its posture centuries after his flesh turned to ash.' },
    { name: 'Aurelia the Sun-Bearer', icon: '☀️', origin: 'High Solarium', desc: 'Empress whose prayers could dispel night and burn armies of darkness with focused solar rays.' },
    { name: 'Kaelen the Shadow Carver', icon: '🗡️', origin: 'Void Fissure', desc: 'First bearer of the Shadow Mark who mastered detonating the curse without losing sanity.' },
    { name: 'Lord Commander Varis', icon: '🦅', origin: 'Eagle Crest Peak', desc: 'General who ordered the drowning of the lower citadel to save the upper sanctum from fiends.' },
    { name: 'Mirielle the Alchemical Muse', icon: '🧪', origin: 'Grand Laboratory', desc: 'Discovered the transmutation formula of Ashen Gold and universal panaceas.' },
    { name: 'The Nameless Hermit', icon: '🧘', origin: 'Edge of the World', desc: 'A sage said to have spoken with the creator gods before the stars were placed in the sky.' },
    { name: 'Vespera Before the Fall', icon: '🌙', origin: 'Royal Observatory', desc: 'Once the most beloved scholar in the realm before her descent into the abyssal loom.' }
  ].map((l, idx) => ({
    id: `leg-${idx + 1}`,
    name: l.name,
    category: 'Legendary cast' as const,
    rarity: 'Legendary' as const,
    origin: l.origin,
    classification: 'Historical Figure',
    description: l.desc,
    fieldNotes: 'Central mythological figure whose deeds shaped the ruins, relics, and martial techniques of Valdor.',
    tags: ['Legendary', 'Lore Pillar', 'History of Valdor'],
    icon: l.icon
  })),

  // ==========================================
  // 6. QUESTLINES (20 Entries)
  // ==========================================
  ...[
    { name: 'The Awakening of the Shadow Mark', icon: '📜', origin: 'Forsaken Catacombs', desc: 'Investigate the pulsing brand on your palm and learn to harness Umbral Resonance.' },
    { name: 'Crown of Ash & Ruin', icon: '👑', origin: 'Throne Room', desc: 'Gather the three broken crest gems of the Sovereign from across the sunken reaches.' },
    { name: 'Echoes of the Weeping Gallery', icon: '👻', origin: 'Weeping Gallery', desc: 'Lay to rest the trapped souls of the drowned court ladies by burning their portraits.' },
    { name: 'The Smith’s Lost Hammer', icon: '⚒️', origin: 'The Sunken Anvil', desc: 'Recover Master Vane’s enchanted titanite hammer from the belly of a Mire Leech.' },
    { name: 'Cleansing the Sunken Shrines', icon: '💧', origin: 'Drowned Necropolis', desc: 'Purify four corrupted water fountains to unlock the gate to the lower sanctum.' },
    { name: 'A Bargain in Shadows', icon: '💰', origin: 'Underground Bazaar', desc: 'Smuggle contraband star-ore past the Silver Legion patrol.' },
    { name: 'The Starlight Astrolabe', icon: '🔭', origin: 'Star-Chamber Tower', desc: 'Align the celestial lenses to reveal the constellation of the Eclipse.' },
    { name: 'The Bone Knight’s Challenge', icon: '⚔️', origin: 'Hall of Kings', desc: 'Defeat three elite skeletal duelists in single combat without using health flasks.' },
    { name: 'Vespera’s Web of Guilt', icon: '🕸️', origin: 'The Crimson Loom', desc: 'Burn five tapestries woven with human hair to weaken Vespera’s shield barrier.' },
    { name: 'The Alchemist’s Final Draught', icon: '🧪', origin: 'Botanical Ruins', desc: 'Gather Gloom Moss, Cinder Petals, and Wyrm Bile to brew the Elixir of Immortality.' },
    { name: 'Trial of the Void Blades', icon: '🗡️', origin: 'Dojo of the Eclipse', desc: 'Execute twenty consecutive perfect parries against shadow phantoms.' },
    { name: 'The Lost Expedition', icon: '🧭', origin: 'Deep Chasm', desc: 'Find the journal pages of the survey team swallowed by the abyssal fissure.' },
    { name: 'The Bells of Mourning', icon: '🔔', origin: 'Belfry of Valdor', desc: 'Ring the iron chimes at midnight to summon the Phantom Ferryman.' },
    { name: 'Song of the Ashen Stag', icon: '🦌', origin: 'Ashmere Woods', desc: 'Follow the spectral white stag without startling it to reach the Hidden Glade.' },
    { name: 'A Mother’s Last Lullaby', icon: '🧸', origin: 'Forgotten Nursery', desc: 'Return the clockwork music box to the crying apparition in the cellar.' },
    { name: 'Extinguishing the Black Pyre', icon: '🔥', origin: 'Smoldering Bastion', desc: 'Douse the unholy flames keeping the Cinder Wights resurrected.' },
    { name: 'The Executioner’s Repentance', icon: '🪓', origin: 'Scaffold Hill', desc: 'Find and bury the heads of the twelve wrongfully condemned barons.' },
    { name: 'The Titan’s Requiem', icon: '☠️', origin: 'Ossuary of Titans', desc: 'Perform the sealing rite after shattering Gorgorath the Bone-Titan.' },
    { name: 'Reclaiming the Solar Mantle', icon: '☀️', origin: 'Sanctuary of the Sun', desc: 'Infuse the faded clerical mantle with pristine solar light.' },
    { name: 'The Sovereign’s Demise', icon: '👑', origin: 'Citadel Core', desc: 'Sever Malakor’s link to the Void and shatter the Ashen Crown forever.' }
  ].map((q, idx) => ({
    id: `quest-${idx + 1}`,
    name: q.name,
    category: 'Questlines' as const,
    rarity: (idx === 1 || idx === 8 || idx === 17 || idx === 19 ? 'Epic' : idx < 7 ? 'Rare' : 'Uncommon') as any,
    origin: q.origin,
    classification: 'Campaign Quest',
    description: q.desc,
    fieldNotes: 'Trackable narrative questline rewarding legendary equipment, stat points, and rare crafting schematics.',
    tags: ['Quest', 'Objective', 'Reward'],
    icon: q.icon
  })),

  // ==========================================
  // 7. WEAPONS (20 Entries - Usable in Loadout!)
  // ==========================================
  ...[
    { name: 'Greatsword of Valdor', icon: '🗡️', rarity: 'Rare', atk: 65, poise: 40, desc: 'The ceremonial blade of the royal knights. Slow, staggering swings with massive poise damage.' },
    { name: 'Umbral Fang Dagger', icon: '🔪', rarity: 'Rare', atk: 38, crit: 25, desc: 'Forged from solidified shadow glass. Applies double Shadow Mark stacks on critical hits.' },
    { name: 'Solar Pike of Aurelia', icon: '🔱', rarity: 'Epic', atk: 58, umbral: 15, desc: 'A gleaming spear tipped with condensed solar gold. High reach and armor penetration.' },
    { name: 'Ashen Reaper Scythe', icon: '⛏️', rarity: 'Epic', atk: 72, poise: 30, desc: 'Reaps souls with wide circular sweeps. Consumes 2 marks on heavy attacks for lifesteal.' },
    { name: 'Void-Forged Katana', icon: '⚔️', rarity: 'Legendary', atk: 80, crit: 30, desc: 'A curved single-edged blade that cuts through reality, unleashing phantom crescent waves.' },
    { name: 'Ironwood War Bow', icon: '🏹', rarity: 'Uncommon', atk: 45, crit: 15, desc: 'Fires heavy steel-tipped arrows that pierce through multiple consecutive foes.' },
    { name: 'Cinder Flail', icon: '⛓️', rarity: 'Rare', atk: 52, poise: 45, desc: 'A spiked iron ball emitting sparks. Cannot be deflected by enemy shields.' },
    { name: 'Staff of the Eclipse', icon: '🪄', rarity: 'Epic', atk: 68, umbral: 40, desc: 'Channels cosmic void energy. Boosts Umbral spell damage by 35%.' },
    { name: 'Blade of the Ashen Sovereign', icon: '👑', rarity: 'Mythic', atk: 110, poise: 60, crit: 20, desc: 'The dreaded blade of King Malakor. Ignites strikes in abyssal black flame.' },
    { name: 'Silver Rapier of the Duelist', icon: '🤺', rarity: 'Uncommon', atk: 42, crit: 22, desc: 'Incredible thrusting speed. Grants bonus critical damage immediately after a perfect parry.' },
    { name: 'Blood-Drinker Cleaver', icon: '🪓', rarity: 'Rare', atk: 60, poise: 25, desc: 'Serrated butchers cleaver that heals 6 HP per strike on bleeding foes.' },
    { name: 'Gargoyle Halberd', icon: '🪓', rarity: 'Rare', atk: 64, poise: 35, desc: 'Chiseled from cathedral gargoyle stone. Resistant to wear and heavy on poise breaks.' },
    { name: 'Bone-Crusher Maul', icon: '🔨', rarity: 'Rare', atk: 78, poise: 70, desc: 'A massive chunk of granite mounted on an iron shaft. Easily shatters bone knights.' },
    { name: 'Twin Curved Blades of Dusk', icon: '⚔️', rarity: 'Epic', atk: 55, crit: 28, desc: 'Dual scimitars allowing rapid light combo chains with seamless dodge cancels.' },
    { name: 'Star-Metal Estoc', icon: '🗡️', rarity: 'Rare', atk: 50, poise: 20, desc: 'Forged from meteorite iron. Ignores 30% of enemy natural armor plating.' },
    { name: 'Abyssal Trident', icon: '🔱', rarity: 'Epic', atk: 70, umbral: 25, desc: 'Summons geysers of black water when impaled into the ground.' },
    { name: 'Executioner’s Guillotine Blade', icon: '🪓', rarity: 'Legendary', atk: 95, poise: 55, desc: 'Massive square-tipped sword that deals triple damage to staggered targets.' },
    { name: 'Wand of Weeping Willows', icon: '🪄', rarity: 'Common', atk: 28, umbral: 10, desc: 'Apprentice casting implement carved from damp swamp wood.' },
    { name: 'Rusty Shortsword', icon: '🗡️', rarity: 'Common', atk: 22, poise: 10, desc: 'A chipped training blade found in the starter catacombs.' },
    { name: 'Obsidian Spire Greatsword', icon: '🗡️', rarity: 'Legendary', atk: 90, poise: 50, desc: 'Heavier than lead. Smashes through enemy guard with unstoppable momentum.' }
  ].map((w, idx) => ({
    id: `weap-${idx + 1}`,
    name: w.name,
    category: 'Weapons' as const,
    rarity: w.rarity as any,
    origin: 'Valdor Armory',
    classification: 'Martial Weapon',
    description: w.desc,
    fieldNotes: 'Can be equipped in the Weapon slot. Affects attack speed, poise damage, and combo cadence in combat.',
    tags: ['Weapon', 'Equipable', 'Combat Gear'],
    icon: w.icon,
    itemData: {
      slot: 'weapon',
      attackBonus: w.atk,
      poiseBonus: w.poise || 15,
      critBonus: w.crit || 10,
      umbralBonus: w.umbral || 0,
      effectDescription: w.desc
    }
  })),

  // ==========================================
  // 8. ARMOR & GEAR (16 Entries)
  // ==========================================
  ...[
    { name: 'Ashen Knight Full Plate', icon: '🛡️', rarity: 'Rare', def: 45, poise: 35, desc: 'Heavy blackened steel forged to resist dragon fire and crushing blows.' },
    { name: 'Voidstrider Shadow Mail', icon: '🥋', rarity: 'Epic', def: 32, poise: 20, desc: 'Lightweight chain interwoven with void threads. Increases dodge invulnerability frames.' },
    { name: 'Cowl of the Eclipse Seer', icon: '🧙', rarity: 'Rare', def: 20, umbral: 30, desc: 'Silk hood embroidered with astrological symbols that amplifies mana pool.' },
    { name: 'Crimson Loom Robes', icon: '👘', rarity: 'Epic', def: 28, umbral: 25, desc: 'Woven by Vespera herself. Grants 20% resistance to shadow and bleed effects.' },
    { name: 'Titan-Bone Cuirass', icon: '🦴', rarity: 'Legendary', def: 55, poise: 50, desc: 'Carved from Gorgorath’s chest plate. Makes the wearer nearly immune to flinching.' },
    { name: 'Leather Brigandine of the Marauder', icon: '🧥', rarity: 'Common', def: 18, poise: 10, desc: 'Simple hardened leather studs offering baseline protection with high agility.' },
    { name: 'Silver Legion Crest Armor', icon: '🛡️', rarity: 'Uncommon', def: 30, poise: 22, desc: 'Standard battle armor of the royal army. Balanced defense and weight.' },
    { name: 'Dusk Warden Cloak', icon: '🧣', rarity: 'Rare', def: 25, poise: 15, desc: 'Camouflages the wearer in mist, lowering enemy detection range.' },
    { name: 'Iron Golem Carapace', icon: '🪨', rarity: 'Epic', def: 60, poise: 60, desc: 'Tremendous weight drastically slows movement but absorbs devastating physical shocks.' },
    { name: 'Cleric’s Ashen Vestments', icon: '⛪', rarity: 'Uncommon', def: 22, umbral: 15, desc: 'Clean linen bleached in holy water, increasing potion healing potency by 25%.' },
    { name: 'Crown-Guard Greaves & Gauntlets', icon: '🥾', rarity: 'Rare', def: 35, poise: 25, desc: 'Reinforced gauntlets providing parry deflection stabilization.' },
    { name: 'Executioner’s Iron Mask', icon: '👺', rarity: 'Rare', def: 26, poise: 30, desc: 'Terrifying visage that demoralizes lesser fiends, reducing their attack power.' },
    { name: 'Star-Silk Tunic', icon: '👕', rarity: 'Rare', def: 24, umbral: 20, desc: 'Glistens like the night sky. Regenerates 2 mana per second during combat.' },
    { name: 'Tattered Pilgrim Rags', icon: '📜', rarity: 'Common', def: 10, poise: 5, desc: 'Worn travel garments stained with ash and road mud.' },
    { name: 'Draconic Scale Mail', icon: '🐉', rarity: 'Legendary', def: 50, poise: 40, desc: 'Resistant to fire and void breath alike, taken from the Void Drake.' },
    { name: 'Sovereign’s Eclipse Regalia', icon: '👑', rarity: 'Mythic', def: 65, poise: 55, umbral: 35, desc: 'The royal battle armor of King Malakor. Emits a dark aura damaging nearby foes.' }
  ].map((a, idx) => ({
    id: `arm-${idx + 1}`,
    name: a.name,
    category: 'Armor & gear' as const,
    rarity: a.rarity as any,
    origin: 'Valdor Foundry',
    classification: 'Protective Armor',
    description: a.desc,
    fieldNotes: 'Can be equipped in the Armor slot. Directly dictates your total damage absorption and poise resistance.',
    tags: ['Armor', 'Equipable', 'Defense'],
    icon: a.icon,
    itemData: {
      slot: 'armor',
      defenseBonus: a.def,
      poiseBonus: a.poise,
      umbralBonus: a.umbral || 0,
      effectDescription: a.desc
    }
  })),

  // ==========================================
  // 9. ACCESSORIES (16 Entries)
  // ==========================================
  ...[
    { name: 'Ring of Umbral Leech', icon: '💍', rarity: 'Rare', desc: 'Restores 4% maximum HP whenever a Shadow Mark is detonated.' },
    { name: 'Amulet of the Ashen Dawn', icon: '📿', rarity: 'Epic', desc: 'Increases light attack speed by 15% and stamina recovery by 20%.' },
    { name: 'Mark of the Forsaken Hero', icon: '🪙', rarity: 'Rare', desc: 'Grants 1 extra invulnerability frame to all dodge rolls.' },
    { name: 'Chime of the Deflector', icon: '🔔', rarity: 'Epic', desc: 'Widens the Perfect Parry timing window by 35% and increases riposte damage.' },
    { name: 'Band of the Iron Giant', icon: '💍', rarity: 'Uncommon', desc: 'Increases maximum poise by 30 points, preventing staggering.' },
    { name: 'Pendant of Black Flame', icon: '📿', rarity: 'Rare', desc: 'All Umbral spells ignite targets for 3 seconds of ongoing void burn.' },
    { name: 'Tear of Queen Yvaine', icon: '💧', rarity: 'Legendary', desc: 'Cheat death once per encounter; revives player with 30% HP upon fatal blow.' },
    { name: 'Seal of the Sovereign', icon: '👑', rarity: 'Mythic', desc: 'Allows Shadow Marks to stack up to 7 times instead of 5 for cataclysmic detonations.' },
    { name: 'Gloomstone Brooch', icon: '💎', rarity: 'Common', desc: 'Reduces shadow damage taken by 15%.' },
    { name: 'Ring of Frenzied Strikes', icon: '💍', rarity: 'Rare', desc: 'Each consecutive hit in a combo grants +5% attack speed up to +25%.' },
    { name: 'Talisman of Pure Focus', icon: '🧿', rarity: 'Uncommon', desc: 'Stamina cost for heavy cleaves reduced by 25%.' },
    { name: 'Eye of the Abyssal Wyrm', icon: '👁️', rarity: 'Epic', desc: 'Reveals enemy health bars and telegraph warnings 0.4 seconds earlier.' },
    { name: 'Lucky Gambler’s Coin', icon: '🪙', rarity: 'Uncommon', desc: 'Increases soul and gold gain by 20%.' },
    { name: 'Ring of the Deep Well', icon: '💍', rarity: 'Rare', desc: 'Increases maximum mana pool by 50 points.' },
    { name: 'Embroidered Rosary of Light', icon: '📿', rarity: 'Uncommon', desc: 'Increases radiant damage and repels minor undead vermin.' },
    { name: 'Shattered Crown Shard', icon: '👑', rarity: 'Legendary', desc: 'Umbral Resonance generates 50% faster in combat.' }
  ].map((acc, idx) => ({
    id: `acc-${idx + 1}`,
    name: acc.name,
    category: 'Accessories' as const,
    rarity: acc.rarity as any,
    origin: 'Ancient Reliquary',
    classification: 'Trinket & Relic',
    description: acc.desc,
    fieldNotes: 'Can be equipped in Relic Slot 1 or 2. Grants powerful game-changing passives.',
    tags: ['Accessory', 'Relic', 'Passive Effect'],
    icon: acc.icon,
    itemData: {
      slot: 'relic',
      effectDescription: acc.desc
    }
  })),

  // ==========================================
  // 10. CONSUMABLES (18 Entries)
  // ==========================================
  ...[
    { name: 'Ashen Estus Flask', icon: '🧪', rarity: 'Uncommon', heal: 150, desc: 'Restores 150 Health Points immediately.' },
    { name: 'Blood of the Martyr Phial', icon: '🩸', rarity: 'Rare', heal: 300, desc: 'Potent draught restoring 300 Health Points and curing bleed status.' },
    { name: 'Void-Nectar Tonic', icon: '🍷', rarity: 'Uncommon', mana: 100, desc: 'Restores 100 Mana Points for casting Umbral spells.' },
    { name: 'Elixir of Iron Poise', icon: '🥃', rarity: 'Rare', desc: 'Grants absolute stagger immunity for 12 seconds.' },
    { name: 'Flask of Liquid Lightning', icon: '⚡', rarity: 'Rare', desc: 'Coats weapon in electrical arc, adding shock damage for 20 seconds.' },
    { name: 'Purification Draught', icon: '🍵', rarity: 'Common', desc: 'Removes all poison, rot, and shadow corruption buildup.' },
    { name: 'Whetstone of Keen Edge', icon: '🪨', rarity: 'Common', desc: 'Increases critical strike chance by 15% for 30 seconds.' },
    { name: 'Smoke Bomb of the Veil', icon: '💨', rarity: 'Uncommon', desc: 'Blinds enemy for 3 seconds, granting an immediate safe window to heal or reposition.' },
    { name: 'Throwing Daggers of Valdor', icon: '🗡️', rarity: 'Common', desc: 'Packs of balanced throwing blades to interrupt distant spellcasters.' },
    { name: 'Molten Firepot', icon: '💣', rarity: 'Uncommon', desc: 'Explodes in a pool of fire, dealing 120 area damage.' },
    { name: 'Abyssal Bomb', icon: '🌑', rarity: 'Rare', desc: 'Detonates with void energy, instantly applying 3 Shadow Marks to all targets.' },
    { name: 'Soothing Marsh Balm', icon: '🧴', rarity: 'Common', heal: 80, desc: 'Mild herbal salve restoring 80 Health over 5 seconds.' },
    { name: 'Tincture of Swiftness', icon: '⚡', rarity: 'Rare', desc: 'Increases movement and attack speed by 25% for 15 seconds.' },
    { name: 'Hero’s Soul Phial', icon: '✨', rarity: 'Epic', desc: 'Instantly grants 500 bonus XP towards your next level.' },
    { name: 'Draught of the Berserker', icon: '🍶', rarity: 'Epic', desc: 'Increases damage dealt by 40% but lowers defense by 20% for 15 seconds.' },
    { name: 'Blessed Sun Water', icon: '💧', rarity: 'Uncommon', desc: 'Burns nearby undead for 100 radiant damage when smashed on the ground.' },
    { name: 'Focusing Incense', icon: '🪔', rarity: 'Common', mana: 60, desc: 'Slowly burns, regenerating 60 mana over 10 seconds.' },
    { name: 'Elixir of the Sovereign', icon: '👑', rarity: 'Mythic', heal: 500, mana: 200, desc: 'Fully restores HP, Mana, and removes all debuffs instantly.' }
  ].map((c, idx) => ({
    id: `con-${idx + 1}`,
    name: c.name,
    category: 'Consumables' as const,
    rarity: c.rarity as any,
    origin: 'Alchemical Laboratory',
    classification: 'Battle Draught',
    description: c.desc,
    fieldNotes: 'Can be slotted in Quick Slot 1 or 2 for immediate use during combat via hotkeys [1] / [2] or click.',
    tags: ['Consumable', 'Quick Item', 'Healing'],
    icon: c.icon,
    itemData: {
      slot: 'consumable',
      healAmount: c.heal,
      manaAmount: c.mana,
      effectDescription: c.desc
    }
  })),

  // ==========================================
  // 11. INGREDIENTS & MATERIALS (24 Entries)
  // ==========================================
  ...[
    { name: 'Void Shard', icon: '🟣', rarity: 'Rare', origin: 'Abyssal Fissures', desc: 'A crystalline sliver of condensed darkness vibrating with hum.' },
    { name: 'Star-Iron Ingot', icon: '🔩', rarity: 'Epic', origin: 'The Sunken Anvil', desc: 'Smelted from fallen star meteors, unbreakable and lightweight.' },
    { name: 'Gloom Moss', icon: '🌿', rarity: 'Common', origin: 'Whispering Marshes', desc: 'Damp bioluminescent moss used as a base for restorative unguents.' },
    { name: 'Dragon Bone Relic', icon: '🦴', rarity: 'Legendary', origin: 'Shattered Peak', desc: 'Pristine fossilized bone carrying primal fire essence.' },
    { name: 'Ashen Dust', icon: '🌫️', rarity: 'Common', origin: 'The Ashen Reach', desc: 'Fine powdery ash left behind by consumed souls.' },
    { name: 'Titanite Chunk', icon: '🪨', rarity: 'Uncommon', origin: 'Iron Crags', desc: 'Dense metamorphic rock essential for weapon reinforcement.' },
    { name: 'Cinder Lily Petal', icon: '🌺', rarity: 'Uncommon', origin: 'Smoldering Bastion', desc: 'A rare flower that only blooms inside volcanic vents.' },
    { name: 'Ethereal Thread', icon: '🧵', rarity: 'Rare', origin: 'Weeping Gallery', desc: 'Spun from the sorrowful thoughts of lingering court specters.' },
    { name: 'Abyssal Mercury', icon: '🧪', rarity: 'Rare', origin: 'The Subterranean Core', desc: 'Heavy silver liquid that defies gravity.' },
    { name: 'Viper Venom Sac', icon: '🫙', rarity: 'Common', origin: 'Briar Maze', desc: 'Extracted venom glands used in coating lethal rogue blades.' },
    { name: 'Petrified Heartwood', icon: '🪵', rarity: 'Uncommon', origin: 'Duskwood Thicket', desc: 'Ancient oak wood hardened into stone over millennia.' },
    { name: 'Bloodstone Fragment', icon: '🩸', rarity: 'Rare', origin: 'Crimson Altar', desc: 'Pulsing ruby crystal containing crystallized life-force.' },
    { name: 'Solar Resin', icon: '🍯', rarity: 'Uncommon', origin: 'Solarium Glade', desc: 'Golden pine sap that retains intense heat and daylight.' },
    { name: 'Silverleaf Herb', icon: '🌱', rarity: 'Common', origin: 'River Meadows', desc: 'Soothing medicinal plant loved by apothecaries.' },
    { name: 'Obsidian Carapace Plate', icon: '🛡️', rarity: 'Uncommon', origin: 'Basalt Fields', desc: 'Heat-resistant shell harvested from basalt beetles.' },
    { name: 'Ghoul Marrow', icon: '🍖', rarity: 'Common', origin: 'Catacombs', desc: 'Foul-smelling organic matter rich in dark chemical binders.' },
    { name: 'Wyrm Scale', icon: '🐉', rarity: 'Rare', origin: 'Sunken Vaults', desc: 'Flexible yet impenetrable scale that repels acid and frost.' },
    { name: 'Moonstone Pebble', icon: '🌕', rarity: 'Rare', origin: 'Lunar Spire', desc: 'Absorbs moonlight to replenish arcane enchantments.' },
    { name: 'Sulphur Brimstone', icon: '🟡', rarity: 'Common', origin: 'Sulphur Lake', desc: 'Volatile mineral powder essential for forging explosive bombs.' },
    { name: 'Ghastly Wax', icon: '🕯️', rarity: 'Uncommon', origin: 'Desecrated Chapel', desc: 'Rendered tallow used to craft everlasting sanctum candles.' },
    { name: 'Chitin Shard', icon: '🪲', rarity: 'Common', origin: 'Fungal Grotto', desc: 'Hard insect wing covers used in crafting light bucklers.' },
    { name: 'Crown Gem Fragment', icon: '💎', rarity: 'Legendary', origin: 'Royal Treasury', desc: 'One of the shattered facets from the Ashen Crown.' },
    { name: 'Black Pearl', icon: '⚫', rarity: 'Rare', origin: 'Drowned Necropolis', desc: 'Formed inside giant abyssal oysters beneath sunken crypts.' },
    { name: 'Pure Water Essence', icon: '💧', rarity: 'Uncommon', origin: 'Clearwater Brook', desc: 'Distilled mountain spring water devoid of corruption.' }
  ].map((ing, idx) => ({
    id: `mat-${idx + 1}`,
    name: ing.name,
    category: 'Ingredients & materials' as const,
    rarity: ing.rarity as any,
    origin: ing.origin,
    classification: 'Crafting Component',
    description: ing.desc,
    fieldNotes: 'Harvested from defeated bestiary enemies or foraged across the regions. Used in the Alchemy Forge to craft weapons and potions.',
    tags: ['Material', 'Reagent', 'Crafting'],
    icon: ing.icon,
    itemData: { slot: 'material' }
  })),

  // ==========================================
  // 12. CRAFTING RECIPES (18 Entries)
  // ==========================================
  ...[
    { name: 'Forge: Greatsword of Valdor', icon: '🗡️', res: 'weap-1', mats: [{ name: 'Star-Iron Ingot', count: 2 }, { name: 'Titanite Chunk', count: 3 }], desc: 'Forge the iconic royal blade from star-iron and titanite.' },
    { name: 'Forge: Umbral Fang Dagger', icon: '🔪', res: 'weap-2', mats: [{ name: 'Void Shard', count: 2 }, { name: 'Viper Venom Sac', count: 2 }], desc: 'Craft a shadow glass dagger with high critical mark potential.' },
    { name: 'Forge: Solar Pike', icon: '🔱', res: 'weap-3', mats: [{ name: 'Star-Iron Ingot', count: 2 }, { name: 'Solar Resin', count: 3 }], desc: 'Imbue spear with radiant solar light.' },
    { name: 'Forge: Ashen Reaper Scythe', icon: '⛏️', res: 'weap-4', mats: [{ name: 'Ashen Dust', count: 5 }, { name: 'Titanite Chunk', count: 4 }], desc: 'Craft the soul-reaping broad scythe.' },
    { name: 'Forge: Void-Forged Katana', icon: '⚔️', res: 'weap-5', mats: [{ name: 'Void Shard', count: 4 }, { name: 'Star-Iron Ingot', count: 3 }], desc: 'Fold void crystal into star-metal to craft an abyssal blade.' },
    { name: 'Forge: Ashen Knight Full Plate', icon: '🛡️', res: 'arm-1', mats: [{ name: 'Star-Iron Ingot', count: 4 }, { name: 'Ashen Dust', count: 6 }], desc: 'Hammer heavy interlocking plates of blackened steel.' },
    { name: 'Weave: Voidstrider Mail', icon: '🥋', res: 'arm-2', mats: [{ name: 'Ethereal Thread', count: 4 }, { name: 'Void Shard', count: 2 }], desc: 'Weave shadowy thread into light agile armor.' },
    { name: 'Carve: Titan-Bone Cuirass', icon: '🦴', res: 'arm-5', mats: [{ name: 'Dragon Bone Relic', count: 2 }, { name: 'Titanite Chunk', count: 5 }], desc: 'Chisel unbreakable bone into massive body armor.' },
    { name: 'Forge: Ring of Umbral Leech', icon: '💍', res: 'acc-1', mats: [{ name: 'Void Shard', count: 2 }, { name: 'Bloodstone Fragment', count: 1 }], desc: 'Bind dark siphon energy into an ornate finger ring.' },
    { name: 'Craft: Amulet of Ashen Dawn', icon: '📿', res: 'acc-2', mats: [{ name: 'Solar Resin', count: 2 }, { name: 'Ashen Dust', count: 4 }], desc: 'Infuse golden resin into a protective neck pendant.' },
    { name: 'Brew: Ashen Estus Flask', icon: '🧪', res: 'con-1', mats: [{ name: 'Silverleaf Herb', count: 2 }, { name: 'Pure Water Essence', count: 1 }], desc: 'Distill medicinal herb into restorative flask charge.' },
    { name: 'Brew: Blood of the Martyr', icon: '🩸', res: 'con-2', mats: [{ name: 'Bloodstone Fragment', count: 1 }, { name: 'Gloom Moss', count: 2 }], desc: 'Concentrated life-blood restoring massive health.' },
    { name: 'Brew: Void-Nectar Tonic', icon: '🍷', res: 'con-3', mats: [{ name: 'Void Shard', count: 1 }, { name: 'Moonstone Pebble', count: 1 }], desc: 'Brew an ethereal potion that restores 100 Mana.' },
    { name: 'Brew: Elixir of Iron Poise', icon: '🥃', res: 'con-4', mats: [{ name: 'Titanite Chunk', count: 2 }, { name: 'Obsidian Carapace Plate', count: 1 }], desc: 'Concoct liquid mineral draught granting stagger immunity.' },
    { name: 'Craft: Abyssal Bomb', icon: '🌑', res: 'con-11', mats: [{ name: 'Sulphur Brimstone', count: 2 }, { name: 'Void Shard', count: 2 }], desc: 'Assemble an explosive sphere that blankets enemies in Shadow Marks.' },
    { name: 'Craft: Molten Firepot', icon: '💣', res: 'con-10', mats: [{ name: 'Sulphur Brimstone', count: 2 }, { name: 'Cinder Lily Petal', count: 2 }], desc: 'Package incendiary clay pots to set foes ablaze.' },
    { name: 'Forge: Blade of the Sovereign', icon: '👑', res: 'weap-9', mats: [{ name: 'Crown Gem Fragment', count: 1 }, { name: 'Star-Iron Ingot', count: 5 }, { name: 'Void Shard', count: 5 }], desc: 'The ultimate synthesis: reforge King Malakor’s legendary blade.' },
    { name: 'Brew: Elixir of the Sovereign', icon: '👑', res: 'con-18', mats: [{ name: 'Crown Gem Fragment', count: 1 }, { name: 'Bloodstone Fragment', count: 2 }, { name: 'Pure Water Essence', count: 3 }], desc: 'The supreme panacea restoring all vitality and mana.' }
  ].map((r, idx) => ({
    id: `rec-${idx + 1}`,
    name: r.name,
    category: 'Crafting recipes' as const,
    rarity: (idx === 16 || idx === 17 ? 'Mythic' : idx > 10 ? 'Epic' : idx > 5 ? 'Rare' : 'Uncommon') as any,
    origin: 'The Sunken Anvil & Alchemical Hearth',
    classification: 'Smithing & Alchemy',
    description: r.desc,
    fieldNotes: 'Can be forged inside the Forge & Alchemy sanctum whenever required components are present in inventory.',
    tags: ['Recipe', 'Crafting', 'Forge'],
    icon: r.icon,
    recipeData: {
      resultItemId: r.res,
      materials: r.mats
    }
  })),

  // ==========================================
  // 13. SPELLS & TECHNIQUES (24 Entries)
  // ==========================================
  ...[
    { name: 'Shadow Mark Detonation', icon: '💥', school: 'Umbral Arts', mana: 30, desc: 'Consumes all active Shadow Marks on targets for catastrophic void explosion damage and heals user.' },
    { name: 'Abyssal Step', icon: '🌫️', school: 'Void Sorcery', mana: 25, desc: 'Teleport behind your targeted foe in a puff of black smoke, opening a backstab angle.' },
    { name: 'Blade of Ashen Judgment', icon: '⚔️', school: 'Royal Martial Art', mana: 40, desc: 'A soaring overhead strike that cleaves through enemy poise and deals massive stagger.' },
    { name: 'Void Barrier', icon: '🛡️', school: 'Umbral Arts', mana: 35, desc: 'Conjures a dark crystalline shield that absorbs the next incoming hit and reflects 50% damage.' },
    { name: 'Ember Wave', icon: '🔥', school: 'Pyromancy', mana: 20, desc: 'Sweeps weapon to send a rolling arc of flames, burning multiple advancing thralls.' },
    { name: 'Solar Smite', icon: '☀️', school: 'Radiant Hymns', mana: 30, desc: 'Calls down a beam of pure sunlight from the heavens, dealing quadruple damage to undead.' },
    { name: 'Dark Siphon', icon: '🩸', school: 'Blood Sorcery', mana: 15, desc: 'Drains life force from marked enemies, restoring player health over 4 seconds.' },
    { name: 'Gloom Tendrils', icon: '🐙', school: 'Void Sorcery', mana: 25, desc: 'Erupts shadowy tendrils from the ground that root enemies in place for 3 seconds.' },
    { name: 'Whirlwind Slash', icon: '🌪️', school: 'Martial Technique', mana: 15, desc: 'A rapid 360-degree spinning sword strike clearing away surround swarms.' },
    { name: 'Riposte of the Sunken King', icon: '⚡', school: 'Martial Technique', mana: 0, desc: 'Executed immediately upon a Perfect Parry to deliver a devastating cinematic critical strike.' },
    { name: 'Black Star Nova', icon: '🌑', school: 'Cosmic Sorcery', mana: 60, desc: 'Crushes a mini black hole between your palms, imploding the arena with void gravity.' },
    { name: 'Frostbite Shards', icon: '❄️', school: 'Cryomancy', mana: 20, desc: 'Hurls five piercing ice daggers that slow enemy attack animations by 30%.' },
    { name: 'Chant of Iron Will', icon: '🧘', school: 'Discipline', mana: 10, desc: 'Instantly refills 100% of maximum stamina and cleanses fatigue.' },
    { name: 'Spectral Blades', icon: '🗡️', school: 'Illusion', mana: 30, desc: 'Summons three orbiting phantom swords that automatically strike when you attack.' },
    { name: 'Poison Cloud of the Fen', icon: '☁️', school: 'Alchemy', mana: 20, desc: 'Releases a lingering caustic mist that deals continuous armor-decaying damage.' },
    { name: 'Lightning Spear of Valdor', icon: '⚡', school: 'Radiant Hymns', mana: 35, desc: 'Hurls a thunderous javelin of golden lightning that shatters stone shields.' },
    { name: 'Void Singularity', icon: '🌀', school: 'Cosmic Sorcery', mana: 50, desc: 'Pulls all enemies towards an abyssal center and applies 2 Shadow Marks.' },
    { name: 'Ashen Renewal', icon: '✨', school: 'Restoration', mana: 40, desc: 'Heals the player for 200 HP and grants 5 seconds of stamina regeneration.' },
    { name: 'Phantom Mirage', icon: '👥', school: 'Illusion', mana: 25, desc: 'Leaves a decoy afterimage upon dodging, causing enemy strikes to hit thin air.' },
    { name: 'Blood Oath Strike', icon: '🩸', school: 'Blood Sorcery', mana: 0, desc: 'Sacrifices 10% of current HP to guarantee the next melee hit is a critical strike.' },
    { name: 'Searing Cauterize', icon: '🔥', school: 'Pyromancy', mana: 15, desc: 'Burns clean all poison and bleed ailments while granting 10% bonus attack power.' },
    { name: 'Eclipse Barrage', icon: '🌘', school: 'Void Sorcery', mana: 45, desc: 'Fires seven homing dark meteors that strike random nearby targets.' },
    { name: 'Unyielding Fortress', icon: '🏰', school: 'Discipline', mana: 20, desc: 'Plants feet firmly; blocking drains 0 stamina for the next 4 seconds.' },
    { name: 'Wrath of the Ashen Crown', icon: '👑', school: 'Sovereign Arts', mana: 75, desc: 'The forbidden ultimate technique: transforms into an avatar of shadow, dealing double damage.' }
  ].map((sp, idx) => ({
    id: `spl-${idx + 1}`,
    name: sp.name,
    category: 'Spells & techniques' as const,
    rarity: (idx === 0 || idx === 10 || idx === 23 ? 'Mythic' : idx > 15 ? 'Epic' : idx > 8 ? 'Rare' : 'Uncommon') as any,
    origin: 'Grimoire of Valdor',
    classification: sp.school,
    description: sp.desc,
    fieldNotes: `Requires ${sp.mana} Mana. Can be assigned to combat hotkeys [Q], [E], or [R] for tactical spellcasting.`,
    tags: [sp.school, 'Spell', 'Active Ability'],
    icon: sp.icon
  })),

  // ==========================================
  // 14. WORLD LOCATIONS, ROADS, TOWNS & DUNGEONS (31 Entries)
  // ==========================================
  ...[
    { name: 'Valdor Citadel', icon: '🏰', region: 'The Royal Heart', desc: 'The once-gleaming white capital perched high on the cliffs, now choked in soot and black obsidian spikes.' },
    { name: 'The Ashen Reach', icon: '🌋', region: 'The Outer Wastes', desc: 'Desolate plains covered in foot-deep gray ash where hollowed pilgrims wander aimlessly.' },
    { name: 'Whispering Marshes', icon: '🌫️', region: 'Lowland Fens', desc: 'Drowned wetlands where sound carries eerily and phantom lanterns lure wanderers into deep bogs.' },
    { name: 'Forsaken Catacombs', icon: '⚰️', region: 'Under-Citadel', desc: 'Endless labyrinthine tunnels lined with thousands of ancient royal sarcophagi.' },
    { name: 'The Sunken Anvil', icon: '⚒️', region: 'Lower Forges', desc: 'Subterranean cavern where giant water-wheels once powered master dwarven bellows.' },
    { name: 'Sunken Vaults of Valdor', icon: '🏛️', region: 'Flooded District', desc: 'Grand libraries and treasury halls flooded by dark water when the sluice gates were breached.' },
    { name: 'Weeping Gallery', icon: '🖼️', region: 'Palace Wing', desc: 'High vaulted corridors lined with portraits whose painted eyes appear to track your movement.' },
    { name: 'The Crimson Loom', icon: '🕸️', region: 'Upper Spire', desc: 'The secluded chamber where Arch-Sorceress Vespera weaves reality into nightmare tapestry.' },
    { name: 'Ossuary of Titans', icon: '☠️', region: 'Deep Substrata', desc: 'A colossal burial pit housing the petrified bones of ancient giants from the Age of Fire.' },
    { name: 'Throne of the Ashen Crown', icon: '👑', region: 'Apex Sanctum', desc: 'The summit of the realm where King Malakor sits in brooding silence upon the throne of black iron.' },
    { name: 'Camp of the Broken Sword', icon: '🏕️', region: 'The High Road', desc: 'The final encampment of surviving soldiers and merchants clinging to warmth.' },
    { name: 'Crossroads of the Damned', icon: '🪧', region: 'Central Junction', desc: 'Where the four great highways of Valdor intersect beneath hanging iron cages.' },
    { name: 'The Bleak Spire', icon: '🗼', region: 'Northern Crags', desc: 'A jagged natural tower where Void Drakes nest among frozen lightning rods.' },
    { name: 'Smoldering Bastion', icon: '🔥', region: 'Eastern Border', desc: 'A fortress built inside a dormant volcano caldera, still glowing with residual magma.' },
    { name: 'Sanctuary of the Sun', icon: '☀️', region: 'Solarium Hill', desc: 'The last consecrated basilica holding back the encroaching shadow with holy braziers.' },
    { name: 'Drowned Necropolis', icon: '🌊', region: 'Sunken Coast', desc: 'Mausoleums partially submerged beneath the murky coastal waters.' },
    { name: 'Iron Crags', icon: '⛰️', region: 'Mountain Ridge', desc: 'Sheer vertical cliffs rich with star-iron veins and guarded by mountain gargoyles.' },
    { name: 'Belfry of Valdor', icon: '🔔', region: 'Cathedral Tower', desc: 'Houses the titanic mourning bell whose chime rings whenever a monarch perishes.' },
    { name: 'The Old Chimneys', icon: '🏭', region: 'Industrial Quarter', desc: 'Ancient glassworks and smelting towers abandoned during the initial outbreak.' },
    { name: 'Briar Maze', icon: '🌹', region: 'Royal Gardens', desc: 'Hedges of flesh-tearing black thorns that have overgrown the pleasure pavilions.' },
    { name: 'Clearwater Brook', icon: '🏞️', region: 'Hidden Valley', desc: 'One of the few remaining uncorrupted streams, pure enough to drink and replenish spirits.' },
    { name: 'Gallows Plain', icon: '⛓️', region: 'Execution Grounds', desc: 'A windswept plateau scattered with creaking wooden scaffolds and iron gibbets.' },
    { name: 'Basalt Fields', icon: '⬛', region: 'Volcanic Flats', desc: 'Geometric columns of volcanic basalt cracking open to reveal bubbling sulfur pools.' },
    { name: 'Roots of Valdor', icon: '🌳', region: 'The Deep Core', desc: 'Gargantuan petrified tree roots that anchor the mountain citadel to bedrock.' },
    { name: 'Cliffs of Sorrow', icon: '🌊', region: 'Western Edge', desc: 'Perpendicular sea cliffs battered by perpetual thunderstorms and dark tempests.' },
    { name: 'Resonance Caverns', icon: '🪨', region: 'Underground Soundscapes', desc: 'Caves composed of natural crystal stalactites that produce haunting melodies.' },
    { name: 'The Great Fissure', icon: '🕳️', region: 'Chasm of the Eclipse', desc: 'A miles-deep crack in the continent from which the Abyssal Fiends crawled forth.' },
    { name: 'Frostpeak Pass', icon: '❄️', region: 'Northern Divide', desc: 'Perpetually snow-covered mountain pass requiring warm furs or stamina draughts to cross.' },
    { name: 'Underground Bazaar', icon: '🎪', region: 'Sewer Junction', desc: 'A clandestine black market lit by dim torches where cutpurses and heretics barter.' },
    { name: 'Sulphur Lake', icon: '🧪', region: 'Volcanic Basin', desc: 'A steaming emerald-yellow lake with caustic vapor and acidic shores.' },
    { name: 'The Mirror Hall', icon: '🪞', region: 'Labyrinth of Reflections', desc: 'A disorienting palace wing surrounded by enchanted glass showing twisted futures.' }
  ].map((loc, idx) => ({
    id: `loc-${idx + 1}`,
    name: loc.name,
    category: 'World locations, roads, towns & dungeons' as const,
    rarity: (idx === 0 || idx === 8 || idx === 9 ? 'Mythic' : idx < 7 ? 'Epic' : idx < 16 ? 'Rare' : 'Uncommon') as any,
    origin: loc.region,
    classification: 'Exploration Zone',
    description: loc.desc,
    fieldNotes: 'Traversable realm location containing encounter chambers, resource foraging nodes, and secrets.',
    tags: [loc.region, 'Dungeon', 'Exploration', 'Valdor Geography'],
    icon: loc.icon
  }))
];

// Helper to get total counts by category
export const CODEX_CATEGORY_COUNTS = CODEX_ENTRIES.reduce((acc, entry) => {
  acc[entry.category] = (acc[entry.category] || 0) + 1;
  return acc;
}, {} as Record<string, number>);
