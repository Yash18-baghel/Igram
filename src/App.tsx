import { Route, Routes } from 'react-router-dom'
import './globals.css'
import { Home } from './_root/pages'
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from './_root/RootLayout'
import SignupForm from './_auth/forms/SignupForm';
import SigninForm from './_auth/forms/SigninForm';


const App = () => {

  return (
    <main className='flex h-screen'>
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path='/sign-in' element={<SigninForm />} />
          <Route path='/sign-up' element={<SignupForm />} />
        </Route>


        {/* protected routes */}
        <Route element={<RootLayout />}>
          <Route path='/' index element={<Home />} />
        </Route>

      </Routes>
    </main>
  )
}

export default App