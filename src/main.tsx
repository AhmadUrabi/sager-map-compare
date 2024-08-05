// import React from "react";
// import App from "./App";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./components/dashboard";
import ComparePage from "./pages/comparePage";
import MapPage from "./pages/mapPage";
import React from "react";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Dashboard />,
		children: [
			{
				path: "/map",
				element: <MapPage />,
			},
			{
				path: "/compare",
				element: <ComparePage />,
			},
		],
	},
]);

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
