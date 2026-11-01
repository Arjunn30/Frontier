
import { useState } from "react";
import { motion } from "framer-motion";
import ExplorerMap from "./ExplorerMap";
import ExplorerJournal from "./ExplorerJournal";
import { WantedPoster, ArthurJournal } from "./ArthurLegacy";
import TripPlanner from "./TripPlanner";
import {
  ArrowUpRight,
  ArrowRight,
  Compass,
  Map,
  BookOpen,
  Menu,
  X,
  Mountain,
  ExternalLink,
  Camera,
} from "lucide-react";
import "./App.css";

const destinations = [
  {
    id: 1,
    number: "01",
    name: "The Himalayan Frontier",
    location: "LADAKH, INDIA",
    description: "Where the mountains touch the sky.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85",
    category: "MOUNTAINS",
  },
  {
    id: 2,
    number: "02",
    name: "Into the Wilderness",
    location: "COORG, INDIA",
    description: "Find yourself where the roads disappear.",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=85",
    category: "FORESTS",
  },
  {
    id: 3,
    number: "03",
    name: "The Golden Sands",
    location: "JAISALMER, INDIA",
    description: "Every grain of sand holds a story.",
    image:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=85",
    category: "DESERTS",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0 },
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site">
      <header className="navbar">
        <a className="brand" href="#home" onClick={closeMenu}>
          <Compass size={24} strokeWidth={1.5} />
          <span>FRONTIER</span>
        </a>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a href="#home" onClick={closeMenu}>HOME</a>
          <a href="#explore" onClick={closeMenu}>EXPLORE</a>
          <a href="#explorer-map" onClick={closeMenu}>THE MAP</a>
          <a href="#explorer-journal" onClick={closeMenu}>JOURNAL</a>
     
          <a className="nav-cta" href="#explore" onClick={closeMenu}>
            BEGIN JOURNEY <ArrowUpRight size={15} />
          </a>
        </nav>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-image" />
          <div className="hero-shade" />

          <motion.div
            className="hero-content"
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.15 }}
          >
            <motion.div className="eyebrow" variants={fadeUp}>
              <span className="eyebrow-line" />
              AN EXPLORER'S JOURNAL
              <span className="eyebrow-line" />
            </motion.div>

            <motion.p className="hero-pretitle" variants={fadeUp}>
              THERE'S A WHOLE WORLD OUT THERE
            </motion.p>

            <motion.h1 variants={fadeUp}>
              THE WORLD
              <br />
              <em>IS YOURS.</em>
            </motion.h1>

            <motion.p className="hero-description" variants={fadeUp}>
              Beyond the familiar roads lie untold stories,
              forgotten trails, and places worth getting lost in.
            </motion.p>

            <motion.a
              variants={fadeUp}
              className="primary-button"
              href="#explore"
            >
              EXPLORE THE FRONTIER
              <ArrowUpRight size={18} />
            </motion.a>
          </motion.div>

          <div className="hero-bottom">
            <span>EST. MMXXVI — THE JOURNEY BEGINS</span>
            <a href="#intro">
              SCROLL TO DISCOVER <span className="scroll-line" />
            </a>
            <span>28° NORTH / 77° EAST</span>
          </div>

          <div className="hero-side-label">FOR THOSE WHO WANDER</div>
        </section>

        <section className="intro-section" id="intro">
          <motion.div
            className="intro-inner"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ staggerChildren: 0.15 }}
          >
            <motion.div className="section-kicker" variants={fadeUp}>
              <span>✦</span> A CALL TO THE WILD <span>✦</span>
            </motion.div>

            <motion.h2 variants={fadeUp}>
              SOME ROADS ARE
              <br />
              <em>MEANT TO BE TAKEN.</em>
            </motion.h2>

            <motion.p variants={fadeUp}>
              We believe the finest stories aren't found in books.
              They're written on mountain trails, carried by desert
              winds, and discovered beyond the last familiar road.
              This is your invitation to find them.
            </motion.p>

            <motion.div className="intro-symbol" variants={fadeUp}>
              <Compass size={34} strokeWidth={1} />
            </motion.div>
          </motion.div>
        </section>

        <section className="destinations-section" id="explore">
          <div className="section-heading">
            <div>
              <p className="section-kicker">CHAPTER I — DISCOVER</p>
              <h2>
                THE GREAT <em>UNKNOWN.</em>
              </h2>
            </div>
            <p className="section-heading-copy">
              The world is wide. The trails are endless.
              Choose where your story begins.
            </p>
          </div>

          <div className="destination-grid">
            {destinations.map((place, index) => (
              <motion.article
                className="destination-card"
                key={place.id}
                initial={{ opacity: 0, y: 45 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.65, delay: index * 0.12 }}
              >
                <div className="destination-image-wrap">
                  <img
                    src={place.image}
                    alt={place.name}
                    loading="lazy"
                  />
                  <span className="card-number">{place.number}</span>
                  <span className="card-category">{place.category}</span>
                </div>

                <div className="destination-info">
                  <span className="destination-location">
                    {place.location}
                  </span>
                  <h3>{place.name}</h3>
                  <p>{place.description}</p>
                  <a href="#map">
                    DISCOVER MORE <ArrowUpRight size={17} />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="quote-section">
          <div className="quote-overlay" />
          <motion.div
            className="quote-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.15 }}
          >
            <motion.span className="section-kicker" variants={fadeUp}>
              WORDS FROM THE WILDERNESS
            </motion.span>
            <motion.h2 variants={fadeUp}>
              "NOT ALL THOSE WHO
              <br />
              WANDER ARE LOST."
            </motion.h2>
            <motion.span className="quote-author" variants={fadeUp}>
              — J. R. R. TOLKIEN
            </motion.span>
          </motion.div>
        </section>
        <ExplorerMap />
        <TripPlanner />
        <WantedPoster />
        <ExplorerJournal />
        <ArthurJournal />

        <section className="features-section" id="map">
          <div className="section-heading">
            <div>
              <p className="section-kicker">CHAPTER II — THE JOURNEY</p>
              <h2>
                MAKE YOUR <em>MARK.</em>
              </h2>
            </div>
          </div>

          <div className="feature-grid">
            <div className="feature">
              <Map size={32} strokeWidth={1.3} />
              <span className="feature-number">I.</span>
              <h3>THE EXPLORER'S MAP</h3>
              <p>
                Discover remarkable places across India.
                Every destination has a story waiting to unfold.
              </p>
              <span className="coming-soon">COMING IN CHAPTER II</span>
            </div>

            <div className="feature" id="journal">
              <BookOpen size={32} strokeWidth={1.3} />
              <span className="feature-number">II.</span>
              <h3>YOUR TRAVEL JOURNAL</h3>
              <p>
                Record the moments that matter. Keep your
                memories, discoveries, and adventures together.
              </p>
              <span className="coming-soon">COMING IN CHAPTER III</span>
            </div>

            <div className="feature">
              <Mountain size={32} strokeWidth={1.3} />
              <span className="feature-number">III.</span>
              <h3>PLAN YOUR EXPEDITION</h3>
              <p>
                Chart your own course. Build itineraries
                and prepare for your next great adventure.
              </p>
              <span className="coming-soon">COMING IN CHAPTER III</span>
            </div>
          </div>
        </section>

        <section className="closing-section">
          <span className="section-kicker">YOUR STORY AWAITS</span>
          <h2>
            THE ROAD
            <br />
            <em>GOES ON.</em>
          </h2>
          <p>There's always another horizon.</p>
          <a href="#explore" className="primary-button">
            BEGIN YOUR JOURNEY <ArrowRight size={18} />
          </a>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <Compass size={26} strokeWidth={1.3} />
            <span>FRONTIER</span>
          </div>

          <p>
            MADE FOR THE WANDERERS, THE DREAMERS, THE EXPLORERS.
          </p>

          <div className="footer-socials">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <ExternalLink size={19} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <Camera size={19} />
            </a>
          </div>
        </div>

        <div className="creator-watermark">
          <span className="creator-label">
            A FRONTIER EXPERIENCE
          </span>

          <span className="creator-signature">
            Arjun Shukla
          </span>

          <span className="creator-credit">
            CREATED BY · EST. 2026
          </span>
        </div>

        <div className="footer-bottom">
          <span>© 2026 FRONTIER. ALL RIGHTS RESERVED.</span>
          <span>BUILT FOR THE LOVE OF EXPLORATION.</span>
          <a href="#home">BACK TO TOP ↑</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
