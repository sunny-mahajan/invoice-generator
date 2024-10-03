import Header from './Header';
import Footer from './Footer';
import { useRouter } from "next/router";
import { addIcon } from '../utils/icons';

const Layout = ({ children }) => {
  const router = useRouter();
  const handleRedirect = () => {
    router.push("/");
  }
  return (
    <div className='layout d-flex flex-col min-h-screen relative'>
      <Header />
        <main className='main d-flex flex-col grow'>{children}</main>
        <div className="add-btn-container fixed bottom-4 right-4 cursor-pointer" onClick={handleRedirect}>
  <div className="add-icon-container">
    {addIcon()}
  </div>
</div>

      <Footer />
    </div>
  );
};

export default Layout;
