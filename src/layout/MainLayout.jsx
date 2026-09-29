import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import { Shell, Main, Content, Backdrop } from './styles';

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  // Mobil menyu faqat ochilgan sahifada ochiq turadi — boshqa sahifaga o'tilsa o'zi yopiladi
  const [openedAt, setOpenedAt] = useState(null);
  const mobileOpen = openedAt === pathname;

  return (
    <Shell $collapsed={collapsed}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
      />
      {mobileOpen && <Backdrop onClick={() => setOpenedAt(null)} />}
      <Main>
        <Header onMenu={() => setOpenedAt(pathname)} />
        <Content>
          <Outlet />
        </Content>
      </Main>
    </Shell>
  );
}
