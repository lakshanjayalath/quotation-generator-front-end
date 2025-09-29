import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NewItemForm from './components/NewItemForm';
import ItemPage from './components/ItemPage';
import ClientPage from './components/ClientPage';
import NewClientForm from './components/NewClientForm';
import Dashboard from './pages/Dashboard'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<h1>Home Page</h1>} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/items' element={<ItemPage />} />
        <Route path='/new-item' element={<NewItemForm />} />
        <Route path='/clientpage' element={<ClientPage />} />
        <Route path='/new-client' element={<NewClientForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;