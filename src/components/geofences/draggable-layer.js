import React from 'react'
import L from 'leaflet'

class DraggableLayer extends React.Component {

    constructor() {
        super();
        this._initDraggableLayer = this._initDraggableLayer.bind(this);
        this._dragMixinOnMouseDown = this._dragMixinOnMouseDown.bind(this);
        this._dragMixinOnMouseUp = this._dragMixinOnMouseUp.bind(this);
        this._dragMixinOnMouseMove = this._dragMixinOnMouseMove.bind(this);
    }

    render() {
        return null;
    }

    isPolygon() {
        // if it's a polygon, it means the coordinates array is multi dimensional
       return this._layer instanceof L.Polygon;
    }

    _initDraggableLayer() {
        // temporary coord variable for delta calculation
        this._tempDragCoord = null;

        // add CSS class
        const el = this._layer._path;
        L.DomUtil.addClass(el, 'leaflet-pm-draggable');

        this._layer.on('mousedown', this._dragMixinOnMouseDown, this);
    }

    _dragMixinOnMouseDown(e) {
        this.dragging = true;

        this._layer._map.dragging.disable();

        // save for delta calculation
        this._tempDragCoord = e.latlng;

        this._layer.on('mouseup', this._dragMixinOnMouseUp, this);
        this._layer._map.on('mousemove', this._dragMixinOnMouseMove, this);
    }

    _dragMixinOnMouseMove(e) {
        const el = this._layer._path;

        L.DomUtil.addClass(el, 'leaflet-pm-dragging');
        this._layer.bringToFront();

        this.clearVertexes();
        this._onLayerDrag(e);
    }

    _onLayerDrag(e) {
        const latlng = e.latlng;

        // delta coords (how far was dragged)
        const deltaLatLng = {
            lat: latlng.lat - this._tempDragCoord.lat,
            lng: latlng.lng - this._tempDragCoord.lng,
        };

        // move the coordinates by the delta
        const moveCoords = coords => coords.map((currentLatLng) => {
            return {
                lat: currentLatLng.lat + deltaLatLng.lat,
                lng: currentLatLng.lng + deltaLatLng.lng,
            };
        });

        // create the new coordinates array
        let newCoords;

        if (this.isPolygon()) {
            newCoords = this._layer._latlngs.map(moveCoords, this);
        } else {
            newCoords = moveCoords(this._layer._latlngs);
        }

        // set new coordinates and redraw
        this._layer.setLatLngs(newCoords);

        // save current latlng for next delta calculation
        this._tempDragCoord = latlng;
    }

    _dragMixinOnMouseUp() {
        this.dragging = false;

        const el = this._layer._path;

        this._layer._map.dragging.enable();

        this._layer._map.off('mousemove', this._dragMixinOnMouseMove, this);
        this._layer.off('mouseup', this._dragMixinOnMouseUp, this);

        this._initVertexes();

        L.DomUtil.removeClass(el, 'leaflet-pm-dragging');
    }
}

export default DraggableLayer;