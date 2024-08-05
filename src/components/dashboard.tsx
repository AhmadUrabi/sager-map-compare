import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "mapbox-gl/dist/mapbox-gl.css";
import TopBar from "./ui/topBar";
import SideMenu from "./ui/sideMenu";

import { Outlet } from "react-router-dom";

export default function Dashboard() {

	return (
		<div className="min-w-screen min-h-screen h-full flex flex-col bg-gray-100">
			<TopBar />
			<div className="p-8 flex flex-row gap-6 h-[calc(100vh-4rem)] w-full">
				<SideMenu />
				<Outlet />
			</div>
		</div>
	);
}
