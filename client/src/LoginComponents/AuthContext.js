// LoginComponents/AuthContext.js

import React, { createContext, useState } from "react";

export const AuthContext = createContext();

/**
 * AuthProvider component that wraps your application and provides authentication state.
 *
 * @param {Object} props - Component properties.
 * @param {ReactNode} props.children - Child components that will have access to the authentication context.
 * @returns {JSX.Element} The rendered AuthProvider component.
 */
export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);

	/**
	 * Logs in the user by setting the user state.
	 *
	 * @param {Object} userData - The user data to be stored.
	 */
	const login = (userData) => {
		setUser(userData);
	};

	/**
	 * Logs out the user by clearing the user state.
	 */
	const logout = () => {
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}
