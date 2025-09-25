import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NewItemForm from './components/NewItemForm'
import ItemPage from './components/ItemPage'
import Dashboard from './pages/Dashboard'
import ClientPage from './components/ClientPage'
import NewClientForm from './components/NewClientForm'


function App() {

  return (
    <BrowserRouter>

      <div>
        <Routes>
          <Route path='/' element={<h1>Home Page</h1>} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/items' element={<ItemPage />} />
          <Route path='/new-item' element={<NewItemForm />} />
          <Route path='/ClientPage' element={<ClientPage />} />
          <Route path='/new-client' element={<NewClientForm />} />
        </Routes>
      </div>

    </BrowserRouter>
  )
}

export default App
