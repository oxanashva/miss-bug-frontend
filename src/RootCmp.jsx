import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { Home } from './pages/Home.jsx'
import { UserIndex } from './pages/UserIndex.jsx'
import { BugIndex } from './pages/BugIndex.jsx'
import { BugDetails } from './pages/BugDetails.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { LoginSignup } from './pages/LoginSignup.jsx'

export function App() {

    return (
        <Router>
            <UserProvider>
                <div className="main-layout">
                    <AppHeader />
                    <main className='container full'>
                        <Routes>
                            <Route path='/' element={<Home />} />
                            <Route path='/user' element={<UserIndex />} />
                            <Route path='/bug' element={<BugIndex />} />
                            <Route path='/bug/:bugId' element={<BugDetails />} />
                            <Route path='/about' element={<AboutUs />} />
                            <Route path='/login' element={<LoginSignup />} />
                            <Route path='/signup' element={<LoginSignup />} />
                        </Routes>
                    </main>
                    <AppFooter />
                </div>
            </UserProvider>
        </Router>
    )
}
