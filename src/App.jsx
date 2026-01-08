import { Route, Routes, BrowserRouter } from 'react-router-dom'
import HomePage from './pages/home'
import AdminPage from './pages/admin'
import LoginPage from './pages/login'
import UsersPage from './pages/admin/users'
import IndexPage from './pages/admin/index'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/admin' element={<AdminPage />} >
          <Route index element={<IndexPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
