import DrawMap from "./MapDraw";
import SearchAddressMap from "./MapSearchAddress";
import LocationMap from "./MapLocation"

export const MapDraw = props => <DrawMap {...props} />
export const MapSearchAddress = props => <SearchAddressMap {...props} />
export const MapLocation = props => <LocationMap {...props} />