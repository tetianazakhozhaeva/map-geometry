import React from 'react'
import L from 'leaflet'
import PropTypes from 'prop-types';

class MiddleVertex extends React.Component {

    constructor() {
        super();

        // this.handleMouseDown = this.handleMouseDown.bind(this);
        // this.handleMouseMove = this.handleMouseMove.bind(this);
        // this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    componentDidMount() {
        this.vertex = L.circleMarker(this.props.center, this.props.options);
        this.vertex.addTo(this.context.map);

        // this.init();
    }

    render() {
        return null;
    }

    componentWillUnmount() {
        // this.vertex.off('mousedown', this.handleMouseDown);
        // this.context.map.off('mousemove', this.handleMouseMove);
        // this.vertex.off('mouseup', this.handleMouseUp);

        this.vertex.remove();
    }
}

export default MiddleVertex;

MiddleVertex.contextTypes = {
    map: PropTypes.object
};