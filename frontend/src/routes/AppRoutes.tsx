import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "../components/layout/Layout";

import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import ExcelImport from "../pages/ExcelImport";
import AddStudent from "../pages/AddStudent";
import EditStudent from "../pages/EditStudent";
import ViewStudent from "../pages/ViewStudent";
import Gallery from "../pages/Gallery.tsx";
import Analytics from "../pages/Analytics.tsx";

import Login from "../pages/Login";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import Settings from "../pages/Settings";

export default function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>

              <Layout />

            </ProtectedRoute>
          }
        >

          <Route
            index
            element={<Navigate to="/dashboard" />}
          />

          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          <Route
            path="students"
            element={<Students />}
          />

          <Route
            path="achievements"
            element={<Students />}
          />

          <Route
            path="gallery"
            element={<Gallery />}
          />

          <Route
            path="analytics"
            element={<Analytics />}
          />

          <Route
            path="students/add"
            element={<AddStudent />}
          />

          <Route
            path="students/:id"
            element={<ViewStudent />}
          />

          <Route
            path="students/edit/:id"
            element={<EditStudent />}
          />

          <Route
            path="excel-import"
            element={<ExcelImport />}
          />

          <Route
              path="settings"
              element={<Settings />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}