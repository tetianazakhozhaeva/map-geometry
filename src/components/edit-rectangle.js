/**
 * Created by tetiana on 23.01.18.
 */
import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import DraggableLayer from './draggable-layer'

class EditRectangle extends DraggableLayer {

    constructor() {
        super();

        this.init = this.init.bind(this);

        this.clearVertexes = this.clearVertexes.bind(this);
    }

    componentDidMount() {

        console.log('EditRectangle componentDidMount')

        this.init();
    }

    clearVertexes(){
        this.props.setVertexes([]);
    }

    _initVertexes(){
        let vertexes = this._layer.getLatLngs();
        console.log(vertexes);
        this.props.setVertexes(vertexes[0]);
    }


    init() {
        const center = this.context.map.getCenter();

        let currentPoint = this.context.map.latLngToContainerPoint(center);
        let width = 100;
        let height = 100;
        let xDifference = width / 2;
        let yDifference = height / 2;
        let southWest = L.point((currentPoint.x - xDifference), (currentPoint.y - yDifference));
        let northEast = L.point((currentPoint.x + xDifference), (currentPoint.y + yDifference));
        let bounds = L.latLngBounds(this.context.map.containerPointToLatLng(southWest), this.context.map.containerPointToLatLng(northEast));
        this._layer = L.rectangle(bounds, {color: '#2962ff'});
        this._layer.addTo(this.context.map);
        this.context.map.fitBounds(this._layer.getBounds());

        this._initVertexes();

        this._initDraggableLayer();
    }



    render() {
        return null;
    }
}

export default EditRectangle;

EditRectangle.contextTypes = {
    map: PropTypes.object
}