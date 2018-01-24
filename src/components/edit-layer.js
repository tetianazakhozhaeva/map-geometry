import React from 'react';
import {CircleMarker} from 'react-leaflet';
import EditRectangle from './edit-rectangle';
import Vertexes from './vertexes';
import './css/layers.css'

class EditLayer extends React.Component {

    constructor() {
        super();

        this.state = {
            vertexes: [],
        };

        this.setVertexes = this.setVertexes.bind(this);
    }

    setVertexes(latLngs) {
        this.setState({
            vertexes: latLngs,
        })
    }

    render() {
        return (
            <div>
                <EditRectangle
                    setVertexes={this.setVertexes}
                />
                <Vertexes
                    vertexes = {this.state.vertexes}
                />
            </div>
        )
    }
}

export default EditLayer;