import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const createOrder = async (cart, total, deliveryFee, commune, user = null) => {
  try {
    // Nettoyage des données pour éviter les erreurs de sérialisation Firestore
    const orderData = {
      customerName: user?.displayName || "Client Anonyme",
      customerEmail: user?.email || "Non renseigné",
      // On s'assure que les données utilisateur sont simples (pas d'objets complexes)
      userId: user?.uid || "guest", 
      whatsapp: user?.phoneNumber || "À vérifier sur WA",
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
        image: item.image || "" // Ajouté pour l'historique client
      })),
      subTotal: Number(total),
      deliveryFee: Number(deliveryFee),
      total: Number(total + deliveryFee),
      address: commune,
      // On utilise "pending" pour correspondre aux étapes du tracking qu'on a créé
      status: "pending", 
      statusLabel: "En attente", 
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "orders"), orderData);
    console.log("Commande enregistrée avec ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    // Si tu as une erreur 500 ici, c'est souvent un problème de permissions Firestore
    console.error("Erreur création commande Firestore:", error);
    throw error; // On propage l'erreur pour que le Catch du CartDrawer la voie
  }
};