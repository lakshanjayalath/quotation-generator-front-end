import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NewItemForm from './components/NewItemForm'
import ItemPage from './components/ItemPage'
import Dashboard from './pages/Dashboard'
import NewQuotationForm from './components/NewQuotationForm'
import LandingPage from './pages/LandingPage'

function App() {

  return (
    <BrowserRouter>

      <div>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/items' element={<ItemPage />} />
          <Route path='/new-item' element={<NewItemForm />} />
          <Route path='/new-quote' element={<NewQuotationForm />} />
        </Routes>
      </div>

    </BrowserRouter>
  )
}

export default App
