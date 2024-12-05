import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { Error } from '../components/pages/Error'
import { Login } from '../components/pages/users/Login'
import { AuthProvider } from '../context/AuthProvider'
import { Register } from '../components/pages/users/Register'
import { LayoutPublic } from '../components/layout/public/LayoutPublic'
import { LayoutPrivate } from '../components/layout/private/LayoutPrivate'
import { Logout } from '../components/pages/users/Logout'
import { DHome } from '../components/pages/Default/DHome'
import { DEducation } from '../components/pages/Default/DEducation'
import { DExperience } from '../components/pages/Default/DExperience'
import { DProject } from '../components/pages/Default/DProject'
import { Home } from '../components/pages/portfolios/Home'
import { Education } from '../components/pages/portfolios/Education/Education.jsx'
import { Experience } from '../components/pages/portfolios/Experience/Experience.jsx'
import { Project } from '../components/pages/portfolios/Project/Project'
import { EditUser } from '../components/pages/users/Edit/EditUser'
import { EditProject } from '../components/pages/users/Edit/EditProject.jsx'
import { EdiEducation } from '../components/pages/users/Edit/EditEducation.jsx'
import { EdiExperience } from '../components/pages/users/Edit/EditExperience.jsx'
import { EditPortfolio } from '../components/pages/users/Edit/EditPortfolio.jsx'
import { ThemeProvider } from '../context/ThemeProvider.jsx'

export const Routing = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ThemeProvider>
                    <Routes>
                        <Route path='/profiles' element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path='home/:userid?' element={<Home />} />
                            <Route path='education/:userid?' element={<Education />} />
                            <Route path='experience/:userid?' element={<Experience />} />
                            <Route path='project/:userid?' element={<Project />} />
                        </Route>

                        {/* Cuando no existe un usuario logueado */}
                        <Route path='/' element={<LayoutPublic />}>
                            <Route index element={<DHome />} />
                            <Route path='education' element={<DEducation />} />
                            <Route path='experience' element={<DExperience />} />
                            <Route path='project' element={<DProject />} />
                            <Route path='login' element={<Login />} />
                            <Route path='register' element={<Register />} />
                        </Route>

                        {/* Usuarios logueados */}
                        <Route path='/user' element={<LayoutPrivate />}>
                            <Route index element={<Home />} />
                            <Route path='edit/:userid/user' element={<EditUser />} />
                            <Route path='edit/:userid/portfolio' element={<EditPortfolio />} />
                            <Route path='edit/:userid/education' element={<EdiEducation />} />
                            <Route path='edit/:userid/experience' element={<EdiExperience />} />
                            <Route path='edit/:userid/project' element={<EditProject />} />
                            <Route path='logout' element={<Logout />} />
                        </Route>

                        <Route path='*' element={<Error />} />
                    </Routes>
                </ThemeProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}