import {
	ChevronLeftIcon,
	HomeIcon,
	ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

import { NavLink } from "react-router-dom";

export default function SideMenu() {

  const [closed, setClosed] = useState(false);

  function toggleMenu() {
    setClosed(!closed);
  }

	return (
		<div data-closed={closed} className="group data-[closed=false]:w-64 data-[closed=true]:w-20  h-full justify-center  bg-white rounded-2xl p-6 transition-all flex-col">
			<div className="text-gray-600 text-sm w-full flex gap-1 items-center justify-between">
				<h1 className="whitespace-nowrap group-data-[closed=false]:block group-data-[closed=true]:hidden"><span className="font-bold">CLIENT</span> DASHBOARD</h1>
				<ChevronLeftIcon onClick={toggleMenu} className="size-5 ring-[1px] rounded-full group-data-[closed=true]: transition-all ring-gray-500  text-gray-500" />
			</div>
			<div className="flex flex-col gap-4 w-full pt-6">
				<NavLink
					to="/map"
					className="flex items-center gap-2 text-sgblack font-bold"
				>
					<HomeIcon className="size-6 min-w-6" />
					<h1 className="group-data-[closed=false]:block group-data-[closed=true]:hidden">Map</h1>
				</NavLink>
				<NavLink
					to="/compare"
					className="flex items-center gap-2 text-sgblack font-bold"
				>
					<ArchiveBoxIcon className="size-6 min-w-6" />
					<h1 className="group-data-[closed=false]:block group-data-[closed=true]:hidden">Compare</h1>
				</NavLink>
			</div>
			<div className="text-[0.6rem] whitespace-nowrap  mt-auto flex-col gap-1 group-data-[closed=false]:flex group-data-[closed=true]:hidden">
				<h1 className="font-bold">
					SagerSpace Dashboard <span className="text-sgred">(Staging)</span>
				</h1>
				<h1 className="text-[0.6rem] text-gray-600">
					© 2024 All Rights Reserved
				</h1>
				<h1 className="text-[0.6rem]">
					<a
						// biome-ignore lint/a11y/useValidAnchor: <explanation>
						href="#"
						className="underline text-blue-800 underline-offset-2"
					>
						Privacy Policy
					</a>{" "}
					|{" "}
					<a
						// biome-ignore lint/a11y/useValidAnchor: <explanation>
						href="#"
						className="underline text-blue-800 underline-offset-2"
					>
						Terms and Conditions
					</a>
				</h1>
			</div>
		</div>
	);
}
