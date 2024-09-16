import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className='layout d-flex flex-col h-full'>
      <Header />
      <main className='d-flex flex-col grow'>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
