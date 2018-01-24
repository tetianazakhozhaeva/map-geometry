import React from 'react';
import L from 'leaflet';
import PropTypes from 'prop-types';

class Vertex extends React.Component{

    componentDidMount(){
        this.vertex = L.circleMarker(this.props.center, this.props.options);
        this.vertex.addTo(this.context.map);

        this.init();
    }

    init(){
       this.vertex.on('mousedown', this.handleMouseDown)
    }

    handleMouseDown(e){
        this._currentLatLng = e.latlng;


        this.vertex.off('mousedown', this.handleMouseDown);

        this.context.map.on('mousemove', this.handleMouseMove);

        this.vertex.on('mouseup', this.handleMouseUp);
    }

    handleMouseMove(e){

    }

    handleMouseUp(e){

        this.context.map.off('mousemove', this.handleMouseMove);
        this.vertex.off('mouseup', this.handleMouseUp);
    }


    render(){
        return null;
    }
}

export default Vertex;

Vertex.contextTypes = {
    map: PropTypes.object
}