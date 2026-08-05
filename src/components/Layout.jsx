import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import InstagramButton from './InstagramButton';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <InstagramButton />
      <WhatsAppButton />
    </div>
  );
};

export default Layout;
