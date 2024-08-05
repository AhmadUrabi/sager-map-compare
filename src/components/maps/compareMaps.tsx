import MapboxCompare from "mapbox-gl-compare";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMapGL from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "mapbox-gl-compare/dist/mapbox-gl-compare.css";
import { MAPBOX_TOKEN, styles } from "../../constants";
import DrawControl from "../drawCompareControls";


const elements = [
	{
		id: "590963d945ab5dc022a830b92125aa0f",
		type: "Feature",
		properties: {
			fill: "#3bb2d0",
		},
		geometry: {
			coordinates: [
				[
					[36.20254546208673, 34.717135931546366],
					[33.587799368336704, 34.717135931546366],
					[33.433990774586135, 32.94681480397939],
					[38.202057180836164, 33.25971984320476],
					[36.20254546208673, 34.717135931546366],
				],
			],
			type: "Polygon",
		},
	},
	{
    "id": "facd53609de9de026d38f68269b7b818",
    "type": "Feature",
    "properties": {},
    "geometry": {
        "coordinates": [
            [
                [
                    35.78589772724291,
                    32.090506045622945
                ],
                [
                    36.09607943296635,
                    32.150950765434814
                ],
                [
                    36.20862323769785,
                    32.037002361604706
                ],
                [
                    36.02471019094088,
                    31.78068309123755
                ],
                [
                    35.79687761063113,
                    31.815677739292568
                ],
                [
                    35.78589772724291,
                    32.090506045622945
                ]
            ]
        ],
        "type": "Polygon"
    }
},
{
    "id": "e3e5f74d0db4a2cce5c96e0a9a406ad5",
    "type": "Feature",
    "properties": {},
    "geometry": {
        "coordinates": [
            [
                [
                    36.16470370414362,
                    32.33900237082911
                ],
                [
                    36.1784285583785,
                    32.25779327936968
                ],
                [
                    36.41998599292461,
                    32.213677887927474
                ],
                [
                    36.45841558478398,
                    32.29260608488687
                ],
                [
                    36.39253628445337,
                    32.41086962303244
                ],
                [
                    36.16470370414362,
                    32.33900237082911
                ]
            ]
        ],
        "type": "Polygon"
    }
}
];

export default function CompareMap() {
  // We store the map refs in state, and create callback functions to raise flags when the refs are ready
  // This is to properly initialize the map compare plugin without referencing undefined objects
  //
  //
  // We also create two Draw refs elements to each map. We modified the draw controls element to accept a setRef prop,
  // which sets the before/after drawRef state when the ref is ready.
  //
  //
  // We use a combination of useEffect and flags to check if all refs are ready so that we can use them in our mapbox
  // compare logic and out add function to add the elements to the map.
  //
  //
  // This is a simple POC that still needs peopwe optimization and testing.


  // Map Refs
	const beforeRef = useRef();
	const afterRef = useRef();

  // Map Ready State Flags
	const [beforeReady, setBeforeReady] = useState(false);
	const [afterReady, setAfterReady] = useState(false);

	// Callback functions to set Refs and flags
	const beforeRefcb = useCallback((ref: any) => {
		if (!ref) return;
		beforeRef.current = ref;
		setBeforeReady(true);
	}, []);

	const afterRefcb = useCallback((ref: any) => {
		if (!ref) return;
		afterRef.current = ref;
		setAfterReady(true);
	}, []);

	const mapStyle: React.CSSProperties = {
		position: "absolute",
		width: "100%",
		height: "100%",
	};


	const [beforeDrawRef, setBeforeDrawRef] = useState();
	const [afterDrawRef, setAfterDrawRef] = useState();

	useEffect(() => {
		if (!beforeDrawRef) return;
		console.log("true before")
		// @ts-ignore since it has type: never
    elements.map((el) => beforeDrawRef.add(el));
	}, [beforeDrawRef]);

	useEffect(() => {
		if (!afterDrawRef) return;
		console.log("true after")
		// @ts-ignore since it has type: never
    elements.map((el) => afterDrawRef.add(el));
	}, [afterDrawRef]);

	useEffect(() => {
		if (!beforeReady || !afterReady) return;
		if (!beforeRef.current || !afterRef.current) return;

		// @ts-ignore since it has type: never
		const beforeMap = beforeRef.current.getMap();
		// @ts-ignore since it has type: never
		const afterMap = afterRef.current.getMap();

		const map = new MapboxCompare(beforeMap, afterMap, "#comparison-container");
		return () => map.remove();
	}, [beforeReady, afterReady]);


	return (
		<div className="w-full h-full relative" id="comparison-container">
			<ReactMapGL
				ref={beforeRefcb}
				initialViewState={{
					longitude: 35.9106,
					latitude: 31.9544,
					zoom: 8,
				}}
				style={mapStyle}
				interactive={true}
				mapStyle="mapbox://styles/mapbox/light-v10"
				mapboxAccessToken={MAPBOX_TOKEN}
			>
				<DrawControl
					position="top-left"
					setRef={setBeforeDrawRef}
					controls={{
						polygon: false,
						trash: false,
						combine_features: false,
						uncombine_features: false,
						line_string: false,
						point: false,
					}}
					onCreate={(evt: any) => console.log(evt)}
					onUpdate={(evt: any) => console.log(evt)}
					onDelete={(evt: any) => console.log(evt)}
				/>
			</ReactMapGL>
			<ReactMapGL
				ref={afterRefcb}
				initialViewState={{
					longitude: 35.9106,
					latitude: 31.9544,
					zoom: 8,
				}}
				style={mapStyle}
				mapStyle="mapbox://styles/mapbox/dark-v10"
				mapboxAccessToken={MAPBOX_TOKEN}
			>
				<DrawControl
					setRef={setAfterDrawRef}
					position="top-right"
					controls={{
						polygon: false,
						trash: false,
						combine_features: false,
						uncombine_features: false,
						line_string: false,
						point: false,
					}}
					onCreate={(evt: any) => console.log(evt)}
					onUpdate={(evt: any) => console.log(evt)}
					onDelete={(evt: any) => console.log(evt)}
					styles={[styles]}
				/>
			</ReactMapGL>
		</div>
	);
}
