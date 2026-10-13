import { Link } from 'react-router-dom';
import { Gamepad2, Mail, MapPin, Phone, Wallet } from 'lucide-react';
import Logo from '../../components/Logo.jsx';

export function About() {
  return (
    <>
      <section className="relative bg-cover bg-center py-28 text-center"
        style={{ backgroundImage: "linear-gradient(rgba(0,0,26,.7), rgba(0,0,26,.9)), url('https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=2000&auto=format&fit=crop')" }}>
        <h1 className="text-5xl font-extrabold">About Excalibur</h1>
        <p className="text-xl mt-3 text-primary font-bold">Your Ultimate Hub for Digital Entertainment</p>
      </section>
      <section className="px-4 lg:px-[10%] py-14 text-center">
        <h2 className="text-3xl font-bold italic">“Discover the joy of gaming together with us.”</h2>
        <p className="max-w-2xl mx-auto mt-4 opacity-80">
          Whether on PC, consoles, or mobile, Project Excalibur is designed to support every gamer with the best products at affordable prices.
        </p>
        <div className="grid sm:grid-cols-2 gap-8 mt-12 max-w-3xl mx-auto">
          <div className="card bg-base-300 p-8 items-center">
            <Gamepad2 size={48} className="text-primary" />
            <h3 className="text-2xl font-bold mt-3">GAME</h3>
            <p className="opacity-80 mt-2">Dive into gaming with wallet-friendly deals on the latest titles</p>
          </div>
          <div className="card bg-base-300 p-8 items-center">
            <Wallet size={48} className="text-primary" />
            <h3 className="text-2xl font-bold mt-3">Top-Ups</h3>
            <p className="opacity-80 mt-2">Play more and spend less with our offer.</p>
          </div>
        </div>
      </section>
      <section className="bg-base-200 px-4 lg:px-[10%] py-14 grid md:grid-cols-[2fr_1fr] gap-10 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Who we are</h2>
          <p className="opacity-90 leading-relaxed">
            Project Excalibur was founded by a dedicated team of four students and avid gamers. What started as a shared passion has evolved
            into this platform—a fast-growing project aimed at bridging the gap between high-quality digital products and affordability.
          </p>
          <ul className="space-y-3 opacity-90">
            <li><b>For Gamers:</b> A one-stop shop for all your entertainment needs, featuring secure payments, quick support.</li>
            <li><b>For Publishers:</b> A trusted alternative distribution platform that opens up new markets while lowering operational costs.</li>
            <li><b>For Sellers:</b> A fair playing field to present offers and compete through simple management tools and automated API integration.</li>
          </ul>
          <Link to="/store" className="btn btn-primary">Visit the store</Link>
        </div>
        <div className="flex justify-center"><Logo className="max-w-xs w-full" /></div>
      </section>
    </>
  );
}

export function Contact() {
  return (
    <div className="px-4 lg:px-[10%] py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold">Get in Touch</h1>
        <p className="opacity-80 mt-2">Have a question or need help? We're here for you.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card bg-base-300 p-8 space-y-6">
          <h2 className="text-2xl font-bold">Contact Information</h2>
          <div className="flex gap-4"><MapPin className="text-primary shrink-0" />
            <div><h3 className="font-bold">Our Store Address</h3><p className="opacity-80">College of Arts, Media and Technology (CAMT)<br />Chiang Mai University (CMU)<br />Suthep Subdistrict, Mueang District, Chiang Mai 50200</p></div>
          </div>
          <div className="flex gap-4"><Mail className="text-primary shrink-0" />
            <div><h3 className="font-bold">Email Us</h3><a className="link opacity-80" href="mailto:wasinpat_yanin@cmu.ac.th">wasinpat_yanin@cmu.ac.th</a></div>
          </div>
          <div className="flex gap-4"><Phone className="text-primary shrink-0" />
            <div><h3 className="font-bold">Call Us</h3><p className="opacity-80">096-174-8554<br />Available 24/7</p></div>
          </div>
        </div>
        <iframe title="CAMT CMU map" className="w-full min-h-80 rounded-box border-0"
          src="https://maps.google.com/maps?q=CAMT%20CMU&t=&z=15&ie=UTF8&iwloc=&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="text-center py-24">
      <h1 className="text-5xl font-extrabold text-primary">404</h1>
      <p className="mt-3">This page does not exist.</p>
      <Link to="/" className="btn btn-primary mt-6">Back to home</Link>
    </div>
  );
}
