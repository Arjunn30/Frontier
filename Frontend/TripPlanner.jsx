import { useEffect, useState } from "react";
import { Compass, Plus, Trash2, Save, MapPin, CalendarDays, Wallet } from "lucide-react";
import "./TripPlanner.css";
const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000" : "");
const defaultTrip = { destination: "Manali", days: 5, budget: 10000, activities: ["Mall Road", "Solang Valley", "Atal Tunnel", "Sissu", "Local sightseeing"] };

export default function TripPlanner() {
  const [destination, setDestination] = useState(defaultTrip.destination);
  const [days, setDays] = useState(defaultTrip.days);
  const [budget, setBudget] = useState(defaultTrip.budget);
  const [activities, setActivities] = useState(defaultTrip.activities);
  const [activity, setActivity] = useState("");
  const [trips, setTrips] = useState([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadTrips() {
    try {
      const res = await fetch(`${API}/api/trips`);
      if (!res.ok) throw new Error();
      setTrips(await res.json());
      setMessage("");
    } catch {
      setMessage("Backend not connected. Start the server on port 5000 to save trips.");
    }
  }

  useEffect(() => { loadTrips(); }, []);

  function addActivity(e) {
    e.preventDefault();
    const name = activity.trim();
    if (name && activities.length < 20) setActivities([...activities, name]);
    setActivity("");
  }

  async function saveTrip(e) {
    e.preventDefault();
    if (!destination.trim() || Number(days) < 1 || Number(days) > 30 || Number(budget) < 0) {
      setMessage("Enter a destination, 1–30 days and a valid budget.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination: destination.trim(), days: Number(days), budget: Number(budget), activities })
      });
      if (!res.ok) throw new Error();
      await loadTrips();
      setMessage("Expedition saved successfully!");
    } catch { setMessage("Couldn't save. Check that the backend and MongoDB are running."); }
    finally { setSaving(false); }
  }

  async function deleteTrip(id) {
    if (!window.confirm("Delete this expedition?")) return;
    try {
      const res = await fetch(`${API}/api/trips/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      await loadTrips();
      setMessage("Expedition deleted.");
    } catch { setMessage("Couldn't delete expedition. Check backend connection."); }
  }

  return (
    <section className="tp-section" id="trip-planner">
      <div className="tp-shell">
        <div className="tp-heading"><span className="tp-eyebrow">CHAPTER IV — THE NEXT ADVENTURE</span><h2>PLAN YOUR <em>EXPEDITION</em></h2><p>Every great journey begins with a plan. Chart your own trail.</p></div>
        <div className="tp-layout">
          <form className="tp-card" onSubmit={saveTrip}>
            <div className="tp-card-title"><Compass size={22} /><h3>NEW EXPEDITION</h3></div>
            <label className="tp-label" htmlFor="tp-destination"><MapPin size={15}/> DESTINATION</label>
            <input id="tp-destination" maxLength={90} required value={destination} onChange={e=>setDestination(e.target.value)} placeholder="Where to, explorer?" />
            <div className="tp-fields">
              <div><label className="tp-label" htmlFor="tp-days"><CalendarDays size={15}/> DAYS</label><input id="tp-days" type="number" min="1" max="30" required value={days} onChange={e=>setDays(e.target.value)}/></div>
              <div><label className="tp-label" htmlFor="tp-budget"><Wallet size={15}/> BUDGET (₹)</label><input id="tp-budget" type="number" min="0" max="100000000" required value={budget} onChange={e=>setBudget(e.target.value)}/></div>
            </div>
            <label className="tp-label" htmlFor="tp-activity">YOUR TRAIL / ACTIVITIES</label>
            <div className="tp-add"><input id="tp-activity" maxLength={100} value={activity} onChange={e=>setActivity(e.target.value)} placeholder="Add a place or activity"/><button type="button" onClick={addActivity} aria-label="Add activity"><Plus size={19}/></button></div>
            <div className="tp-activities">{activities.map((item,i)=><span className="tp-chip" key={`${item}-${i}`}>{item}<button type="button" aria-label={`Remove ${item}`} onClick={()=>setActivities(activities.filter((_,j)=>i!==j))}>×</button></span>)}</div>
            <button className="tp-save" disabled={saving} type="submit"><Save size={17}/>{saving ? "SAVING..." : "SAVE EXPEDITION"}</button>
          </form>
          <div className="tp-card tp-saved"><div className="tp-card-title"><Compass size={22}/><h3>YOUR EXPEDITIONS</h3><span className="tp-count">{trips.length}</span></div>
            {trips.length===0 ? <div className="tp-empty">No expeditions saved yet.<span>Your next story starts here.</span></div> : <div className="tp-trip-list">{trips.map(trip=><article className="tp-trip" key={trip._id}><div className="tp-trip-top"><h4>{trip.destination}</h4><button type="button" onClick={()=>deleteTrip(trip._id)} aria-label={`Delete ${trip.destination}`}><Trash2 size={17}/></button></div><div className="tp-trip-meta"><span>{trip.days} DAYS</span><span>₹{Number(trip.budget).toLocaleString("en-IN")}</span></div>{trip.activities?.length>0&&<p>{trip.activities.join(" · ")}</p>}</article>)}</div>}
          </div>
        </div>
        {message && <p className="tp-message" role="status">{message}</p>}
      </div>
    </section>
  );
}
