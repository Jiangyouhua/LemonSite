import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"
import { UserContext } from '@/lib/utils'
import { useContext } from 'react'
import { useLocalStorage } from '@uidotdev/usehooks'
import HomePage from './pages/home'
import AdminPage from './pages/admin'
import LoginPage from './pages/login'
import UsersPage from './pages/admin/users'
import AddressPage from './pages/admin/address'
import GoodsPage from './pages/admin/goods'
import IndexPage from './pages/admin/index'
import KindPage from './pages/admin/kind'
import CardPage from './pages/admin/card'
import BankPage from './pages/admin/bank'
import OrderPage from './pages/admin/order'
import CheckPage from './pages/admin/check'
import MoneyPage from './pages/admin/money'

function App() {
  const [auth, setAuth] = useLocalStorage("auth", false)

  const AdminRoutes = () => {
    const [auth] = useContext(UserContext)
    return auth ? (<AdminPage />) : (<LoginPage />) 
  }

  return (
    <>
      <BrowserRouter>
      <UserContext.Provider value={[auth, setAuth]}>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/admin' element={<AdminRoutes />} >
            <Route index element={<IndexPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="address" element={<AddressPage />}/>
            <Route path="bank" element={<BankPage />}/>
            <Route path="goods" element={<GoodsPage />} />
            <Route path="order" element={<OrderPage />} />
            <Route path="kind" element={<KindPage />} />
            <Route path="card" element={<CardPage />} />
            <Route path="check" element={<CheckPage />} />
            <Route path="money" element={<MoneyPage />} />
          </Route>
        </Routes>
        </UserContext.Provider>
      </BrowserRouter>
      <Toaster />
    </>
  )
}

export default App
