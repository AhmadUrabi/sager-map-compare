// import React, { useEffect, useState } from "react";
import { Map as Mapbox } from "react-map-gl";
import DrawControl, { drawRef } from "../drawControls";
import { MAPBOX_TOKEN, styles } from "../../constants";

export default function NormalMap() {

	const onCreate = (e: any) => {};

	const onUpdate = (e: any) => {};

	const onDelete = (e: any) => {};

	return (
		<Mapbox
			mapboxAccessToken={MAPBOX_TOKEN}
			initialViewState={{
				longitude: 35.9106,
				latitude: 31.9544,
				zoom: 12,
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
				}}
				defaultMode="draw_polygon"
				userProperties={true}
				onCreate={onCreate}
				onUpdate={onUpdate}
				onDelete={onDelete}
				styles={[styles]}
			/>
		</Mapbox>
	);
}
