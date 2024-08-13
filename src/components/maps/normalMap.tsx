import MapboxDraw from "@mapbox/mapbox-gl-draw";
import type { Feature, GeoJSON } from "geojson";
import type { FeatureCollection } from "geojson";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	Map as GeoMap,
	Layer,
	type MapMouseEvent,
	type MapRef,
	Source,
} from "react-map-gl";
import {
	initialViewState,
	layerLengthStyle,
	layerStyle,
	MAPBOX_TOKEN,
	styleList,
	styles,
} from "../../constants";
import DrawControl, { drawRef } from "../drawControls";

import MapControls from "../ui/mapControls";
import getDrawModes from "../../util/drawModes/getDrawModes";
import { getDisplayFeatures } from "../../util/drawModes/drawLineString";
import type FeatureData from "../../util/interfaces/featureData";
import { calculateAreaAndCenter } from "../../util/calculateAreaAndCenter";

// TODO: Fix showing area when areaonhover is off

export default function NormalMap() {
	console.log("rerender");
	// featureData contains the data of all of the features, with the key being the feature id
	// This is to optimize search time in functions

	// areaOnHover is a boolean that toggles the mouse move event listener
	const [areaOnHover, setAreaOnHover] = useState(true);
	const areaOnHoverRef = useRef(areaOnHover);

	// currentHover checks if the mouse is currently hovering over a feature, to prevent setting the geojson on every mouse move event
	const [currentHover, setCurrentHover] = useState<string | null>(null);
	const currentHoverRef = useRef(currentHover);

	// geojson contains the feature(s) that are currently rendered on map
	const [lengthSource, setLengthSource] = useState<Feature | null>(null);
	const [lengthVisible, setLengthVisible] = useState(false);

	const calculateLengthTimeout = useRef<NodeJS.Timeout | null>(null);

	// The main map reference
	const mapRef = useRef<MapRef | null>(null);

	// Effects to update refs for each state object, to use inside closures with the latest value
	useEffect(() => {
		areaOnHoverRef.current = areaOnHover;
	}, [areaOnHover]);

	useEffect(() => {
		currentHoverRef.current = currentHover;
	}, [currentHover]);

	const modes = {
		...getDrawModes(),
		draw_line_string: {
			...MapboxDraw.modes.draw_line_string,
			toDisplayFeatures: (
				state: any,
				geojson: any,
				display: (geojson: GeoJSON) => void,
			) =>
				getDisplayFeatures(
					state,
					geojson,
					display,
					calculateLengthTimeout,
					setLengthSource,
					setLengthVisible,
				),
		},
	};

	// Update the area of the polygon on move
	const onUpdate = (e: any) => {
		const { area } = calculateAreaAndCenter(e.features[0]);
		drawRef?.setFeatureProperty(
			e.features[0].id,
			"description",
			`Area: ${new Intl.NumberFormat().format(area)} m²`,
		);
	};

	const onDelete = (_e: any) => {};

	const onCreate = (e: any) => {
		if (e.features[0].geometry.type === "LineString") return;

		const { area } = calculateAreaAndCenter(e.features[0]);

		drawRef?.setFeatureProperty(
			e.features[0].id,
			"description",
			`Area: ${new Intl.NumberFormat().format(area)} m²`,
		);
		drawRef?.setFeatureProperty(e.features[0].id, "text_visibility", 0);
	};

	const toggleAreaOnHover = () => {
		if (areaOnHoverRef.current) {
			mapRef.current?.off("mousemove", onMouseMoveHandle);
			// biome-ignore lint/complexity/noForEach: <explanation>
			drawRef?.getAll().features.forEach((feature) => {
				drawRef?.setFeatureProperty(feature.id as string, "text_visibility", 1);
			});
			setCurrentHover(null);
		} else {
			mapRef.current?.on("mousemove", onMouseMoveHandle);
			// biome-ignore lint/complexity/noForEach: <explanation>
			drawRef?.getAll().features.forEach((feature) => {
				drawRef?.setFeatureProperty(feature.id as string, "text_visibility", 0);
			});
			setAreaOnHover(true);
		}
	};

	const onMouseMoveHandle = useCallback((e: MapMouseEvent) => {
		if (!areaOnHoverRef.current) return;
		const el = drawRef?.getFeatureIdsAt(e.point)[0];
		if (el) {
			// if (currentHover) return;
			// setCurrentHover(el);
			drawRef?.setFeatureProperty(el, "text_visibility", 1);
		} else {
			// if (currentHoverRef.current) {
			// biome-ignore lint/complexity/noForEach: <explanation>
			drawRef?.getAll().features.forEach((feature) => {
				drawRef?.setFeatureProperty(feature.id as string, "text_visibility", 0);
			});
			// 	setCurrentHover(null);
			// }
		}
	}, []);

	const [mapReady, setMapReady] = useState(false);

	const mapLoadHandler = useCallback(() => {
		if (mapRef.current) {
			setMapReady(true);
			mapRef.current.on("mousemove", onMouseMoveHandle);
		}
	}, [onMouseMoveHandle]);

	return (
		<>
			<div
				className={`transition-all duration-700 absolute top-0 left-0 h-full w-full bg-sgblack/90 z-50 flex justify-center items-center ${!mapReady ? "opacity-100 visible" : "opacity-0 invisible"}`}
			>
				<h1 className="text-white font-bold text-3xl">Loading...</h1>
			</div>
			<GeoMap
				ref={mapRef}
				fadeDuration={100}
				mapboxAccessToken={MAPBOX_TOKEN}
				initialViewState={initialViewState}
				onLoad={mapLoadHandler}
				style={{ height: "100%", position: "relative" }}
				mapStyle="mapbox://styles/mapbox/light-v10"
			>
				<DrawControl
					position="top-left"
					displayControlsDefault={false}
					modes={modes}
					defaultMode="simple_select"
					userProperties={true}
					onCreate={onCreate}
					onUpdate={onUpdate}
					onDelete={onDelete}
					styles={styleList}
				/>
				{mapReady && (
					<MapControls
						drawRef={drawRef}
						setAreaOnHover={toggleAreaOnHover}
						areaOnHover={areaOnHover}
					/>
				)}
			</GeoMap>
		</>
	);
}

// export function LengthSource({
// 	lengthSource,
// }: { lengthSource: Feature | null }) {
// 	return (
// 		<Source id="lengthSource" type="geojson" data={lengthSource}>
// 			<Layer {...layerLengthStyle} />
// 		</Source>
// 	);
// }
