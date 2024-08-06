import { area, centroid, length } from "@turf/turf";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import type { Feature, GeoJSON } from "geojson";
import type { FeatureCollection, Point } from "geojson";
import type { GeoJSONFeature } from "mapbox-gl";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	Map as GeoMap,
	Layer,
	type LayerProps,
	type MapMouseEvent,
	type MapRef,
	Source,
} from "react-map-gl";
import { MAPBOX_TOKEN } from "../../constants";
import DrawControl from "../drawControls";

// TODO: need to get source name from mapbox draw
// and create a layer for text fields

const layerStyle: LayerProps = {
	id: "poi-labels",
	type: "symbol",
	source: "mapbox-gl-draw-hot",
	layout: {
		"text-field": ["get", "description"],
		"text-variable-anchor": ["top", "bottom", "left", "right"],
		"text-justify": "auto",
		"text-size": 16,
		"icon-image": ["get", "icon"],
	},
	paint: {
		"text-color": "#fff",
		"text-halo-color": "#000",
		"text-halo-width": 1,
	},
};

const layerLengthStyle: LayerProps = {
	id: "length-labels",
	type: "symbol",
	source: "mapbox-gl-draw-hot", // Will be ignored
	layout: {
		"text-field": ["get", "length"],
		"text-variable-anchor": ["top", "bottom", "left", "right"],
		"text-justify": "auto",
		"text-size": 16,
		"text-ignore-placement": true,
		"text-allow-overlap": true,
		"text-offset": [0, 0.5],
		visibility: "visible",
	},
	paint: {
		"text-color": "#000",
		"text-halo-color": "#000",
		"text-halo-width": 0,
		"text-opacity-transition": { duration: 0 },
	},
};

// Helper function to calculate the area and center of a feature
const calculateArea = (feature: GeoJSONFeature) => {
	const centerCoors = centroid(feature.geometry).geometry.coordinates;
	const featureArea = area(feature.geometry);
	return {
		area: featureArea,
		center: centerCoors,
	};
};

interface FeatureData {
	[id: string]: {
		type: string;
		id: string;
		properties: {
			description: string;
		};
		geometry: {
			type: string;
			coordinates: [number, number];
		};
	};
}

export default function NormalMap() {
	// featureData contains the data of all of the features, with the key being the feature id
	// This is to optimize search time in functions
	const [featureData, setFeatureData] = useState<FeatureData>({});
	const featureDataRef = useRef(featureData);

	// areaOnHover is a boolean that toggles the mouse move event listener
	const [areaOnHover, setAreaOnHover] = useState(true);
	const areaOnHoverRef = useRef(areaOnHover);

	// currentHover checks if the mouse is currently hovering over a feature, to prevent setting the geojson on every mouse move event
	const [currentHover, setCurrentHover] = useState(false);

	// mapReady is a flag to check if the ref is ready
	const [mapReady, setMapReady] = useState(false);

	// geojson contains the feature(s) that are currently rendered on map
	const [geojson, setGeoJson] = useState<FeatureCollection>({
		type: "FeatureCollection",
		features: [],
	});

	const [lengthSource, setLengthSource] = useState<Feature>();

	// Update the center of the polygon on move
	const onUpdate = (e: any) => {
		console.log(e);
		const newCenter = centroid(e.features[0].geometry).geometry.coordinates;
		const id = e.features[0].id;
		const newData = { ...featureDataRef.current };
		newData[id].geometry.coordinates = [newCenter[0], newCenter[1]];
		setFeatureData(newData);
	};

	const onDelete = (e: any) => {
		const id = e.features[0].id;
		const newData = { ...featureDataRef.current };
		delete newData[id];
		setFeatureData(newData);
		// TODO: check geojson and remove the feature from it
	};

	// Calculate the area and center on create, and append them to featureData
	const onCreate = (e: any) => {
		if (e.features[0].geometry.type === "LineString") return;
		// switch (e.features[0].geometry.type) {
		// 	case "LineString":
		// 		console.log("LineString");
		// 		break;

		// 	case "Feature": {
		const { area, center } = calculateArea(e.features[0]);

		const id = e.features[0].id;

		const newData = {
			...featureDataRef.current,
			[id]: {
				type: "Feature",
				id: id,
				properties: {
					description: `Area: ${area.toFixed(2)} m²`,
				},
				geometry: {
					type: "Point",
					coordinates: [center[0], center[1]],
				},
			},
		};

		setFeatureData(newData);
		// 	break;
		// }
		// default: {
		// 	break;
		// }
		// }
	};

	// Effects to update refs for each state object, to use inside closures with the latest value
	useEffect(() => {
		featureDataRef.current = featureData;
	}, [featureData]);

	useEffect(() => {
		areaOnHoverRef.current = areaOnHover;
	}, [areaOnHover]);

	// TODO: redo this function
	const toggleAreaOnHover = () => {
		switch (areaOnHover) {
			case true: {
				if (mapReady && mapRef.current) {
					console.log("Removing event listener");
					mapRef.current.off("mousemove", onMouseMoveHandle);
				}

				setAreaOnHover(false);
				const featuresArray = Object.keys(featureDataRef.current).map((key) => {
					return featureDataRef.current[key];
				});

				setGeoJson({
					type: "FeatureCollection",
					// @ts-ignore
					features: featuresArray,
				});
				break;
			}
			case false:
				if (mapReady && mapRef.current) {
					console.log("Adding event listener");
					mapRef.current.on("mousemove", onMouseMoveHandle);
				}

				setAreaOnHover(true);
				setGeoJson({
					type: "FeatureCollection",
					features: [],
				});
				break;
		}
	};

	// Main event handler for mouse move events
	// Still needs some optimization (Flag Checks, find functions) and testing
	const onMouseMoveHandle = useCallback(
		(e: MapMouseEvent) => {
			if (!areaOnHoverRef.current) return;
			// @ts-ignore - featureTarget is not in the types
			const el = e.featureTarget;
			if (el) {
				// Return if the mouse is already hovering over a feature
				if (currentHover) return;
				setCurrentHover(true);

				// Fetch the matching feature from the featureData
				// console.log(el.properties.id, featureDataRef.current);
				const feature = featureDataRef.current[el.properties.id];
				if (!feature) return;
				// console.log("ss");
				setGeoJson({
					type: "FeatureCollection",
					// TODO: check type
					features: [feature as any],
				});
			} else {
				// Clear Hover Flag
				setCurrentHover(false);
				// return if the geojson is already empty
				if (geojson.features.length === 0) return;
				setGeoJson({
					type: "FeatureCollection",
					features: [],
				});
			}
		},
		[currentHover, geojson.features.length],
	);

	// The main map reference
	const mapRef = useRef<MapRef | null>(null);

	useEffect(() => {
		if (mapRef.current && mapReady) {
			mapRef.current.on("mousemove", onMouseMoveHandle);
			// mapRef.current.on("mousedown", (e) => {
			// 	console.log(e.featureTarget);
			// });
		}
	}, [mapReady, onMouseMoveHandle]);

	const calculateLegthTimout = useRef<NodeJS.Timeout | null>(null);

	return (
		<>
			<button className="absolute bottom-12 left-2" onClick={toggleAreaOnHover}>
				Area on Hover: {areaOnHover ? "On" : "Off"}
			</button>
			<GeoMap
				ref={mapRef}
				fadeDuration={0}
				mapboxAccessToken={MAPBOX_TOKEN}
				initialViewState={{
					longitude: 35.9106,
					latitude: 31.9544,
					zoom: 12,
				}}
				onLoad={() => {
					// raise map ready flag, calls effect again
					setMapReady(true);
				}}
				style={{ height: "100%" }}
				mapStyle="mapbox://styles/mapbox/streets-v9"
			>
				<DrawControl
					position="top-left"
					displayControlsDefault={false}
					controls={{
						polygon: true,
						trash: true,
						line_string: true,
					}}
					modes={{
						...MapboxDraw.modes,
						draw_line_string: {
							...MapboxDraw.modes.draw_line_string,

							toDisplayFeatures: (
								state: any,
								geojson: any,
								display: (geojson: GeoJSON) => void,
							) => {
								if (geojson.geometry.coordinates.length === 1) return;

								const isActiveLine = geojson.properties.id === state.line.id;

								if (!isActiveLine) {
									setLengthSource(undefined);
								}

								geojson.properties.active = isActiveLine ? "true" : "false";
								if (isActiveLine && !calculateLegthTimout.current) {
									console.log(length(geojson, { units: "meters" }));
									const coords =
										geojson.geometry.coordinates[
											geojson.geometry.coordinates.length - 1
										];
									setLengthSource({
										id: "length-source",
										type: "Feature",
										geometry: {
											type: "Point",
											coordinates: [coords[0], coords[1]],
										},
										properties: {
											length: length(geojson, {
												units: "meters",
											}).toFixed(2),
										},
									});
									console.log(geojson, state);
									calculateLegthTimout.current = setTimeout(() => {
										calculateLegthTimout.current = null;
									}, 50);
								}
								return display(geojson);
							},
						},
					}}
					defaultMode="draw_line_string"
					userProperties={true}
					onCreate={onCreate}
					onUpdate={onUpdate}
					onDelete={onDelete}
				/>
				<Source id="my-data" type="geojson" data={geojson}>
					<Layer {...layerStyle} />
				</Source>
				<Source id="lengthSource" type="geojson" data={lengthSource}>
					<Layer {...layerLengthStyle} />
				</Source>
			</GeoMap>
		</>
	);
}
