import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Customer from "./pages/Customer";
import Cashier from "./pages/Cashier";
import Manager from "./pages/Manager";

function App() {
	const [user, setUser] = useState({});
	const [role, setRole] = useState("");
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route path="/menu" element={<Menu />} />
					<Route path="/customer" element={<Customer />} />
					<Route
						path="/cashier"
						element={<Cashier role={role} user={user} />}
					/>
					<Route
						path="/manager"
						element={<Manager role={role} user={user} />}
					/>
					<Route
						path="/"
						element={
							<Login
								role={role}
								setRole={setRole}
								user={user}
								setUser={setUser}
							/>
						}
					/>
				</Routes>
			</Router>
			{JSON.stringify(user)}
			{role}
			{role === "cashier"}
			{role !== "cashier"}
			{role === "manager"}
			{role !== "manager"}
		</div>
	);
}
export default App;
