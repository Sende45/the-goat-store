export const seedDatabase = async () => {
  try {
    const colRef = collection(db, "products");

    for (const product of productsToUpload) {
      await addDoc(colRef, {
        ...product,
        price: Number(product.price),
        createdAt: new Date()
      });
      console.log(`✅ ${product.name} ajouté`);
    }

    console.log("🚀 Tous les produits ont été envoyés à Firebase");
  } catch (e) {
    console.error("❌ Erreur lors de l'ajout :", e);
  }
};
