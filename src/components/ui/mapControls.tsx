import {
	PencilIcon,
	TrashIcon,
	CursorArrowRippleIcon,
	SlashIcon,
	PlusIcon,
	SunIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function MapControls({
	drawRef,
	setAreaOnHover,
}: { drawRef: MapboxDraw | null; setAreaOnHover: any }) {
	const [activeMode, setActiveMode] = useState("simple_select");
	console.log(drawRef);
	const modes = [
		{
			id: "draw_polygon",
			text: "Draw Polygon",
			icon: <PlusIcon className="size-4" />,
		},
		{
			id: "draw_line_string",
			text: "Draw Line String",
			icon: <SlashIcon className="size-4" />,
		},
		{
			id: "drag_circle",
			text: "Drag Circle",
			icon: <SunIcon className="size-4" />,
		},
	];

	const handleModeChange = (mode: string) => {
		drawRef?.changeMode(mode);
		setActiveMode(mode);
	};

	const changeTool = (tool: string) => {
		setActiveMode("simple_select");
		if (tool === "trash") {
			drawRef?.trash();
		} else if (tool === "area_on_hover") {
			setAreaOnHover();
		}
	};

	const tools = [
		{
			id: "trash",
			text: "Trash Tool",
			icon: <TrashIcon className="size-4" />,
		},
		{
			id: "area_on_hover",
			text: "Toggle Area On Hover",
			icon: <CursorArrowRippleIcon className="size-4" />,
		},
	];

	return (
		<div className="absolute top-2 right-2  flex flex-col gap-4">
			<div className="flex shadow-md flex-col bg-gray-50 rounded-md overflow-clip">
				{modes.map((mode) => {
					return (
						<button
							key={mode.id}
							className={`p-2 text-sm text-gray-800 hover:bg-gray-100 ${activeMode === mode.id ? "bg-gray-200" : ""}`}
							onClick={() => handleModeChange(mode.id)}
						>
							{mode.icon ?? mode.text}
						</button>
					);
				})}
			</div>
			<div className="flex shadow-md flex-col bg-gray-50 rounded-md overflow-clip">
				{tools.map((tool) => {
					return (
						<button
							key={tool.id}
							className="p-2 text-sm text-gray-800 hover:bg-gray-100"
							onClick={() => changeTool(tool.id)}
						>
							{tool.icon ?? tool.text}
						</button>
					);
				})}
			</div>
		</div>
	);
}
