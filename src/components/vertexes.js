import React from 'react';
import Vertex from './vertex'
import PropTypes from 'prop-types';
import L from 'leaflet';

class Vertexes extends React.Component {


    constructor() {
        super();

        this.updateVertexes = this.updateVertexes.bind(this);
    }

    updateVertexes(latLngDiff) {
        // todo !!!
        // let rect = L.rectangle([0, 0]);

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
                        center={vertex}
                        options={options}
                        updateVertexes={this.updateVertexes}
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
}