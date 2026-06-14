import { Outlet, NavLink } from "react-router-dom";
import { Header } from "../Header/Header.jsx";
import { Footer } from "../Footer/Footer.jsx";


export const Root = () => {
  return (
    
    <>
      <Header />
      <div>
        <Outlet />
      </div>
      <Footer />
    </>
  )
};

