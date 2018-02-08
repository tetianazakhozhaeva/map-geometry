import React from 'react';
import Vertex from './vertex'
import PropTypes from 'prop-types';
import MiddleVertex from "./middle-vertex";
import L from 'leaflet';
import {calcMiddleLatLng} from './geo-helper';

import kinks from '@turf/kinks';

class Vertexes extends React.Component {

    constructor() {
        super();

        this.state = {
            latLngDiff: {lat: 0, lng: 0}
        };

        this.updateVertexes = this.updateVertexes.bind(this);
        this.setRectPosition = this.setRectPosition.bind(this);
        this.saveRect = this.saveRect.bind(this);
        this.vertexDragend = this.vertexDragend.bind(this);
        this.updateMiddleVertexes = this.updateMiddleVertexes.bind(this);
    }

    hasSelfIntersection() {
        // check for self intersection of the layer and return true/false
        const selfIntersection = kinks(this._helpingPolygon.toGeoJSON());
        return selfIntersection.features.length > 0;
    }

    setRectPosition() {
        this._helpingPolygon = L.polygon([[0, 0], [0, 0]]);

        this._initialRectLatLngs = this.props.vertexes.slice();

        this._helpingPolygon.setLatLngs(this._initialRectLatLngs);
    }

    updateVertexes(index, newLatLng) {

        const corners = this._initialRectLatLngs.slice();

        let markerLatLng = Object.assign({}, corners[index], newLatLng);

        // todo detect next and prev vertexes
        const nextMarkerIndex = (index + 2) % corners.length;
        const prevMarkerIndex = (index + corners.length - 2) % corners.length;

        const nextMiddleIndex = (index + 1) % corners.length;
        const prevMiddleIndex = (index + corners.length - 1) % corners.length;

        // get latlng of prev and next marker
        const prevMarkerLatLng = corners[prevMarkerIndex];
        const nextMarkerLatLng = corners[nextMarkerIndex];

        // todo calc middles
        const middleMarkerNextLatLng = calcMiddleLatLng(markerLatLng, nextMarkerLatLng, this.context.map);

        let _middleMarkerNext = Object.assign({}, corners[nextMiddleIndex], middleMarkerNextLatLng);

        const middleMarkerPrevLatLng = calcMiddleLatLng(markerLatLng, prevMarkerLatLng, this.context.map);
        let _middleMarkerPrev = Object.assign({}, corners[prevMiddleIndex], middleMarkerPrevLatLng);


        // todo update neighbor middle markers positions

        corners.splice(nextMiddleIndex, 1, _middleMarkerNext);
        corners.splice(prevMiddleIndex, 1, _middleMarkerPrev);

        corners[index] = Object.assign({}, markerLatLng);


        this._helpingPolygon.setLatLngs(corners);


        this._newRectLatLngs = corners;


        this.saveRect(this._newRectLatLngs);
    }

    saveRect(rectLatLngs) {
        this.props.setVertexes(rectLatLngs);
    }

    vertexDragend() {
        if (this.hasSelfIntersection()) {
            this.saveRect(this._initialRectLatLngs);
        }
    }

    updateMiddleVertexes(index, newLatLng) {
        const corners = this._initialRectLatLngs.slice();

        let middleLatLng = Object.assign({}, corners[index], newLatLng, {isMiddle: false});

        // todo detect next and prev vertexes
        const nextMarkerIndex = (index + 1) % corners.length;
        const prevMarkerIndex = (index + corners.length - 1) % corners.length;

        let nextMarkerLatLng = corners[nextMarkerIndex];
        let prevMarkerLatLng = corners[prevMarkerIndex];


        // todo calc middles
        const middleMarkerNextLatLng = calcMiddleLatLng(middleLatLng, nextMarkerLatLng, this.context.map);
        let _middleMarkerNext = Object.assign({isMiddle: true}, middleMarkerNextLatLng);

        const middleMarkerPrevLatLng = calcMiddleLatLng(middleLatLng, prevMarkerLatLng, this.context.map);
        let _middleMarkerPrev = Object.assign({isMiddle: true}, middleMarkerPrevLatLng);


        corners.splice(index, 1, _middleMarkerPrev, middleLatLng, _middleMarkerNext);

        this._helpingPolygon.setLatLngs(corners);

        this._newRectLatLngs = corners;

        this.saveRect(this._newRectLatLngs);
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
                if (!vertex.isMiddle) {
                    return (
                        <Vertex
                            key={index}
                            index={index}
                            center={vertex}
                            options={options}
                            updateVertexes={this.updateVertexes}
                            setRectPosition={this.setRectPosition}
                            saveRect={this.saveRect}
                            vertexDragend={this.vertexDragend}
                        />
                    )
                } else {
                    return (
                        <MiddleVertex
                            key={`middle${index}`}
                            index={index}
                            center={vertex}
                            options={optionsForMiddle}
                            updateMiddleVertexes={this.updateMiddleVertexes}
                            setRectPosition={this.setRectPosition}
                            saveRect={this.saveRect}
                            vertexDragend={this.vertexDragend}
                        />
                    )
                }
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