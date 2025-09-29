import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NewItemForm from './components/NewItemForm'
import ItemPage from './components/ItemPage'
import NewQuotationForm from './components/NewQuotationForm'
import QuotationList from './components/QuotationList'


function App() {

  return (
    <BrowserRouter>

      <div>
        <Routes>
          <Route path='/' element={<h1>Home Page</h1>} />

          
          <Route path='/items' element={<ItemPage />} />
          <Route path='/new-item' element={<NewItemForm />} />

          <Route path='/new-quote' element={<NewQuotationForm />} />
          <Route path='/quotation-list' element={<QuotationList />} />
        </Routes>
      </div>

    </BrowserRouter>
  )
}

export default App
