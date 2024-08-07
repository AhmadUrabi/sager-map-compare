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
} from "../../constants";
import DrawControl, { drawRef } from "../drawControls";

import MapControls from "../ui/mapControls";
import getDrawModes from "../../util/drawModes/getDrawModes";
import { getDisplayFeatures } from "../../util/drawModes/drawLineString";
import type FeatureData from "../../util/interfaces/featureData";
import { calculateAreaAndCenter } from "../../util/calculateAreaAndCenter";

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

	// geojson contains the feature(s) that are currently rendered on map
	const [geojson, setGeoJson] = useState<FeatureCollection>({
		type: "FeatureCollection",
		features: [],
	});

	const [lengthSource, setLengthSource] = useState<Feature | null>(null);
	const [lengthVisible, setLengthVisible] = useState(false);

	const calculateLengthTimeout = useRef<NodeJS.Timeout | null>(null);

	// The main map reference
	const mapRef = useRef<MapRef | null>(null);

	// Effects to update refs for each state object, to use inside closures with the latest value
	useEffect(() => {
		featureDataRef.current = featureData;
	}, [featureData]);

	useEffect(() => {
		areaOnHoverRef.current = areaOnHover;
	}, [areaOnHover]);

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

	// Update the center of the polygon on move
	const onUpdate = (e: any) => {
		const { area, center } = calculateAreaAndCenter(e.features[0]);
		const id = e.features[0].id;
		const newData = { ...featureDataRef.current };
		newData[id].geometry.coordinates = [center[0], center[1]];
		newData[id].properties.description = `Area: ${area.toFixed(2)} m²`;
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
		const { area, center } = calculateAreaAndCenter(e.features[0]);

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
	};

	// TODO: redo this function
	const toggleAreaOnHover = () => {
		switch (areaOnHover) {
			case true: {
				if (mapRef.current) {
					console.log("Removing event listener");
					mapRef.current.off("mousemove", onMouseMoveHandle);
				}
				const featuresArray = Object.keys(featureDataRef.current).map((key) => {
					return featureDataRef.current[key];
				});
				setGeoJson({
					type: "FeatureCollection",
					features: featuresArray as Feature[],
				});
				break;
			}
			case false:
				if (mapRef.current) {
					console.log("Adding event listener");
					mapRef.current.on("mousemove", onMouseMoveHandle);
				}
				setGeoJson({
					type: "FeatureCollection",
					features: [],
				});
				break;
		}
		setAreaOnHover(!areaOnHover);
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
				const feature = featureDataRef.current[el.properties.id];
				if (!feature) return;
				setGeoJson({
					type: "FeatureCollection",
					features: [feature as Feature],
				});
			} else {
				setCurrentHover(false);
				if (geojson.features.length === 0) return;
				setGeoJson({
					type: "FeatureCollection",
					features: [],
				});
			}
		},
		[currentHover, geojson.features.length],
	);

	const mapLoadHandler = useCallback(() => {
		if (mapRef.current) {
			mapRef.current.on("mousemove", onMouseMoveHandle);
		}
	}, [onMouseMoveHandle]);

	return (
		<GeoMap
			ref={mapRef}
			fadeDuration={150}
			mapboxAccessToken={MAPBOX_TOKEN}
			initialViewState={initialViewState}
			onLoad={mapLoadHandler}
			style={{ height: "100%", position: "relative" }}
			mapStyle="mapbox://styles/mapbox/streets-v9"
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
			/>
			<MapControls drawRef={drawRef} setAreaOnHover={toggleAreaOnHover} />
			<GeoJSONSource geojson={geojson} />
			{lengthVisible && <LengthSource lengthSource={lengthSource} />}
		</GeoMap>
	);
}

export function GeoJSONSource({ geojson }: { geojson: FeatureCollection }) {
	return (
		<Source id="my-data" type="geojson" data={geojson}>
			<Layer {...layerStyle} />
		</Source>
	);
}

export function LengthSource({
	lengthSource,
}: { lengthSource: Feature | null }) {
	return (
		<Source id="lengthSource" type="geojson" data={lengthSource}>
			<Layer {...layerLengthStyle} />
		</Source>
	);
}
