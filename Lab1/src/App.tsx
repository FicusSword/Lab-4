import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComponent from './Navbar';
import Footer from './Footer';
import MouseTracker from './MouseTracker';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainPage } from './MainpageOBJ/MainPage';
import { LoginPage } from './AuthOBJ/LoginPage';
import { Page } from './Page';
import { Task } from './DailyPage/DailyTaskPage';
import { Cart } from './Cart';
import { PageTwo } from './Page2';
import { RegisterPage } from './AuthOBJ/RegisterPage';
import { AdminPanel } from './AdminPanel';
import { Assisten } from './Assisten';
import { TaskManager } from './L2/TaskManager';
import Calculator from './L2/Calculator';


const App: React.FC = () => {
  return (
    <BrowserRouter>
    <>
      <NavbarComponent setSateButton={function (): void {
        throw new Error('Function not implemented.');
      } } />
      <Footer />
      <MouseTracker />
      <Routes>
        <Route path="" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/home" element={<MainPage/>}/>
        <Route path="/page" element={<Page/>}/>
        <Route path="/page2" element={<PageTwo/>}/>
        <Route path="/Task" element={<Task/>}/>
        <Route path="/Cart" element={<Cart/>}/>
        <Route path="/Assisten" element={<Assisten/>}/>
        <Route path="/Admin" element={<AdminPanel/>}/>
        <Route path="/product/:productId" element={<Page/>} />
        <Route path="/tasks" element={<TaskManager />} />
        <Route path="/calculator" element={<Calculator />} /> {/* Новый маршрут */}
      </Routes>
    </>
    </BrowserRouter>
  );
};

export default App;