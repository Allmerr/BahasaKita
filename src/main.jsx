import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { PwaProvider } from './Pwa.jsx'
import './index.css'
import './responsive.css'
import './dictionary.css'
import './theme.css'
import './pwa.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PwaProvider><App /></PwaProvider>
    </BrowserRouter>
  </React.StrictMode>
)
