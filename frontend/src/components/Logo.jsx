import { useState } from 'react';

/** Uses the SE262 logo image when /asset is copied in; falls back to a text logo otherwise. */
export default function Logo({ className = 'h-10' }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <span className="text-2xl font-extrabold tracking-widest text-primary">EXCALIBUR</span>;
  }
  return <img src="/asset/client/login/logo.png" alt="Excalibur" className={className} onError={() => setFailed(true)} />;
}
