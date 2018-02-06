import React from 'react';
import Vertex from './vertex'
import PropTypes from 'prop-types';
import L from 'leaflet';

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
        this._rect = L.rectangle([{lat: 0, lng: 0}, {lat: 0, lng: 0}], {color: 'red'});
    }

    setRectPosition() {
        let initialLatLngs = this.props.vertexes;
        this._rect.setLatLngs(initialLatLngs);

        this._initialRectLatLngs = this.props.vertexes.slice();
    }

    updateVertexes(latLngDiff, index, newLatLng) {
        const corners = this._initialRectLatLngs;

        let opposite = index + 2;
        opposite = (opposite > 3) ? opposite - 4 : opposite;

        let _oppositeCornerLatLng = corners[opposite];

        this._rect.setBounds(L.latLngBounds([newLatLng, _oppositeCornerLatLng]));

        this.saveRect();
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