import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"
import { UserContext, NavContext } from '@/lib/utils'
import { useContext } from 'react'
import { useLocalStorage } from '@uidotdev/usehooks'
import HomePage from './pages/home'
import AdminPage from './pages/admin'
import LoginPage from './pages/login'
import UsersPage from './pages/admin/users'
import AddressPage from './pages/admin/address'
import GoodsPage from './pages/admin/goods'
import IndexPage from './pages/admin/index'
import CardPage from './pages/admin/card'
import BankPage from './pages/admin/bank'
import OrderPage from './pages/admin/order'
import CheckPage from './pages/admin/check'
import FeedbackPage from './pages/admin/feedback'
import CategoryPage from './pages/admin/category'
import DramaPage from './pages/admin/drama'
import CommentPage from './pages/admin/comment'
import ChapterPage from './pages/admin/chapter'
import TopUpPage from './pages/admin/top-up'
import WithdrawalPage from './pages/admin/withdrawal'
import MessageSystemPage from './pages/admin/message-system'
import MessageUserPage from './pages/admin/message-user'

function App() {
  const [auth, setAuth] = useLocalStorage("auth", false)
  const [navs, setNavs] = useLocalStorage("navs", [])

  const AdminRoutes = () => {
    const [auth] = useContext(UserContext)
    const [navs] = useContext(NavContext)
    return auth ? (<AdminPage navs={navs} />) : (<LoginPage />) 
  }

  return (
    <>
      <BrowserRouter>
      <UserContext.Provider value={[auth, setAuth]}>
        <NavContext.Provider value={[navs, setNavs]}>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/admin' element={<AdminRoutes />} >
          
            <Route index element={<IndexPage />} />
            <Route path='address' element={<AddressPage />} />
            <Route path='bank' element={<BankPage />} />
            <Route path='card' element={<CardPage />} />
            <Route path='category' element={<CategoryPage />} />
            <Route path='chapter' element={<ChapterPage />} />
            <Route path='check' element={<CheckPage />} />
            <Route path='comment' element={<CommentPage />} />
            <Route path='drama' element={<DramaPage />} />
            <Route path='feedback' element={<FeedbackPage />} />
            <Route path='goods' element={<GoodsPage />} />
            <Route path='top_up' element={<TopUpPage />} />
            <Route path='withdrawal' element={<WithdrawalPage />} />
            <Route path='message_system' element={<MessageSystemPage />} />
            <Route path='message_user' element={<MessageUserPage />} />
            <Route path='order' element={<OrderPage />} />
            <Route path='user' element={<UsersPage />} />
          </Route>
        </Routes>
        </NavContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
      <Toaster />
    </>
  )
}

export default App
