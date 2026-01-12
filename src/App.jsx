import { Route, Routes, BrowserRouter } from 'react-router-dom'
import HomePage from './pages/home'
import AdminPage from './pages/admin'
import LoginPage from './pages/login'
import UsersPage from './pages/admin/users'
import GoodsPage from './pages/admin/goods'
import IndexPage from './pages/admin/index'
import { Toaster } from "@/components/ui/sonner"
import { UserContext } from '@/lib/utils'
import { useContext } from 'react'
import { useLocalStorage } from '@uidotdev/usehooks'

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
            <Route path="goods" element={<GoodsPage />} />
          </Route>
        </Routes>
        </UserContext.Provider>
      </BrowserRouter>
      <Toaster />
    </>
  )
}

export default App
