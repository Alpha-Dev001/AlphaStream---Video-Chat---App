import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="flex h-screen overflow-hidden">
        {showSidebar && <Sidebar />}

        <div className="flex-1 flex flex-col min-h-0">
          <Navbar />

          <main className="flex-1 overflow-y-auto bg-base-100 pb-24 lg:pb-0">{children}</main>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};
export default Layout;
