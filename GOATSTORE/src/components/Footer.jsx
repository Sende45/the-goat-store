import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* BRAND */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black italic tracking-tighter">
            GOAT<span className="text-orange-600 underline decoration-2">STORE</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Le standard de l'élite à Abidjan. Digital, Mode & Lifestyle pour les vrais GOAT.
          </p>
          <div className="flex gap-4">
            <Instagram size={20} className="text-slate-400 hover:text-orange-500 cursor-pointer transition-colors" />
            <MessageCircle size={20} className="text-slate-400 hover:text-orange-500 cursor-pointer transition-colors" />
          </div>
        </div>

        {/* NAVIGATION */}
        <div>
          <h4 className="font-bold uppercase text-xs tracking-[0.2em] mb-6 text-orange-500">Navigation</h4>
          <ul className="space-y-4 text-sm text-slate-400 font-medium">
            <li><Link to="/" className="hover:text-white transition-colors">Accueil</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact WhatsApp</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors">Mon Compte G.S</Link></li>
          </ul>
        </div>

        {/* SERVICES */}
        <div>
          <h4 className="font-bold uppercase text-xs tracking-[0.2em] mb-6 text-orange-500">Services</h4>
          <ul className="space-y-4 text-sm text-slate-400 font-medium">
            <li className="flex items-center gap-2 italic">Livraison Express Abidjan</li>
            <li className="flex items-center gap-2 italic">Authenticité Garantie</li>
            <li className="flex items-center gap-2 italic">SAV Premium</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="font-bold uppercase text-xs tracking-[0.2em] mb-6 text-orange-500">Boutique</h4>
          <ul className="space-y-4 text-sm text-slate-400 font-medium">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-orange-600 shrink-0" />
              <span>Abidjan, Côte d'Ivoire</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-orange-600 shrink-0" />
              <span>+225 07 67 79 31 20</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 text-center">
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.5em] font-bold">
          © 2026 GOATSTORE - TOUS DROITS RÉSERVÉS
        </p>
      </div>
    </footer>
  );
};

export default Footer;