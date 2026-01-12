import { Route, Routes, BrowserRouter } from 'react-router-dom'
import HomePage from './pages/home'
import AdminPage from './pages/admin'
import LoginPage from './pages/login'
import UsersPage from './pages/admin/users'
import GoodsPage from './pages/admin/goods'
import IndexPage from './pages/admin/index'
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/admin' element={<AdminPage />} >
          <Route index element={<IndexPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="goods" element={<GoodsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    <Toaster />
    </>
  )
}

export default App
