export const uploadAllProducts = async () => {
  const colRef = collection(db, "products");

  // Nettoyage complet
  const snapshot = await getDocs(colRef);
  for (const docItem of snapshot.docs) {
    await deleteDoc(doc(db, "products", docItem.id));
  }
  console.log("🧹 Base de données nettoyée !");

  for (const product of productsData) {
    try {
      const formattedProduct = {
        ...product,
        price: Number(product.price),
        createdAt: new Date()
      };

      await addDoc(colRef, formattedProduct);
      console.log(`✅ ${product.name} ajouté`);
    } catch (e) {
      console.error("Erreur d'ajout :", e);
    }
  }

  console.log("🚀 Catalogue JR upload terminé");
};
