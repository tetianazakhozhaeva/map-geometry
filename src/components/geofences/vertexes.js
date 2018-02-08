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
        this._initialMiddleLatLngs = this.props.middleMarkers.slice();

        this._helpingPolygon.setLatLngs(this._initialRectLatLngs);
    }

    updateVertexes(index, newLatLng) {

        const corners = this._initialRectLatLngs.slice();
        const middleVertexes = this._initialMiddleLatLngs.slice();

        let markerLatLng = Object.assign({}, corners[index], newLatLng);

        // todo detect next and prev vertexes
        const nextMarkerIndex = (index + 1) % corners.length;
        const prevMarkerIndex = (index + corners.length - 1) % corners.length;


        // get latlng of prev and next marker
        const prevMarkerLatLng = corners[prevMarkerIndex];
        const nextMarkerLatLng = corners[nextMarkerIndex];

        if (markerLatLng._middleMarkerNext) {
            const middleMarkerNextLatLng = calcMiddleLatLng(markerLatLng, nextMarkerLatLng, this.context.map);
            markerLatLng._middleMarkerNext = Object.assign({}, corners[index]._middleMarkerNext, middleMarkerNextLatLng);
        }

        if (markerLatLng._middleMarkerPrev) {
            const middleMarkerPrevLatLng = calcMiddleLatLng(markerLatLng, prevMarkerLatLng, this.context.map);
            markerLatLng._middleMarkerPrev = Object.assign({}, corners[index]._middleMarkerPrev, middleMarkerPrevLatLng);
        }

        // todo update neighbor middle markers positions

        middleVertexes.splice(markerLatLng._middleMarkerNext.index, 1, markerLatLng._middleMarkerNext);
        middleVertexes.splice(markerLatLng._middleMarkerPrev.index, 1, markerLatLng._middleMarkerPrev);

        corners[index] = Object.assign({}, markerLatLng);


        this._helpingPolygon.setLatLngs(corners);


        this._newRectLatLngs = corners;

        this._newMiddleLatLngs = middleVertexes;

        this.saveRect(this._newRectLatLngs,
                      this._newMiddleLatLngs);
    }

    saveRect(rectLatLngs, middleLatLngs) {
        this.props.setVertexes(rectLatLngs);
        this.props.setMiddleMarkers(middleLatLngs);
    }

    vertexDragend(){
        if(this.hasSelfIntersection()){
           this.saveRect(this._initialRectLatLngs, this._initialMiddleLatLngs);
        }
    }


    updateMiddleVertexes(index, newLatLng){
        const corners = this._initialRectLatLngs.slice();
        const middleVertexes = this._initialMiddleLatLngs.slice();

        let middleLatLng = Object.assign({}, middleVertexes[index], newLatLng);

// todo get left marker
        let rightMarkerIndex = middleLatLng.rightMarker.index;

        corners.splice(rightMarkerIndex, 0, middleLatLng);

// todo left marker middle
//         let leftMarker = Object.assign({}, middleLatLng.leftMarker);
// //
// // todo right marker middle
//         let rightMarker = Object.assign({}, middleLatLng.rightMarker);
//
//         if (leftMarker._middleMarkerNext) {
//             const middleMarkerNextLatLng = calcMiddleLatLng(markerLatLng, nextMarkerLatLng, this.context.map);
//             markerLatLng._middleMarkerNext = Object.assign({}, corners[index]._middleMarkerNext, middleMarkerNextLatLng);
//         }
//
//         if (markerLatLng._middleMarkerPrev) {
//             const middleMarkerPrevLatLng = calcMiddleLatLng(markerLatLng, prevMarkerLatLng, this.context.map);
//             markerLatLng._middleMarkerPrev = Object.assign({}, corners[index]._middleMarkerPrev, middleMarkerPrevLatLng);
//         }


        this._helpingPolygon.setLatLngs(corners);


        this._newRectLatLngs = corners;

        this._newMiddleLatLngs = middleVertexes;

        this.saveRect(this._newRectLatLngs,
            this._newMiddleLatLngs);
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
                        vertexDragend={this.vertexDragend}
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
                        updateMiddleVertexes={this.updateMiddleVertexes}
                        setRectPosition={this.setRectPosition}
                        saveRect={this.saveRect}
                        vertexDragend={this.vertexDragend}
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