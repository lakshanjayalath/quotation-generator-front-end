import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NewItemForm from './components/NewItemForm'
import ItemPage from './components/ItemPage'
import LoginPage from './pages/LoginPage'
import RegisterForm from './pages/RegisterForm'


function App() {

  return (
    <BrowserRouter>

      <div>
        <Routes>
          <Route path='/' element={<h1>Home Page</h1>} />
          <Route path='/register' element={<RegisterForm />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/items' element={<ItemPage />} />
          <Route path='/new-item' element={<NewItemForm />} />
        </Routes>
      </div>

    </BrowserRouter>
  )
}

export default App
