import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { I18nProvider } from './i18n'
import { QuoteProvider } from './context/QuoteContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <QuoteProvider>
          <App />
        </QuoteProvider>
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>,
)
