# War of the Worlds - Game Prototype

> A 3D browser-based vehicle combat game inspired by Jeff Wayne's War of the Worlds

Battle against Martian tripods using multiple vehicles with different capabilities in this atmospheric 3D action game built entirely in the browser.

![Game Screenshot](docs/screenshot.png)
*Screenshot placeholder - add your own gameplay image*

## 🎮 Features

### Dual Vehicle System
Control two different combat vehicles and switch between them on the fly:
- **Vehicle 1 (Machine Gun)**: Sand-colored rapid-fire vehicle - your primary assault unit
- **Vehicle 2**: Brown-colored vehicle *(Cannon variant coming soon)*

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
- **Tripod Stats**: 200 HP, requires 10 direct hits to destroy
- **Heat Ray**: 10-unit range, 5 damage/second after 1s charge
- **Visual Feedback**: White charging beam → Red active beam
- **Leg Targeting**: Hit detection on all three tripod legs
- Random enemy spawn positions each game

## 🎯 Controls

| Key | Action |
|-----|--------|
| **W/A/S/D** | Move active vehicle |
| **Mouse** | Look around |
| **SPACE** | Fire weapon |
| **1** | Switch to Vehicle 1 |
| **2** | Switch to Vehicle 2 |
| **P** | Pause/Unpause |

## 🚀 Getting Started

### Quick Play (No Installation)
1. Download `index.html`
2. Open it in your browser
3. Start playing!

### Local Development
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/war-of-worlds-game.git
cd war-of-worlds-game

# Option 1: Open directly
# Just double-click index.html

# Option 2: Use a local server (recommended)
python -m http.server 8000
# or
npx serve

# Then open http://localhost:8000
```

## 🎯 Win/Lose Conditions

**Victory** 🏆
- Destroy all 4 Martian tripods
- At least one vehicle must survive

**Defeat** ☠️
- Both vehicles destroyed
- No second chances!

## 🛠️ Technical Details

### Built With
- **Three.js (r128)** - 3D rendering engine
- **Vanilla JavaScript** - No frameworks, no build tools
- **HTML5** - Single self-contained file

### Performance
- **File Size**: ~35KB
- **Dependencies**: Three.js loaded from CDN
- **Requirements**: Any modern browser with WebGL support

### Browser Support
| Browser | Support |
|---------|---------|
| Chrome/Edge | ✅ Recommended |
| Firefox | ✅ Fully supported |
| Safari | ✅ Supported |
| Mobile | ⚠️ Playable but not optimized |

## 📊 Game Balance

| Unit | HP | Damage | Speed | Range |
|------|----|----|-------|-------|
| Player Vehicle | 100 | 20/hit | 10 units/s | Infinite |
| Martian Tripod | 200 | 5/s | 5 units/s | 10 units |

**Detection Range**: 20 units
**Projectile Speed**: 1.5 units/frame

## 🗺️ Roadmap

### Version 0.2.0 (In Progress)
- [ ] Cannon vehicle with arc projectiles
- [ ] Bonus damage for hitting tripod body (sphere)
- [ ] Differentiated vehicle models (slim/tall cannon)

### Future Versions
- [ ] Sound effects & music
- [ ] Particle effects (explosions, impacts)
- [ ] Multiple levels/waves
- [ ] Power-ups and vehicle upgrades
- [ ] Minimap
- [ ] Better tripod animations
- [ ] Mobile touch controls
- [ ] Leaderboard/scoring system

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test in multiple browsers
5. Commit (`git commit -m 'Add amazing feature'`)
6. Push (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines
- Keep everything in a single HTML file
- Test in Chrome, Firefox, and Safari
- Comment complex Three.js logic
- Update CHANGELOG.md

## 📝 Project Structure

```
war-of-worlds-game/
├── index.html          # Complete game (self-contained)
├── README.md           # You are here
├── CHANGELOG.md        # Version history
├── GIT_SETUP.md        # Git workflow instructions
└── .gitignore         # Git ignore rules
```

## 🎨 Inspiration

This project is inspired by:
- Jeff Wayne's Musical Version of The War of the Worlds
- The original War of the Worlds PSX game
- Classic arcade shooters

## 📸 Screenshots

*Coming soon - add your gameplay screenshots here!*

## 📄 License

This is a prototype/demo project. Feel free to use and modify.

## 🙏 Acknowledgments

- Jeff Wayne for the incredible musical adaptation
- H.G. Wells for the original novel
- Three.js team for the amazing 3D engine

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/war-of-worlds-game/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/war-of-worlds-game/discussions)

---

**Made with ❤️ and Three.js** | [Report Bug](https://github.com/YOUR_USERNAME/war-of-worlds-game/issues) | [Request Feature](https://github.com/YOUR_USERNAME/war-of-worlds-game/issues)

