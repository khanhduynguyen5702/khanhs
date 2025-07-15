import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";
import {Outlet, useNavigate} from "react-router-dom";
import {useEffect} from "react";


const AppLayout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        verifyAuth();
    }, [navigate]);

    const verifyAuth = () => {
        const token = localStorage.getItem("jwt");

        if (!token) {
            navigate("/signin");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header/>
            <div className="flex">
                <Sidebar/>
                <main className="flex-1 p-4">
                    <Outlet/>
                </main>
            </div>
        </div>
    )
}

export default AppLayout;
