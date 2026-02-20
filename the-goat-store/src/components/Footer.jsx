import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, MapPin, Phone, ArrowUpRight, ShieldCheck, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F172A] text-white pt-24 pb-12 relative overflow-hidden">
      {/* Accent visuel en arrière-plan */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          
          {/* COLONNE 1 : BRAND & VISION (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-[1000] tracking-tighter italic">
                GOAT<span className="text-orange-600 not-italic">STORE</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                Plus qu'une boutique, un standard. Nous sourçons les pièces les plus exclusives pour l'élite d'Abidjan. Mode, Digital & Lifestyle.
              </p>
            </div>
            
            <div className="flex gap-3">
              {[
                { icon: <Instagram size={20} />, link: "#" },
                { icon: <MessageCircle size={20} />, link: "#" },
                { icon: <Globe size={20} />, link: "#" }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.link}
                  whileHover={{ y: -3, backgroundColor: "#EA580C" }}
                  className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* COLONNE 2 : NAVIGATION (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-black uppercase text-[11px] tracking-[0.2em] mb-8 text-orange-500">Menu</h4>
            <ul className="space-y-4">
              {['Accueil', 'Nos Offres', 'Contact', 'Blog'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Accueil' ? '/' : `/${item.toLowerCase().replace(' ', '')}`}
                    className="group flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-all"
                  >
                    <span className="w-0 group-hover:w-4 h-px bg-orange-500 transition-all duration-300" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLONNE 3 : ENGAGEMENTS (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-black uppercase text-[11px] tracking-[0.2em] mb-8 text-orange-500">Expérience G.S</h4>
            <ul className="space-y-6">
              {[
                { title: "Livraison Express", desc: "Abidjan en moins de 24h", icon: <ArrowUpRight size={14} /> },
                { title: "Authenticité", desc: "Produits 100% certifiés", icon: <ShieldCheck size={14} /> },
                { title: "SAV Premium", desc: "Assistance dédiée WhatsApp", icon: <MessageCircle size={14} /> }
              ].map((service, i) => (
                <li key={i} className="flex gap-4 group">
                  <div className="text-orange-600 mt-1">{service.icon}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-200 group-hover:text-orange-500 transition-colors">{service.title}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-tighter mt-0.5">{service.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* COLONNE 4 : CONTACT (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-black uppercase text-[11px] tracking-[0.2em] mb-8 text-orange-500">Boutique</h4>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
              <div className="flex items-start gap-4">
                <MapPin size={20} className="text-orange-600 shrink-0" />
                <div>
                  <p className="text-xs font-black uppercase text-slate-400 mb-1">Localisation</p>
                  <p className="text-sm font-medium text-slate-200">Abidjan, Côte d'Ivoire</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone size={20} className="text-orange-600 shrink-0" />
                <div>
                  <p className="text-xs font-black uppercase text-slate-400 mb-1">Service Client</p>
                  <p className="text-sm font-medium text-slate-200">+225 07 67 79 31 20</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em]">
            © {currentYear} GOATSTORE — THE GOLD STANDARD
          </p>
          
          <div className="flex items-center gap-8 text-[9px] font-black text-slate-600 uppercase tracking-widest">
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Politique de Confidentialité</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">CGV</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;