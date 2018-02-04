import React from 'react';
import PropTypes from 'prop-types';
import DrawRectangle from './draw-rectangle';
import EditRectangle from './edit-rectangle';
import Vertexes from './vertexes';
import './css/layers.css'

class RectangleLayer extends React.Component {

    constructor() {
        super();

        this.state = {
            vertexes: [],
        };

        this.setVertexes = this.setVertexes.bind(this);
    }

    setVertexes(latLngs) {
        this.props.setCoordinates(latLngs);
    }

    render() {
        return (
            <div>
                {this.props.isCreate ?
                    <DrawRectangle
                        setVertexes={this.setVertexes}
                        vertexes={this.props.notice.coordinates}
                    />
                    :
                    <EditRectangle
                        setVertexes={this.setVertexes}
                        vertexes={this.props.notice.coordinates}
                    />
                }
                <Vertexes
                    vertexes={this.props.notice.coordinates}
                    setVertexes={this.setVertexes}
                />
            </div>
        )
    }
}

RectangleLayer.contextTypes = {
    map: PropTypes.object
};

export default RectangleLayer;