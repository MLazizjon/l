import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth, homePath } from './context/AuthContext';
import { useLang } from './i18n';
import MainLayout from './layout/MainLayout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Hisobot from './pages/Hisobot/Hisobot';
import Yuklar from './pages/Yuklar/Yuklar';
import Yopilgan from './pages/Yopilgan/Yopilgan';
import Haydovchilar from './pages/Haydovchilar/Haydovchilar';
import Hamkorlar from './pages/Hamkorlar/Hamkorlar';
import Telegram from './pages/Telegram/Telegram';
import Xodimlar from './pages/Xodimlar/Xodimlar';
import Foydalanuvchilar from './pages/Foydalanuvchilar/Foydalanuvchilar';
import Korinish from './pages/Korinish/Korinish';
import HamkorKirish from './pages/HamkorKirish/HamkorKirish';
import HamkorPanel from './pages/HamkorPanel/HamkorPanel';
import HaydovchiKirish from './pages/HaydovchiKirish/HaydovchiKirish';
import HaydovchiPanel from './pages/HaydovchiPanel/HaydovchiPanel';

const MANAGERS = ['admin', 'director'];

function RequireAuth({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

/* Faqat ko'rsatilgan rollar kira oladi, qolganlar o'z bosh sahifasiga qaytariladi */
function Only({ roles, children }) {
  const { user } = useAuth();
  return roles.includes(user?.role) ? children : <Navigate to={homePath(user)} replace />;
}

function RequirePartner({ children }) {
  const { partner } = useAuth();
  return partner ? children : <Navigate to="/kabinet" replace />;
}

function RequireDriver({ children }) {
  const { driver } = useAuth();
  return driver ? children : <Navigate to="/haydovchi" replace />;
}

export default function App() {
  const { user, partner, driver } = useAuth();
  useLang(); // til almashganda butun ilova qayta chiziladi

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={homePath(user)} replace /> : <Login />} />

      {/* Hamkorlar kabineti (zavod, broker, logistika kompaniyasi) — bitta havola: /kabinet */}
      <Route path="/kabinet" element={partner ? <Navigate to="/kabinet/panel" replace /> : <HamkorKirish />} />
      <Route path="/kabinet/panel" element={<RequirePartner><HamkorPanel /></RequirePartner>} />
      <Route path="/yukchi" element={<Navigate to="/kabinet" replace />} />
      <Route path="/zavod" element={<Navigate to="/kabinet/panel" replace />} />

      {/* Haydovchi kabineti — o'zi ro'yxatdan o'tadi, joyini va holatini yangilaydi: /haydovchi */}
      <Route path="/haydovchi" element={driver ? <Navigate to="/haydovchi/panel" replace /> : <HaydovchiKirish />} />
      <Route path="/haydovchi/panel" element={<RequireDriver><HaydovchiPanel /></RequireDriver>} />

      <Route
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to={homePath(user)} replace />} />
        <Route path="dashboard" element={<Only roles={['director']}><Dashboard /></Only>} />
        <Route path="hisobot" element={<Only roles={['director']}><Hisobot /></Only>} />
        <Route path="xodimlar" element={<Only roles={['director']}><Xodimlar /></Only>} />
        <Route path="yuklar" element={<Yuklar />} />
        <Route path="yuklar/:source" element={<Yuklar />} />
        <Route path="yopilgan" element={<Yopilgan />} />
        <Route path="haydovchilar" element={<Haydovchilar />} />
        <Route path="zavodlar" element={<Only roles={MANAGERS}><Hamkorlar type="factory" key="factory" /></Only>} />
        <Route path="brokerlar" element={<Only roles={MANAGERS}><Hamkorlar type="broker" key="broker" /></Only>} />
        <Route path="kompaniyalar" element={<Only roles={MANAGERS}><Hamkorlar type="company" key="company" /></Only>} />
        <Route path="foydalanuvchilar" element={<Only roles={MANAGERS}><Foydalanuvchilar /></Only>} />
        <Route path="korinish" element={<Only roles={MANAGERS}><Korinish /></Only>} />
        <Route path="telegram" element={<Telegram />} />
      </Route>

      <Route path="*" element={<Navigate to={user ? homePath(user) : '/login'} replace />} />
    </Routes>
  );
}
