import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ScrollText, X } from "lucide-react";
import "./ArthurLegacy.css";

function SecretModal({ open, onClose, children, titleId }) {
  const closeRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const dialog = closeRef.current?.closest('[role="dialog"]');
        const focusables = dialog?.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (!focusables?.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="al-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
          <motion.div className="al-modal-paper" role="dialog" aria-modal="true" aria-labelledby={titleId} initial={{ opacity: 0, scale: 0.94, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 24 }} transition={{ duration: 0.25 }}>
            <button ref={closeRef} className="al-modal-close" onClick={onClose} type="button" aria-label="Close"><X size={22} /></button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function WantedPoster() {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  return (
    <>
      <div className="al-poster-widget">
        <button className="al-wanted-trigger" type="button" onClick={() => setOpen(true)}>
          <ScrollText size={20} /><span>AN OLD WANTED NOTICE</span><span className="al-trigger-arrow">↗</span>
        </button>
      </div>
      <SecretModal open={open} onClose={() => setOpen(false)} titleId={titleId}>
        <div className="al-wanted-content">
          <div className="al-wanted-top">UNITED STATES OF AMERICA</div>
          <h2 id={titleId} className="al-wanted-heading">WANTED</h2>
          <div className="al-wanted-stars">★ &nbsp; ★ &nbsp; ★</div>
          <div className="al-wanted-portrait">
            <img
              className="al-wanted-image"
              src="https://upload.wikimedia.org/wikipedia/commons/4/45/Croquis_arthur_morgan.png"
              alt="Arthur Morgan pencil portrait"
              referrerPolicy="no-referrer"
              onError={(event) => {
                const image = event.currentTarget;
                if (image.dataset.fallback !== "tried") {
                  image.dataset.fallback = "tried";
                  image.src = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Croquis_arthur_morgan.png";
                } else {
                  image.style.display = "none";
                  image.parentElement?.classList.add("al-image-unavailable");
                }
              }}
            />
            <span className="al-image-fallback">Portrait unavailable — check image connection</span>
          </div>
          <h3>ARTHUR MORGAN</h3>
          <p className="al-wanted-subtitle">MEMBER OF THE VAN DER LINDE GANG</p>
          <div className="al-wanted-divider">✦</div>
          <p className="al-wanted-description">LAST SEEN RIDING WEST.<br />KNOWN TO TRAVEL THROUGH<br />THE WILDERNESS.</p>
          <div className="al-wanted-status">DEAD OR ALIVE</div>
          <p className="al-wanted-footer">A RED DEAD REDEMPTION 2 EASTER EGG</p>
        </div>
      </SecretModal>
    </>
  );
}

export function ArthurJournal() {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  return (
    <>
      <div className="al-journal-widget">
        <div className="al-journal-widget-icon"><BookOpen size={26} /></div>
        <div className="al-journal-widget-info">
          <span>DISCOVERED PAGE · 1899</span>
          <h3>A Note From an Old Outlaw</h3>
          <p>Some stories are never written on a map.</p>
        </div>
        <button className="al-journal-open" type="button" onClick={() => setOpen(true)}>READ ENTRY ↗</button>
      </div>
      <SecretModal open={open} onClose={() => setOpen(false)} titleId={titleId}>
        <div className="al-journal-content">
          <span className="al-journal-date">AN ENTRY FROM THE OLD WEST</span>
          <h2 id={titleId}>The Roads We Leave Behind</h2>
          <div className="al-journal-ornament">✦</div>
          <p>The world keeps moving, whether we are ready for it or not.</p>
          <p>There are still mountains to cross, roads to discover, and quiet places where a person might find some peace.</p>
          <p>Maybe the best thing we can do is keep riding, and remember the places that made us who we are.</p>
          <div className="al-journal-signature">— A tribute to Arthur Morgan</div>
          <div className="al-journal-footnote">ORIGINAL TRIBUTE TEXT · NOT GAME DIALOGUE</div>
        </div>
      </SecretModal>
    </>
  );
}
