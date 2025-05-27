// layouts/MainLayout.js
import Header from "../components/header";
import Footer from "../components/footer";
import Menu from "../components/menu";

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <Menu />
      <div className="main-content">{children}</div>
      <Footer />
    </>
  );
};

export default MainLayout;
