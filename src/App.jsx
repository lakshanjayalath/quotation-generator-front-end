import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NewItemForm from './components/NewItemForm'
import ItemPage from './components/ItemPage'

function App() {

  return (
    <BrowserRouter>

      <div>
        <Routes>
          <Route path='/items' element={<ItemPage />} />
          <Route path='/new-item' element={<NewItemForm />} />
        </Routes>
      </div>

    </BrowserRouter>
  )
}

export default App
