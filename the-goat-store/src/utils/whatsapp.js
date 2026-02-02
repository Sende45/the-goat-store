export const sendWhatsAppOrder = (items, totalPrice) => {
  const phoneNumber = "2250102030405"; // 👈 REMPLACE PAR TON NUMÉRO (Format international sans +)
  
  let message = `Salut GOATSTORE ! 👋\nJe souhaite passer une commande :\n\n`;
  
  items.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`;
    message += `   Prix: ${item.price.toLocaleString()} FCFA\n`;
    message += `   --------------------------\n`;
  });

  message += `\n💰 *Total: ${totalPrice.toLocaleString()} FCFA*`;
  message += `\n\nEst-ce que c'est disponible ?`;

  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
};