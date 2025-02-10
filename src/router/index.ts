import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from '../views/LoginView';
import Dashboard from '../views/DashboardView';

const routes = [
    { path: '/', component: Login },
    {
        path: '/dashboard',
        component: Dashboard,
        beforeEnter: (to, from, next) => {
            const token = localStorage.getItem('token');
            if (!token) {
                next('/');
            } else {
                next();
            }
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
