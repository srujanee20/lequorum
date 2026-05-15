import { Outlet } from '@tanstack/react-router';
import Navbar from '$components/layouts/Navbar.jsx';

const MainLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
};

export default MainLayout;
