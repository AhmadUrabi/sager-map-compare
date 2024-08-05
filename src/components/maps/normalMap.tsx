// import React, { useEffect, useState } from "react";
import * as reactMapGl from "react-map-gl";
import DrawControl from "../drawControls";
import { MAPBOX_TOKEN, styles } from "../../constants";
import { useCallback, useEffect, useRef, useState } from "react";
import { area, bbox } from "@turf/turf";
import type { FeatureCollection } from "geojson";
import { MapRef } from "react-map-gl/dist/esm/mapbox/create-ref";

export default function NormalMap() {
	const [features, setFeatures] = useState([]);
	const [areaOnHover, setAreaOnHover] = useState(true);
	// const mapRef = useRef<MapRef>(null)

	const onCreate = (e: any) => {
		console.log(e);
		setFeatures((f) => [...f, e.features[0]]);
	};

	useEffect(() => console.log(features), [features]);

	const onUpdate = (e: any) => {};

	const onDelete = (e: any) => {};

	const [currentHover, setCurrentHover] = useState(false);

	const onMouseMoveHandle = useCallback((e: reactMapGl.MapMouseEvent) => {
		// Kinda shitty implementation, just to skip using refs
		// Can use a state to store the latest feature and memo the area

		// @ts-ignore
		const el = e.featureTarget;
		if (el && !currentHover) {
			const topCoords = bbox(el.geometry);
			setCurrentHover(true);
			const featureArea = area(el.geometry);
			if (featureArea) {
				setGeoJson({
					type: "FeatureCollection",
					features: [
						{
							type: "Feature",
							properties: {
								description: `Area: ${featureArea.toFixed(2)} m²`,
							},
							geometry: {
								type: "Point",
								coordinates: [topCoords[2], topCoords[1]],
							},
						},
					],
				});
			}
		} else {
			setCurrentHover(false);
			setGeoJson({
				type: "FeatureCollection",
				features: [],
			});
		}
	}, []);

	const [geojson, setGeoJson] = useState<FeatureCollection>({
		type: "FeatureCollection",
		features: [],
	});

	const layerStyle = {
		id: "poi-labels",
		type: "symbol",
		source: "places",
		layout: {
			"text-field": ["get", "description"],
			"text-variable-anchor": ["top", "bottom", "left", "right"],
			"text-radial-offset": 0.5,
			"text-justify": "auto",
			"icon-image": ["get", "icon"],
		},
	};

	const mapRef = useRef<reactMapGl.MapRef | null>(null);

	const [mapReady, setMapReady] = useState(false);

	useEffect(() => {
		if (mapReady) return;
		if (mapRef.current) {
			setMapReady(true);
			mapRef.current.on("mousemove", onMouseMoveHandle);
		}
	});

	return (
		<reactMapGl.Map
			ref={mapRef}
			mapboxAccessToken={MAPBOX_TOKEN}
			initialViewState={{
				longitude: 35.9106,
				latitude: 31.9544,
				zoom: 12,
			}}
			style={{ height: "100%" }}
			// onMouseMove={onMouseMoveHandle}
			mapStyle="mapbox://styles/mapbox/streets-v9"
		>
			<DrawControl
				position="top-left"
				displayControlsDefault={false}
				controls={{
					polygon: true,
					trash: true,
				}}
				defaultMode="draw_polygon"
				userProperties={true}
				onCreate={onCreate}
				onUpdate={onUpdate}
				onDelete={onDelete}
				styles={[styles]}
			/>
			<reactMapGl.Source id="my-data" type="geojson" data={geojson}>
				<reactMapGl.Layer {...layerStyle} />
			</reactMapGl.Source>
		</reactMapGl.Map>
	);
}
