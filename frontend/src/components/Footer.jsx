import { Link } from 'react-router-dom';

const SOCIAL = [
  { label: 'Facebook', href: 'https://www.facebook.com/imon.work/' },
  { label: 'Instagram', href: 'https://www.instagram.com/imon4826/' },
  { label: 'YouTube', href: 'https://youtu.be/dQw4w9WgXcQ?si=qkEoWcAznTMhQ-v1' },
  { label: 'GitHub', href: 'https://github.com/Ling4826' },
];

export default function Footer() {
  return (
    <footer className="bg-secondary mt-auto">
      <div className="footer sm:footer-horizontal px-4 lg:px-[10%] py-10">
        <aside className="max-w-sm">
          <h3 className="text-2xl font-extrabold text-primary">Excalibur</h3>
          <p className="opacity-80">
            The website for buying and selling games and games is the safest and fastest. It is a project that offers
            front-end and Basic Development and Operations subjects.
          </p>
          <div className="flex gap-3 mt-2">
            {SOCIAL.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="link link-hover text-sm">
                {s.label}
              </a>
            ))}
          </div>
        </aside>
        <nav>
          <h6 className="footer-title">Shop</h6>
          <Link to="/store" className="link link-hover">Store</Link>
          <Link to="/profile" className="link link-hover">My Account</Link>
          <Link to="/login" className="link link-hover">Login</Link>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <Link to="/about" className="link link-hover">About Us</Link>
          <Link to="/contact" className="link link-hover">Contact Us</Link>
        </nav>
      </div>
      <div className="text-center text-sm opacity-70 py-4 border-t border-white/10">Copyright © 2026 Excalibur.com</div>
    </footer>
  );
}
