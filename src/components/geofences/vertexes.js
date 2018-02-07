import React from 'react';
import Vertex from './vertex'
import PropTypes from 'prop-types';
import L from 'leaflet';
import MiddleVertex from "./middle-vertex";

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

    setRectPosition() {
        this._initialRectLatLngs = this.props.vertexes.slice();
        this._initialMiddleLatLngs = this.props.vertexes.slice();
    }

    updateVertexes(latLngDiff, index, newLatLng) {
        const corners = this._initialRectLatLngs;

        corners[index] = Object.assign({}, corners[index], newLatLng);

        this._initialRectLatLngs = corners;

        this.saveRect();
    }

    saveRect() {
        this.props.setVertexes(this._initialRectLatLngs);
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

        let optionsForMiddle = {
            radius: 5,
            color: '#2962ff',
            fillColor: '#ffffff',
            opacity: 1,
            fillOpacity: 0.7,
            weight: 2
        };

        let markerVertexes = this.props.vertexes.map(
            (vertex, index) => {
                return (
                    <Vertex
                        key={index}
                        index={index}
                        center={vertex}
                        options={options}
                        updateVertexes={this.updateVertexes}
                        setRectPosition={this.setRectPosition}
                        saveRect={this.saveRect}
                    />
                )
            }
        );

        let middleMarkers = this.props.middleMarkers.map(
            (marker, index) => {
                return (
                    <MiddleVertex
                        key={`middle${index}`}
                        index={index}
                        center={marker}
                        options={optionsForMiddle}
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
                {middleMarkers}
            </div>
        );
    }
}

export default Vertexes;

Vertexes.contextTypes = {
    map: PropTypes.object
};