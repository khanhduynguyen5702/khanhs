import { useEffect } from "react";
import { Outlet, useNavigate} from "react-router-dom";


const AuthApp = () => {
    const navigate = useNavigate();

    useEffect(() => {
        verifyAuth();
    }, [navigate]);
    
    const verifyAuth = () => {
        const token = localStorage.getItem("jwt");
        if (token) {
            navigate("/");
        }
    };
    return (
        <Outlet />
    )
};

export default AuthApp;
