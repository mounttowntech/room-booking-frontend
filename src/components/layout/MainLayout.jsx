import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./MainLayout.css"; 

const MainLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-section">
        <Header />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
