import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import MainLayout from './layout/MainLayout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Hisobot from './pages/Hisobot/Hisobot';
import Yuklar from './pages/Yuklar/Yuklar';
import Haydovchilar from './pages/Haydovchilar/Haydovchilar';
import Brokerlar from './pages/Brokerlar/Brokerlar';
import Zavodlar from './pages/Zavodlar/Zavodlar';
import Telegram from './pages/Telegram/Telegram';
import Foydalanuvchilar from './pages/Foydalanuvchilar/Foydalanuvchilar';

const homePath = (user) => (user?.role === 'admin' ? '/dashboard' : '/yuklar');

function RequireAuth({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function RequireAdmin({ children }) {
  const { user, isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to={homePath(user)} replace />;
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={homePath(user)} replace /> : <Login />} />

      <Route
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to={homePath(user)} replace />} />
        <Route path="dashboard" element={<RequireAdmin><Dashboard /></RequireAdmin>} />
        <Route path="hisobot" element={<RequireAdmin><Hisobot /></RequireAdmin>} />
        <Route path="foydalanuvchilar" element={<RequireAdmin><Foydalanuvchilar /></RequireAdmin>} />
        <Route path="yuklar" element={<Yuklar />} />
        <Route path="haydovchilar" element={<Haydovchilar />} />
        <Route path="brokerlar" element={<Brokerlar />} />
        <Route path="zavodlar" element={<Zavodlar />} />
        <Route path="telegram" element={<Telegram />} />
      </Route>

      <Route path="*" element={<Navigate to={user ? homePath(user) : '/login'} replace />} />
    </Routes>
  );
}
