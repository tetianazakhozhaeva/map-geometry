import React from 'react';
import Vertex from './vertex'
import PropTypes from 'prop-types';
import L from 'leaflet';

const RADIUS_MAX_LIMIT = 500000,
      RADIUS_MIN_LIMIT = 100;

class Vertexes extends React.Component {

    constructor() {
        super();

        this.state = {
            latLngDiff: {lat: 0, lng: 0}
        };

        this.updateVertexes = this.updateVertexes.bind(this);
        this.setRectPosition = this.setRectPosition.bind(this);
        this.saveRect = this.saveRect.bind(this);
    }

    componentDidMount() {
        // help rectangle
        this._rect = L.rectangle([{lat: 0, lng: 0}, {lat: 0, lng: 0}], {color: 'red'});
    }

    setRectPosition(initialLatLng) {
        let initialLatLngs = this.props.vertexes;

        this._rect.setLatLngs(initialLatLngs);

        let bounds = this._rect.getBounds();
        this._center = bounds.getCenter();

        this._initialRadius = this.getDistance(this._center, initialLatLng);
    }

    // todo get distance
    getDistance(center, latLng) {
        return center.distanceTo(latLng);
    }

    // todo getOuterPointOnCircle
    getOuterPointOnCircle(bearing, center, radius) {
        const EARTH_RADIUS = 6371e3,
            brng = bearing * Math.PI / 180,
            d = radius,
            startLat = center.lat * Math.PI / 180,
            startLng = center.lng * Math.PI / 180;

        let lat = Math.asin(Math.sin(startLat) * Math.cos(d / EARTH_RADIUS) +
            Math.cos(startLat) * Math.sin(d / EARTH_RADIUS) * Math.cos(brng));
        let lng = startLng + Math.atan2(Math.sin(brng) * Math.sin(d / EARTH_RADIUS) * Math.cos(startLat),
            Math.cos(d / EARTH_RADIUS) - Math.sin(startLat) * Math.sin(lat));

        return {lat: lat * 180 / Math.PI, lng: lng * 180 / Math.PI};
    }

    updateVertexes(newLatLng) {

        let newRadius = this.getDistance(this._center, newLatLng);

        if (newRadius !== this._initialRadius
            && newRadius <= RADIUS_MAX_LIMIT
            && newRadius >= RADIUS_MIN_LIMIT) {
            // detect new corner coords
            let corner1 = this.getOuterPointOnCircle(45, this._center, newRadius),
                corner2 = this.getOuterPointOnCircle(225, this._center, newRadius);

            this._rect.setBounds(L.latLngBounds([corner1, corner2]));

            this.saveRect();
        }
    }

    saveRect() {
        let coords = this._rect.getLatLngs()[0];

        this._rect.setLatLngs([]);

        this.props.setVertexes(coords);
    }

    render() {

        let options = {
            radius: 10,
            color: '#2962ff',
            fillColor: '#ffffff',
            opacity: 1,
            fillOpacity: 1,
            weight: 1
        };

        if(!this.props.vertexes)
            return null;

        let markerVertexes = this.props.vertexes.map(
            (vertex, index) => {
                return (
                    <Vertex
                        key={index}
                        center={vertex}
                        options={options}
                        updateVertexes={this.updateVertexes}
                        setRectPosition={this.setRectPosition}
                        saveRect={this.saveRect}
                    />
                )
            }
        );

        return (
            <div>
                {markerVertexes}
            </div>
        );
    }
}

export default Vertexes;

Vertexes.contextTypes = {
    map: PropTypes.object
};