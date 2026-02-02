import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

const ContactWhatsApp = () => {
  const [msg, setMsg] = useState({ name: '', subject: '', body: '' });

  const sendWhatsApp = (e) => {
    e.preventDefault();
    const phone = "2250767793120";
    const text = `Bonjour GOATSTORE ! 👋%0A%0A*Nom:* ${msg.name}%0A*Sujet:* ${msg.subject}%0A*Message:* ${msg.body}`;
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-[#25D366]/10 p-1 rounded-[2.5rem]">
          <div className="bg-white p-10 rounded-[2.3rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-[#25D366] p-3 rounded-2xl text-white">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter">Contact Direct G.S</h3>
            </div>

            <form onSubmit={sendWhatsApp} className="space-y-4">
              <input 
                type="text" placeholder="Votre nom" required
                className="w-full bg-slate-50 border-none px-6 py-4 rounded-xl focus:ring-2 focus:ring-[#25D366] transition-all"
                onChange={(e) => setMsg({...msg, name: e.target.value})}
              />
              <select 
                className="w-full bg-slate-50 border-none px-6 py-4 rounded-xl focus:ring-2 focus:ring-[#25D366] transition-all text-slate-500"
                onChange={(e) => setMsg({...msg, subject: e.target.value})}
              >
                <option value="Question sur un produit">Question sur un produit</option>
                <option value="Suivi de commande">Suivi de commande</option>
                <option value="Partenariat">Partenariat / Influence</option>
              </select>
              <textarea 
                placeholder="Votre message..." required rows="4"
                className="w-full bg-slate-50 border-none px-6 py-4 rounded-xl focus:ring-2 focus:ring-[#25D366] transition-all"
                onChange={(e) => setMsg({...msg, body: e.target.value})}
              ></textarea>

              <button className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-green-200 transition-all active:scale-95">
                Discuter sur WhatsApp <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactWhatsApp;