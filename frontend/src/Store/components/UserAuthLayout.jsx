import React from 'react';
import { Outlet } from 'react-router-dom';
import { UserAuthProvider } from '../context/UserAuthContext';

const UserAuthLayout = () => {
    return (
        <UserAuthProvider>
            <Outlet />
        </UserAuthProvider>
    );
};

export default UserAuthLayout