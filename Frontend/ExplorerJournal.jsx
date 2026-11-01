
import { useEffect, useState } from "react";
import {
  BookOpen,
  Heart,
  MapPin,
  Trash2,
  Save,
  Compass,
} from "lucide-react";
import "./ExplorerJournal.css";

const destinations = [
  { id: "ladakh", name: "Ladakh", region: "The Northern Frontier" },
  { id: "manali", name: "Manali", region: "The Mountain Trails" },
  { id: "jaipur", name: "Jaipur", region: "The Royal Territory" },
  { id: "jaisalmer", name: "Jaisalmer", region: "The Golden Desert" },
  { id: "coorg", name: "Coorg", region: "The Wild Forests" },
  { id: "munnar", name: "Munnar", region: "The Emerald Hills" },
];

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

export default function ExplorerJournal() {
  const [favorites, setFavorites] = useState(() =>
    readStorage("frontier-favorites", [])
  );

  const [entries, setEntries] = useState(() =>
    readStorage("frontier-journal-entries", {})
  );

  const [activeId, setActiveId] = useState(null);
  const [draftNote, setDraftNote] = useState("");
  const [draftStatus, setDraftStatus] = useState("want-to-visit");
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const syncFavorites = () => {
      setFavorites(readStorage("frontier-favorites", []));
    };

    window.addEventListener("frontier-favorites-updated", syncFavorites);
    window.addEventListener("storage", syncFavorites);

    return () => {
      window.removeEventListener("frontier-favorites-updated", syncFavorites);
      window.removeEventListener("storage", syncFavorites);
    };
  }, []);

  const savedPlaces = destinations.filter((place) =>
    favorites.includes(place.id)
  );

  const activePlace = savedPlaces.find(
    (place) => place.id === activeId
  );

  const openEntry = (place) => {
    const entry = entries[place.id] || {};

    setActiveId(place.id);
    setDraftNote(entry.note || "");
    setDraftStatus(entry.status || "want-to-visit");
    setSavedMessage("");
  };

  const saveEntry = () => {
    if (!activeId) return;

    const updated = {
      ...entries,
      [activeId]: {
        note: draftNote,
        status: draftStatus,
        updatedAt: new Date().toISOString(),
      },
    };

    setEntries(updated);
    localStorage.setItem(
      "frontier-journal-entries",
      JSON.stringify(updated)
    );
    setSavedMessage("ENTRY SAVED SUCCESSFULLY");
  };

  const removeFavorite = (id) => {
    const updated = favorites.filter((item) => item !== id);

    setFavorites(updated);
    localStorage.setItem(
      "frontier-favorites",
      JSON.stringify(updated)
    );
    window.dispatchEvent(
      new Event("frontier-favorites-updated")
    );

    if (activeId === id) {
      setActiveId(null);
    }
  };

  return (
    <section className="journal-section" id="explorer-journal">
      <div className="journal-heading">
        <span>CHAPTER III — THE PERSONAL CHRONICLES</span>
        <h2>
          THE EXPLORER'S <em>JOURNAL.</em>
        </h2>
        <p>
          Every journey deserves to be remembered.
          Write your stories. Mark the places that call you.
        </p>
      </div>

      <div className="journal-book">
        <div className="journal-book-top">
          <span>FRONTIER FIELD NOTES</span>
          <Compass size={22} strokeWidth={1.3} />
          <span>EST. MMXXVI</span>
        </div>

        <div className="journal-book-body">
          <aside className="journal-index">
            <div className="journal-index-heading">
              <BookOpen size={25} />
              <div>
                <small>PERSONAL RECORDS</small>
                <h3>My Destinations</h3>
              </div>
            </div>

            {savedPlaces.length === 0 ? (
              <div className="journal-empty">
                <Heart size={27} strokeWidth={1.3} />
                <p>No destinations saved yet.</p>
                <a href="#explorer-map">
                  EXPLORE THE MAP
                </a>
              </div>
            ) : (
              <div className="journal-destinations">
                {savedPlaces.map((place, index) => (
                  <div
                    className={`journal-destination ${
                      activeId === place.id ? "active" : ""
                    }`}
                    key={place.id}
                  >
                    <button
                      className="journal-destination-open"
                      onClick={() => openEntry(place)}
                      type="button"
                    >
                      <span>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <strong>{place.name}</strong>
                    </button>

                    <button
                      className="journal-remove"
                      type="button"
                      title="Remove from journal"
                      aria-label={`Remove ${place.name}`}
                      onClick={() => removeFavorite(place.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="journal-index-footer">
              {savedPlaces.length} LOCATIONS RECORDED
            </div>
          </aside>

          <div className="journal-page">
            {activePlace ? (
              <>
                <div className="journal-page-heading">
                  <span>FIELD ENTRY — {activePlace.region}</span>
                  <h3>{activePlace.name}</h3>
                  <p>
                    <MapPin size={15} />
                    INDIA
                  </p>
                </div>

                <label className="journal-field-label">
                  TRAVEL STATUS
                </label>

                <div className="journal-status-options">
                  <button
                    type="button"
                    className={
                      draftStatus === "want-to-visit"
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      setDraftStatus("want-to-visit")
                    }
                  >
                    WANT TO VISIT
                  </button>

                  <button
                    type="button"
                    className={
                      draftStatus === "visited"
                        ? "selected"
                        : ""
                    }
                    onClick={() => setDraftStatus("visited")}
                  >
                    VISITED
                  </button>
                </div>

                <label
                  htmlFor="journal-note"
                  className="journal-field-label"
                >
                  MY FIELD NOTES
                </label>

                <textarea
                  id="journal-note"
                  className="journal-notes"
                  value={draftNote}
                  onChange={(event) => {
                    setDraftNote(event.target.value);
                    setSavedMessage("");
                  }}
                  placeholder="Write about the roads you wish to travel, the places you have seen, and the memories worth keeping..."
                />

                <button
                  type="button"
                  className="journal-save-button"
                  onClick={saveEntry}
                >
                  <Save size={17} />
                  SAVE JOURNAL ENTRY
                </button>

                {savedMessage && (
                  <p className="journal-saved-message" role="status">
                    {savedMessage}
                  </p>
                )}
              </>
            ) : (
              <div className="journal-welcome">
                <Compass size={54} strokeWidth={0.9} />
                <span>THE STORY IS YOURS TO WRITE</span>
                <h3>Every Road Has a Story.</h3>
                <p>
                  Select a saved destination to begin writing
                  your own chapter.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="journal-book-bottom">
          <span>THE EXPLORER'S ARCHIVE</span>
          <span>CURATED BY ARJUN SHUKLA</span>
        </div>
      </div>
    </section>
  );
}
