import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminPanel/AdminPanel.css';
import './CharactersOBJ/Characters.css';
import './CatalogOBJ/Catalog.css';
import './CatalogOBJ/CatalogDetail.css';
import './MainPage/MainPage.css';
import NavbarComponent from './Navbar/Navbar.tsx';
import Footer from './Footer';
import MouseTracker from './MouseTracker';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Characters } from './CharactersOBJ/Characters';
import { Catalog } from './CatalogOBJ/Catalog';
import { CatalogDetail } from './CatalogOBJ/CatalogDetail';
import { LoginPage } from './AuthOBJ/LoginPage';
import { Page } from './Page';
import { RegisterPage } from './AuthOBJ/RegisterPage';
import { AdminPanel } from './AdminPanel/AdminPanel';
import { MainPage } from './MainPage/MainPage';
import WatchPage from './WatchPage/WatchPage';



const App: React.FC = () => {
  return (
    <BrowserRouter>
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavbarComponent setSateButton={function (): void {
        throw new Error('Function not implemented.');
      } } />
      
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/home" element={<MainPage/>}/>
          <Route path="/characters" element={<Characters/>}/>
          <Route path="/catalog" element={<Catalog/>}/>
          <Route path="/catalog/:animeId" element={<CatalogDetail/>}/>
          <Route path="/watch" element={<WatchPage/>}/>
          <Route path="/page" element={<Page/>}/>
          <Route path="/Admin" element={<AdminPanel/>}/>
          <Route path="/product/:productId" element={<Page/>} />
        </Routes>
      </main>
      
      <Footer />
      <MouseTracker />
    </div>
    </BrowserRouter>
  );
};

export default App;