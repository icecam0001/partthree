import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'

axios
  .get('http://localhost:3001/api/persons')
  .then(response => {
    const persons = response.data
    console.log(persons)
  })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
