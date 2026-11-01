# Ruins of Valdor — Chronicles of the Ashen Crown

## World Codex expansion

The game now includes a searchable, rarity-filterable in-game archive. Open it from the title screen or battle toolbar; press **J** during play or **Escape** to close it.

The archive combines the original XML enemies with new authored entries:

| Category | Entries |
|---|---:|
| Bestiary | 50 (38 original + 12 new combat-ready XML entries) |
| Wildlife | 20 |
| Companions & pets | 16 |
| NPCs & factions | 24 |
| Legendary cast | 12 |
| Questlines | 20 |
| Weapons | 20 |
| Armor & gear | 16 |
| Accessories | 16 |
| Consumables | 18 |
| Ingredients & materials | 24 |
| Crafting recipes | 18 |
| Spells & techniques | 24 |
| World locations, roads, towns & dungeons | 31 |
| **Total** | **309** |

Each entry includes a name, icon, rarity, origin, classification, description, and searchable tags. Existing monster entries also show live XML stats such as HP, attack, and XP reward.

## Visual refresh

- Added an archive-style codex with responsive category navigation, search, rarity filtering, selected-entry field notes, and category counters.
- Added layered atmospheric gradients, restrained gold/ember accents, improved glass-and-metal surfaces, and a larger monster showcase stage.
- Bundled the existing dungeon backdrop through Vite asset imports so production builds can resolve it correctly.
- Added Escape-to-close and visible focus states for keyboard navigation.

## Integration boundaries

The original combat flow and C++ API contract are unchanged. The new NPCs, questlines, wildlife, pets, locations, and item catalog are currently **lore/index content** in the codex, not yet full gameplay systems. They do not automatically spawn, equip, craft, or become quest objectives. All 12 new bestiary entries have been added to `public/enemies.xml` and `frontend/enemies.xml`, so they are available to the existing XML-driven combat encounter loader. Their abilities use the existing C++ combat engine ability set.

## Run locally

```bash
npm install
npm run dev
```

The project still expects a C++17 toolchain, SQLite development libraries, and the dependencies listed in `package.json` for a full backend run.
