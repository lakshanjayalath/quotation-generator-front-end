import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NewItemForm from './components/NewItemForm'
import ItemPage from './components/ItemPage'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <BrowserRouter>

      <div>
        <Routes>
          <Route path='/' element={<h1>Home Page</h1>} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/items' element={<ItemPage />} />
          <Route path='/new-item' element={<NewItemForm />} />
        </Routes>
      </div>

    </BrowserRouter>
  )
}

export default App
