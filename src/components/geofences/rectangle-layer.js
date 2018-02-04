import React from 'react';
import PropTypes from 'prop-types';
import DrawRectangle from './draw-rectangle';
import EditRectangle from './edit-rectangle';
import Vertexes from './vertexes';
import './css/layers.css';


class RectangleLayer extends React.Component {

    constructor() {
        super();

        this.state = {
            vertexes: [],
        };

        this.setVertexes = this.setVertexes.bind(this);
    }

    setVertexes(latLngs) {
        const arrXY = this.convertLatLngToXY(latLngs);
        this.props.setCoordinates(arrXY);
    }

    convertXYToLatLng(arr){
        if(!arr)
            return [];
        return arr.map(item => {
            return {lat: item.x, lng: item.y}
        });
    }

    convertLatLngToXY(arr){
        if(!arr)
            return [];
        return arr.map(item => {
            return {x: item.lat, y: item.lng}
        });
    }

    render() {

        const latLngVertexes = this.convertXYToLatLng(this.props.notice.coordinates);

        return (
            <div>
                {this.props.isCreate ?
                    <DrawRectangle
                        setVertexes={this.setVertexes}
                        vertexes={latLngVertexes}
                    />
                    :
                    <EditRectangle
                        setVertexes={this.setVertexes}
                        vertexes={latLngVertexes}
                    />
                }
                <Vertexes
                    setVertexes={this.setVertexes}
                    vertexes={latLngVertexes}
                />
            </div>
        )
    }
}

RectangleLayer.contextTypes = {
    map: PropTypes.object
};

export default RectangleLayer;