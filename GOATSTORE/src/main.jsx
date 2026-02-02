import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> 
      {/* Note : Le WishlistProvider et le CartProvider sont déjà 
          dans App.jsx, donc tout est prêt pour Jeune Riche ! 
      */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)