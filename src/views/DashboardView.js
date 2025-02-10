import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (Date.now() >= payload.exp * 1000) {
                localStorage.removeItem("token");
                navigate("/");
            }
        }
    }, [navigate]);

    return (
        <div>
            <h2>Добро пожаловать в Dashboard!</h2>
            <button onClick={() => { localStorage.removeItem("token"); navigate("/"); }}>Выйти</button>
        </div>
    );
};

export default Dashboard;
