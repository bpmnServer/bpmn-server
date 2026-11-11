import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// BPMN Server's (owf) pages inside the HR application: /hr/workflow/<owf path> shows owf's <owf path> in a frame, with
// owf's own menu bar hidden (the sidebar has its places). The server serves both, so the frame is the same site.
// Moving inside the frame keeps the address in step, so a refresh or a shared link opens the same page.
const PREFIX = '/workflow';

const owfPath = location => (location.pathname.slice(PREFIX.length) || '/') + location.search;

export default function Workflow() {
  const location = useLocation();
  const navigate = useNavigate();
  const frame = useRef(null);
  const [src, setSrc] = useState(() => owfPath(location));
  const shown = useRef(src);
  const [missing, setMissing] = useState(false);

  // a sidebar link (or back and forward) to another owf page: the frame goes there
  useEffect(() => {
    const wanted = owfPath(location);
    if (wanted !== shown.current) {
      shown.current = wanted;
      setSrc(wanted);
    }
  }, [location]);

  function loaded() {
    let doc, at;
    try {
      doc = frame.current.contentDocument;
      at = frame.current.contentWindow.location;
    } catch {
      return; // not the same site: shown as it is
    }
    if (!doc || !at) return;
    // no owf here (npm run dev without HR_API): its address came back to these pages
    if (at.pathname.startsWith('/hr')) return setMissing(true);
    // owf's menu bar: the sidebar has its places
    const style = doc.createElement('style');
    style.textContent = 'body > header > nav.navbar { display: none !important; } body { padding-top: 0 !important; }';
    doc.head?.appendChild(style);
    // links that leave owf (to the HR pages) open in the whole window
    doc.querySelectorAll('a[href^="/hr"]').forEach(a => a.setAttribute('target', '_top'));
    const now = at.pathname + at.search;
    if (now !== shown.current) {
      shown.current = now;
      navigate(PREFIX + (now === '/' ? '' : now), { replace: true });
    }
    if (doc.title) document.title = `${doc.title} · HR System`;
  }

  if (missing)
    return (
      <div className="page-body">
        <p>The workflow pages come from BPMN Server, which is not behind these pages: start the server (npm start) and open
          it, or run npm run dev with HR_API=http://localhost:3100.</p>
      </div>
    );
  return <iframe ref={frame} className="workflow-frame" src={src} title="Workflow" onLoad={loaded} />;
}
