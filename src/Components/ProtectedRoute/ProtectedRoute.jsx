import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import AuthProvider, { AuthContext } from "../../Authcontext";

const ProtectedRoute = ({ allowedRoles }) => {
	const { role, user } = useContext(AuthContext);

	if (!user) return <Navigate to="/login" />;
	if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;

	return <Outlet />;
};

export default ProtectedRoute;
