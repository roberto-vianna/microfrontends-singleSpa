import Sidebar from "../components/Menu/Sidebar";

const DashboardLayout = ({ children }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-[20%_80%] h-screen overflow-hidden">
            <aside className="hidden md:block"> <Sidebar /> </aside>
            <main className="p-8 bg-black text-[#fdfdfd] overflow-y-auto h-full"> {children} </main>
        </div>
    );
};

export default DashboardLayout;