import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

import Home from "../pages/home/Home";
import PageBySlug from "./PageBySlug";

import WorkDetail from "../pages/works/WorkDetail";
import AdminWorkList from "../pages/works/AdminWorkList";
import LaDupla from "../pages/laDupla/LaDupla";
import LadoB from "../pages/ladoB/LadoB";

import Signup from "../pages/admin/Signup";
import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";

import CreateWork from "../pages/works/api/CreateWork";
import EditWork from "../pages/works/api/EditWork";
import WorksReorderPage from "../components/reorder/WorksReorderPage";

import CreateB from "../pages/ladoB/api/CreateBProject";
import EditB from "../pages/ladoB/api/EditBProject";
import BProjectsReorderPage from "../components/reorder/BProjectsReorderPage";

import CreateTeam from "../pages/laDupla/api/CreateTeam";
import EditTeam from "../pages/laDupla/api/EditTeam";

import CreatePage from "../pages/admin/api/CreatePage";
import EditPage from "../pages/admin/api/EditPage";

import Protected from "../pages/admin/Protected";
import ScrollToTop from "../components/ScrollToTop";

import { AuthProvider } from "../auth/AuthProvider";
import { SiteProvider } from "./SiteProvider";

import UnderConstruction from "../pages/construccion/UnderConstruction";
import PublicGate from "./PublicGate";

function AppRouter() {
  return (
    <AuthProvider>
      <SiteProvider>
        <Router>
          <ScrollToTop />

          <Routes>
            <Route path="en-construccion" element={<UnderConstruction />} />

            <Route element={<PublicGate />}>

              <Route element={<MainLayout />}>

                <Route index element={ <PageBySlug forcedSlug="home" render={page => <Home page={page} />} /> } />

                <Route path="la-dupla" element={ <PageBySlug forcedSlug="la-dupla" render={page => <LaDupla page={page} />} /> } />
                <Route path="lado-b" element={ <PageBySlug forcedSlug="lado-b" render={page => <LadoB page={page} />} /> } />

                <Route path="trabajos/:slug" element={<WorkDetail />} />
                <Route path="admin/login" element={<Login />} />

                <Route element={<Protected />}>
                  <Route path="admin/signup" element={<Signup />} />
                  <Route path="admin/dashboard" element={<Dashboard />} />

                  <Route path="admin/works" element={<AdminWorkList />} />
                  <Route path="admin/work/create" element={<CreateWork />} />
                  <Route path="admin/work/edit/:id" element={<EditWork />} />
                  <Route path="admin/work/reorder" element={<WorksReorderPage />} />

                  <Route path="admin/team/create" element={<CreateTeam />} />
                  <Route path="admin/team/edit/:id" element={<EditTeam />} />

                  <Route path="admin/b/create" element={<CreateB />} />
                  <Route path="admin/b/edit" element={<EditB />} />
                  <Route path="admin/b/reorder" element={<BProjectsReorderPage />} />

                  <Route path="admin/page/create" element={<CreatePage />} />
                  <Route path="admin/page/edit" element={<EditPage />} />
                </Route>

              </Route>

            </Route>

          </Routes>

        </Router>
      </SiteProvider>
    </AuthProvider>
  );
}

function MainLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default AppRouter;
