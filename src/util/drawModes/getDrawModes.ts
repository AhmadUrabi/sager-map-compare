import MapboxDraw from "@mapbox/mapbox-gl-draw";
import {
	DragCircleMode,
	DirectMode,
	SimpleSelectMode,
	// @ts-ignore
} from "mapbox-gl-draw-circle";

export default function getDrawModes() {
	return {
		...MapboxDraw.modes,
		drag_circle: DragCircleMode,
		direct_select: DirectMode,
		simple_select: SimpleSelectMode,
	};
}
