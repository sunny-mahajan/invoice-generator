import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className='layout d-flex flex-col min-h-full'>
      <Header />
        <main className='d-flex flex-col grow px-48'>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
