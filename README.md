# War of the Worlds - Game Prototype

> A 3D browser-based vehicle combat game inspired by Jeff Wayne's War of the Worlds

Battle against Martian tripods using multiple vehicles with different capabilities in this atmospheric 3D action game built entirely in the browser.

![Game Screenshot](docs/screenshot.png)
*Screenshot placeholder - add your own gameplay image*

## Features

### Dual Vehicle System
Control two different combat vehicles and switch between them on the fly:
- **Vehicle 1 (Machine Gun)**: Sand-colored rapid-fire vehicle - your primary assault unit
- **Vehicle 2 (Cannon)**: Olive-green vehicle with an adjustable barrel that fires parabolic cannonballs

### Cannon Mechanics
The cannon introduces artillery-style gameplay:
- Adjust barrel elevation from 0° (horizontal) to 90° (vertical) using **Q/E**
- Cannonballs follow a realistic parabolic arc affected by gravity
- Higher angles = longer range but harder to aim
- Deals **50 damage** per hit (vs 20 for machine gun) with a slower fire rate
- Approximate ranges: 0° ~12 units, 30° ~44 units, 45° ~50 units (max)

### Intelligent Enemy AI
Face off against white metallic Martian tripods that:
- Detect any player-controlled vehicle within 20 units
- Chase the nearest threat
- Deploy devastating heat rays after a 1-second charge-up
- Move at half your speed (strategic kiting opportunities!)

### Individual Vehicle Management
- Each vehicle has its own **100 HP** health bar
- Lose vehicles individually without instant game over
- Auto-switch to surviving vehicle when one is destroyed
- Strategic sacrifice: use one as a decoy while attacking with the other

### Dynamic Combat
- **Tripod Stats**: 200 HP, destroyed by machine gun (10 hits) or cannon (4 hits)
- **Heat Ray**: 10-unit range, 5 damage/second after 1s charge
- **Visual Feedback**: White charging beam → Red active beam
- **Leg Targeting**: Hit detection on all three tripod legs
- Random enemy spawn positions each game

## Controls

| Key | Action |
|-----|--------|
| **W/A/S/D** | Move active vehicle |
| **Mouse** | Look around |
| **SPACE** | Fire weapon |
| **Q** | Lower cannon barrel |
| **E** | Raise cannon barrel |
| **1** | Switch to Vehicle 1 (Machine Gun) |
| **2** | Switch to Vehicle 2 (Cannon) |
| **P** | Pause/Unpause |

## Getting Started

### Local Development
The game uses ES modules, so a local server is required:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/war-of-worlds-game.git
cd war-of-worlds-game

# Use a local server (required for ES modules)
python -m http.server 8000
# or
npx serve

# Then open http://localhost:8000
```

## Win/Lose Conditions

**Victory**
- Destroy all 4 Martian tripods
- At least one vehicle must survive

**Defeat**
- Both vehicles destroyed
- No second chances!

## Technical Details

### Built With
- **Three.js (r160)** - 3D rendering engine
- **Vanilla JavaScript** - ES modules, no frameworks, no build tools
- **HTML5/CSS3** - Modular file structure

### Browser Support
| Browser | Support |
|---------|---------|
| Chrome/Edge | Recommended |
| Firefox | Fully supported |
| Safari | Supported |
| Mobile | Playable but not optimized |

## Game Balance

| Unit | HP | Damage | Speed | Fire Rate | Range |
|------|----|--------|-------|-----------|-------|
| Machine Gun Vehicle | 100 | 20/hit | 10 units/s | 200ms | Infinite (flat) |
| Cannon Vehicle | 100 | 50/hit | 10 units/s | 1500ms | ~50 units (arc) |
| Martian Tripod | 200 | 5/s | 5 units/s | Continuous | 10 units |

**Detection Range**: 20 units
**Projectile Speed**: 1.5 units/frame
**Cannon Gravity**: 0.03 units/frame²

## Roadmap

### Version 0.2.0 (In Progress)
- [x] Cannon vehicle with arc projectiles
- [x] Modular file architecture (ES modules)
- [x] Machine gun sound effect
- [ ] Cannon sound effect
- [ ] Bonus damage for hitting tripod body (sphere)

### Future Versions
- [ ] Particle effects (explosions, impacts)
- [ ] Multiple levels/waves
- [ ] Power-ups and vehicle upgrades
- [ ] Minimap
- [ ] Better tripod animations
- [ ] Mobile touch controls
- [ ] Leaderboard/scoring system

## Project Structure

```
WOTW-Game/
├── index.html              # HTML structure + Three.js importmap
├── css/
│   └── style.css           # All UI styles
├── js/
│   ├── main.js             # Entry point, game loop, camera
│   ├── state.js            # Shared game state
│   ├── scene.js            # Three.js scene setup
│   ├── vehicles.js         # Vehicle creation and damage
│   ├── tripods.js          # Enemy tripod AI and spawning
│   ├── combat.js           # Shooting, projectiles, heat ray
│   ├── input.js            # Keyboard/mouse handling
│   └── ui.js               # DOM UI updates
├── assets/
│   └── sounds/
│       └── machine-gun-shot.mp3
├── README.md
├── CONTRIBUTING.md
└── .gitignore
```

## Inspiration

This project is inspired by:
- Jeff Wayne's Musical Version of The War of the Worlds
- The original War of the Worlds PSX game
- Classic arcade shooters

## License

This is a prototype/demo project. Feel free to use and modify.

## Acknowledgments

- Jeff Wayne for the incredible musical adaptation
- H.G. Wells for the original novel
- Three.js team for the amazing 3D engine

---

**Made with Three.js** | [Report Bug](https://github.com/YOUR_USERNAME/war-of-worlds-game/issues) | [Request Feature](https://github.com/YOUR_USERNAME/war-of-worlds-game/issues)
