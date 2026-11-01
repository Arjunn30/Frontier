
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import {
  Compass,
  Search,
  Heart,
  MapPin,
  X,
  ArrowUpRight,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import "./ExplorerMap.css";

const STORAGE_KEY = "frontier-favorites";
const FAVORITES_EVENT = "frontier-favorites-updated";

const places = [
  {
    id: "ladakh",
    name: "Ladakh",
    region: "THE NORTHERN FRONTIER",
    state: "Ladakh",
    coords: [34.15, 77.58],
    description:
      "High mountain passes, vast valleys and a wilderness unlike anywhere else.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=85",
  },
  {
    id: "manali",
    name: "Manali",
    region: "THE MOUNTAIN TRAILS",
    state: "Himachal Pradesh",
    coords: [32.24, 77.19],
    description:
      "Pine forests, winding mountain roads and snow-covered Himalayan peaks.",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=85",
  },
  {
    id: "jaipur",
    name: "Jaipur",
    region: "THE ROYAL TERRITORY",
    state: "Rajasthan",
    coords: [26.91, 75.79],
    description:
      "Ancient forts, bustling bazaars and the timeless stories of Rajasthan.",
    image:
      "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=900&q=85",
  },
  {
    id: "jaisalmer",
    name: "Jaisalmer",
    region: "THE GOLDEN DESERT",
    state: "Rajasthan",
    coords: [26.92, 70.91],
    description:
      "Golden dunes and desert horizons beneath an endless western sky.",
    image:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=900&q=85",
  },
  {
    id: "coorg",
    name: "Coorg",
    region: "THE WILD FORESTS",
    state: "Karnataka",
    coords: [12.34, 75.81],
    description:
      "Misty hills, coffee plantations and trails through lush forests.",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&q=85",
  },
  {
    id: "munnar",
    name: "Munnar",
    region: "THE EMERALD HILLS",
    state: "Kerala",
    coords: [10.09, 77.06],
    description:
      "Rolling green hills, tea estates and quiet mountain mornings.",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=900&q=85",
  },
];

function readFavorites() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

const markerIcon = L.divIcon({
  className: "frontier-marker-wrap",
  html: '<span class="frontier-map-marker"><span></span></span>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

function FlyToPlace({ selected }) {
  const map = useMap();

  useEffect(() => {
    if (selected) {
      map.flyTo(selected.coords, 8, {
        duration: 1.3,
      });
    }
  }, [selected, map]);

  return null;
}

export default function ExplorerMap() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState(readFavorites);

  // Keep map synchronized when Journal changes favorites.
  useEffect(() => {
    const syncFavorites = () => {
      setFavorites(readFavorites());
    };

    window.addEventListener(
      FAVORITES_EVENT,
      syncFavorites
    );

    window.addEventListener(
      "storage",
      syncFavorites
    );

    return () => {
      window.removeEventListener(
        FAVORITES_EVENT,
        syncFavorites
      );

      window.removeEventListener(
        "storage",
        syncFavorites
      );
    };
  }, []);

  const filteredPlaces = places.filter((place) =>
    `${place.name} ${place.state}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Update localStorage and notify Journal immediately.
  const toggleFavorite = (id) => {
    const current = readFavorites();

    const updated = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );

    setFavorites(updated);

    window.dispatchEvent(
      new Event(FAVORITES_EVENT)
    );
  };

  return (
    <section className="explorer-section" id="explorer-map">
      <div className="explorer-heading">
        <span className="explorer-eyebrow">
          CHAPTER II — THE CARTOGRAPHER'S JOURNAL
        </span>

        <h2>
          THE EXPLORER'S <span>MAP.</span>
        </h2>

        <p>
          Every mark tells a story. Choose a destination
          and discover the lands beyond the familiar roads.
        </p>
      </div>

      <div className="explorer-layout">
        <aside className="explorer-sidebar">
          <div className="explorer-sidebar-heading">
            <Compass size={25} />

            <div>
              <span>FIELD GUIDE</span>
              <h3>Discover the Territories</h3>
            </div>
          </div>

          <div className="explorer-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search territories..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="explorer-list">
            {filteredPlaces.map((place, index) => (
              <button
                type="button"
                key={place.id}
                className={`explorer-place ${
                  selected?.id === place.id
                    ? "active"
                    : ""
                }`}
                onClick={() => setSelected(place)}
              >
                <span className="explorer-place-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="explorer-place-info">
                  <strong>{place.name}</strong>
                  <small>{place.region}</small>
                </span>

                <MapPin size={17} />
              </button>
            ))}

            {filteredPlaces.length === 0 && (
              <p className="explorer-empty">
                No territories found.
              </p>
            )}
          </div>

          <div className="explorer-sidebar-bottom">
            <span>EST. 2026</span>
            <span>
              {places.length} TERRITORIES CHARTED
            </span>
          </div>
        </aside>

        <div className="explorer-map-frame">
          <div className="explorer-map-top">
            <span>
              FRONTIER CARTOGRAPHIC SOCIETY
            </span>

            <span>
              INDIAN SUBCONTINENT · 2026
            </span>
          </div>

          <MapContainer
            center={[22.5, 79]}
            zoom={5}
            minZoom={4}
            maxZoom={12}
            zoomControl={false}
            scrollWheelZoom={false}
            className="explorer-leaflet-map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
            />

            {places.map((place) => (
              <Marker
                key={place.id}
                position={place.coords}
                icon={markerIcon}
                eventHandlers={{
                  click: () => setSelected(place),
                }}
              >
                <Popup>
                  <strong>{place.name}</strong>
                  <br />
                  {place.state}
                </Popup>
              </Marker>
            ))}

            <FlyToPlace selected={selected} />

            <ZoomControl position="bottomright" />
          </MapContainer>

          <div className="explorer-map-bottom">
            <span>
              THE WORLD IS YOURS TO EXPLORE
            </span>

            <span>✦ N ✦</span>
          </div>
        </div>
      </div>

      {selected && (
        <div
          className="explorer-detail-backdrop"
          onClick={() => setSelected(null)}
        >
          <article
            className="explorer-detail"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="explorer-detail-close"
              onClick={() => setSelected(null)}
              aria-label="Close details"
            >
              <X size={20} />
            </button>

            <img
              src={selected.image}
              alt={selected.name}
              className="explorer-detail-image"
            />

            <div className="explorer-detail-content">
              <span className="explorer-detail-kicker">
                {selected.region}
              </span>

              <h3>{selected.name}</h3>

              <span className="explorer-detail-location">
                <MapPin size={15} />
                {selected.state}, India
              </span>

              <p>{selected.description}</p>

              <button
                type="button"
                className="explorer-save"
                onClick={() =>
                  toggleFavorite(selected.id)
                }
              >
                <Heart
                  size={18}
                  fill={
                    favorites.includes(selected.id)
                      ? "currentColor"
                      : "none"
                  }
                />

                {favorites.includes(selected.id)
                  ? "SAVED TO JOURNAL"
                  : "SAVE TO JOURNAL"}

                <ArrowUpRight size={16} />
              </button>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
