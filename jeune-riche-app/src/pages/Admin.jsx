import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, orderBy, query, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
// Ajout des icônes pour le tracking : Package, Truck, Check
import { Package, ShoppingCart, Plus, Trash2, CheckCircle, ExternalLink, RefreshCw, X, Image as ImageIcon, Search, Edit2, Truck, Check } from 'lucide-react';

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState('orders'); 
  const [loading, setLoading] = useState(false);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null); 
  const [imageFile, setImageFile] = useState(null); 
  const [previewUrl, setPreviewUrl] = useState(null); 
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '', 
    image: '',
    description: '',
    type: 'physique',
    stock: 10 
  });

  const adminEmail = "yohannesende@gmail.com"; 
  const user = auth.currentUser;

  useEffect(() => {
    if (user?.email === adminEmail) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const qOrders = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snapOrders = await getDocs(qOrders);
      setOrders(snapOrders.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const snapProds = await getDocs(collection(db, "products"));
      setProducts(snapProds.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Erreur fetch:", error);
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // NOUVELLE FONCTION : Mise à jour du statut pour le tracking client
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      fetchData(); // Rafraîchit la liste
    } catch (error) {
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setNewProduct({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      description: product.description || '',
      type: product.type || 'physique',
      stock: product.stock || 0 
    });
    setPreviewUrl(product.image);
    setShowAddForm(true);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.category) return alert("Choisis une catégorie !");
    
    setLoading(true);
    try {
      let finalImageUrl = newProduct.image;
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const apiKey = '35bb74e2910fc59f0f0e4e2ad6c87935'; 
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (data.success) {
          finalImageUrl = data.data.url;
        }
      }

      if (editingId) {
        const productRef = doc(db, "products", editingId);
        await updateDoc(productRef, {
          ...newProduct,
          image: finalImageUrl,
          price: Number(newProduct.price),
          stock: Number(newProduct.stock) 
        });
      } else {
        await addDoc(collection(db, "products"), {
          ...newProduct,
          image: finalImageUrl,
          price: Number(newProduct.price),
          stock: Number(newProduct.stock), 
          createdAt: new Date()
        });
      }

      setShowAddForm(false);
      setEditingId(null);
      setImageFile(null);
      setPreviewUrl(null);
      setNewProduct({ name: '', price: '', category: '', image: '', description: '', type: 'physique', stock: 10 });
      fetchData();
    } catch (error) {
      alert("Erreur : " + error.message);
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (id) => {
    if(window.confirm("Supprimer cet article du stock ?")) {
      await deleteDoc(doc(db, "products", id));
      fetchData();
    }
  };

  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || user.email !== adminEmail) {
    return (
      <div className="pt-40 text-center font-black uppercase tracking-tighter">
        <h2 className="text-red-500 text-3xl">Accès Interdit</h2>
      </div>
    );
  }

  // Calcul du revenu basé sur le statut "delivered" ou "Livré"
  const totalRevenue = orders
    .filter(o => o.status === 'delivered' || o.status === 'Livré')
    .reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);

  return (
    <div className="pt-28 px-6 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic">Panel <span className="text-orange-600">G.S</span></h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Logistique & Business</p>
            <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded font-black">
              CA: {totalRevenue.toLocaleString()} F
            </span>
          </div>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button onClick={() => setView('orders')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'orders' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>
            Commandes ({orders.length})
          </button>
          <button onClick={() => setView('products')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'products' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>
            Stock Produits
          </button>
        </div>
      </div>

      {view === 'products' && (
        <div className="mb-8 relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Rechercher par nom ou catégorie..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:border-orange-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {loading && <RefreshCw className="animate-spin mx-auto text-orange-600 mb-10" />}

      {view === 'products' && (
        <>
          {showAddForm && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in duration-300">
                <button onClick={() => { setShowAddForm(false); setEditingId(null); }} className="absolute top-6 right-6 text-slate-400 hover:text-black"><X size={24} /></button>
                <h2 className="text-2xl font-black uppercase mb-6 tracking-tighter text-orange-600 italic">
                  {editingId ? 'Modifier le produit' : 'Ajouter au Stock'}
                </h2>
                
                <form onSubmit={handleAddProduct} className="space-y-4 overflow-y-auto max-h-[80vh] px-2">
                  <input required value={newProduct.name} placeholder="Nom du produit" className="w-full p-4 bg-slate-100 rounded-xl font-bold outline-none border-2 border-transparent focus:border-orange-500 transition-all" onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input required value={newProduct.price} type="number" placeholder="Prix FCFA" className="w-full p-4 bg-slate-100 rounded-xl font-bold outline-none border-2 border-transparent focus:border-orange-500 transition-all" onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                    <input required value={newProduct.stock} type="number" placeholder="Stock" className="w-full p-4 bg-slate-100 rounded-xl font-bold outline-none border-2 border-transparent focus:border-orange-500 transition-all" onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
                  </div>

                  <select 
                    required
                    value={newProduct.category}
                    className="w-full p-4 bg-slate-100 rounded-xl font-bold outline-none border-2 border-transparent focus:border-orange-500 transition-all appearance-none" 
                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  >
                    <option value="">📁 Catégorie</option>
                    <optgroup label="⚡ DIGITAL">
                      <option value="Téléphones">Téléphones</option>
                      <option value="Ordinateurs">Ordinateurs</option>
                      <option value="Consoles">Consoles</option>
                      <option value="Accessoires">Accessoires</option>
                    </optgroup>
                    <optgroup label="👕 VÊTEMENTS">
                      <option value="Homme">Homme</option>
                      <option value="Femme">Femme</option>
                      <option value="Enfant">Enfant</option>
                    </optgroup>
                    <optgroup label="👟 CHAUSSURES">
                      <option value="Baskets">Baskets</option>
                      <option value="Luxe">Luxe</option>
                      <option value="Sport">Sport</option>
                    </optgroup>
                  </select>

                  <div className="flex flex-col gap-2">
                    {previewUrl && (
                      <div className="relative w-full h-40 mb-2 rounded-xl overflow-hidden border-2 border-orange-500 bg-slate-50">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" id="image-upload" onChange={handleFileChange} />
                    <label htmlFor="image-upload" className="w-full p-6 bg-slate-100 rounded-xl font-bold border-2 border-dashed border-slate-300 hover:border-orange-500 transition-all cursor-pointer flex flex-col items-center gap-2 text-slate-500">
                      <ImageIcon size={24} className={imageFile ? "text-orange-600" : ""} />
                      <span className="text-[10px] uppercase tracking-tighter">{imageFile ? `Image choisie` : (editingId ? "Changer la photo" : "Photo du produit")}</span>
                    </label>
                  </div>

                  <textarea value={newProduct.description} placeholder="Description" className="w-full p-4 bg-slate-100 rounded-xl font-bold outline-none h-24 border-2 border-transparent focus:border-orange-500 transition-all" onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                  
                  <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl disabled:opacity-50">
                    {loading ? "Enregistrement..." : (editingId ? "Enregistrer les modifications" : "Publier sur GOATSTORE")}
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {!searchTerm && (
              <div onClick={() => setShowAddForm(true)} className="group border-4 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center p-10 text-slate-300 hover:text-orange-600 hover:border-orange-200 transition-all cursor-pointer bg-white">
                <Plus size={40} />
                <span className="font-black uppercase text-[10px] mt-4 tracking-widest">Nouveau</span>
              </div>
            )}

            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                <img src={product.image} alt="" className="w-full h-48 object-cover rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-500" />
                
                <div className={`absolute top-16 right-6 px-2 py-1 rounded text-[8px] font-black uppercase ${product.stock <= 5 ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                  Stock: {product.stock || 0}
                </div>

                <div className="flex justify-between items-start px-2">
                  <div className="flex-1 mr-2">
                    <h4 className="font-black uppercase italic text-sm tracking-tighter truncate">{product.name}</h4>
                    <p className="text-orange-600 font-black text-sm">{product.price?.toLocaleString()} FCFA</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditClick(product)} className="p-2 text-slate-400 hover:text-blue-500 transition-colors bg-slate-50 rounded-xl">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-slate-200 hover:text-red-500 transition-colors bg-slate-50 rounded-xl">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="absolute top-6 right-6 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[8px] font-black uppercase">
                  {product.category}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {view === 'orders' && (
        <div className="grid gap-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 group">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  {/* Affichage dynamique du statut stylisé */}
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest 
                    ${order.status === 'delivered' || order.status === 'Livré' ? 'bg-green-500 text-white' : 
                      order.status === 'shipped' ? 'bg-blue-500 text-white' : 
                      order.status === 'processing' ? 'bg-purple-500 text-white' : 'bg-orange-500 text-white animate-pulse'}`}>
                    {order.status === 'pending' ? 'En attente' : 
                     order.status === 'processing' ? 'Préparation' : 
                     order.status === 'shipped' ? 'En route' : 
                     order.status === 'delivered' ? 'Livré' : (order.status || 'Reçue')}
                  </span>
                  <span className="text-slate-300 font-bold text-[10px]">ID: {order.id.slice(0, 8)}</span>
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tight">{order.customerName}</h3>
                <a href={`https://wa.me/${order.whatsapp?.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline text-sm">{order.whatsapp}</a>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Commune: {order.address}</p>
              </div>

              {/* SECTION ACTIONS TRACKING */}
              <div className="flex flex-col items-end gap-3">
                <p className="font-black text-2xl tracking-tighter">{order.total?.toLocaleString()} FCFA</p>
                
                <div className="flex flex-wrap gap-2 justify-end">
                  {/* Bouton Étape 2 : Préparation */}
                  {(!order.status || order.status === 'pending') && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'processing')} 
                      className="bg-purple-50 text-purple-600 border border-purple-100 text-[9px] px-4 py-2 rounded-xl font-black uppercase hover:bg-purple-600 hover:text-white transition-all flex items-center gap-2"
                    >
                      <Package size={12} /> Préparer
                    </button>
                  )}

                  {/* Bouton Étape 3 : Expédition */}
                  {(order.status === 'processing' || !order.status) && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'shipped')} 
                      className="bg-blue-50 text-blue-600 border border-blue-100 text-[9px] px-4 py-2 rounded-xl font-black uppercase hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
                    >
                      <Truck size={12} /> Expédier
                    </button>
                  )}

                  {/* Bouton Étape Finale : Livraison Terminer */}
                  {(order.status !== 'delivered' && order.status !== 'Livré') && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'delivered')} 
                      className="bg-black text-white text-[9px] px-6 py-3 rounded-xl font-black uppercase hover:bg-green-600 transition-all shadow-lg flex items-center gap-2"
                    >
                      <Check size={12} /> Marquer Livré
                    </button>
                  )}
                  
                  {/* Indicateur de succès */}
                  {(order.status === 'delivered' || order.status === 'Livré') && (
                    <div className="flex items-center gap-2 text-green-600 font-black text-[10px] uppercase italic">
                      <CheckCircle size={16} /> Commande Terminée
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;