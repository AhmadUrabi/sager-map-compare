// import { BellIcon } from "@heroicons/react/24/outline";
// import { SunIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";

export default function TopBar() {
	return (
		<div className="w-screen h-16 bg-white shadow-sm border-b-sgblack/20 border-b flex justify-between items-center px-12">
			<img src="/sager_logo_black.png" alt="sager_logo" className="h-full" />
			<div className="my-2 md:w-96 w-min rounded-md ring-[1px] ring-gray-400 p-2 flex gap-2 items-center">
				<MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
				<h1 className="text-gray-500">Search</h1>
			</div>
			<div className="flex gap-8">
			<NavLink to="/map" className="text-sgblack font-bold">Map</NavLink>
			<NavLink to="/compare" className="text-sgblack font-bold">Compare</NavLink>
			</div>
			{/* <h1 className="font-medium items-center xl:flex gap-2 hidden">
				11:14 AM <span className="text-gray-700">(GMT +3)</span> |
				<SunIcon className="size-5 inline" /> 35 °C
			</h1>
			<div className="flex items-center gap-4">
				<BellIcon className="size-6 text-sgblack mr-2" />
				<img src="/pfp.svg" className="h-8 w-8 rounded-full" />
				<div className="flex flex-col ">
					<h1 className="text-sm">Proxy Construction</h1>
					<h1 className="text-gray-400">-</h1>
				</div>
			</div> */}
		</div>
	);
}
