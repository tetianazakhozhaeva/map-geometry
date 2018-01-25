import React from 'react'
import L from 'leaflet';

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
        const isPoly = this._layer instanceof L.Polygon;
        return isPoly;
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
        // todo start dragging
        this.dragging = true;

        // todo disabale map dragging
        this._layer._map.dragging.disable();

        // save for delta calculation
        this._tempDragCoord = e.latlng;

        this._layer.on('mouseup', this._dragMixinOnMouseUp, this);

        // listen to mousemove on map (instead of polygon),
        // otherwise fast mouse movements stop the drag
        this._layer._map.on('mousemove', this._dragMixinOnMouseMove, this);
    }

    _dragMixinOnMouseMove(e) {
        const el = this._layer._path;

        L.DomUtil.addClass(el, 'leaflet-pm-dragging');

        // bring it to front to prevent drag interception
        this._layer.bringToFront();


        //todo hide markers
        this.clearVertexes();

        this._onLayerDrag(e);
    }

    _onLayerDrag(e) {
        // latLng of mouse event
        const latlng = e.latlng;

        // delta coords (how far was dragged)
        const deltaLatLng = {
            lat: latlng.lat - this._tempDragCoord.lat,
            lng: latlng.lng - this._tempDragCoord.lng,
        };

        // move the coordinates by the delta
        const moveCoords = coords => coords.map((currentLatLng) => {
            const c = {
                lat: currentLatLng.lat + deltaLatLng.lat,
                lng: currentLatLng.lng + deltaLatLng.lng,
            };
            return c;
        });

        // create the new coordinates array
        let newCoords;

        if (this.isPolygon()) {
            newCoords = this._layer._latlngs.map(moveCoords, this);
        } else {
            newCoords = moveCoords(this._layer._latlngs);
        }

        // todo
        console.log('newCoords')
        console.log(newCoords)

        // set new coordinates and redraw
        this._layer.setLatLngs(newCoords);

        // save current latlng for next delta calculation
        this._tempDragCoord = latlng;
    }


    _dragMixinOnMouseUp() {
        // todo start dragging
        this.dragging = false;

        const el = this._layer._path;

        // todo re-enable map drag
        this._layer._map.dragging.enable();

        // if mouseup event fired, it's safe to cache the map draggable state on the next mouse down
        // this._safeToCacheDragState = true

        //todo clear up mousemove event
        this._layer._map.off('mousemove', this._dragMixinOnMouseMove, this);

        // clear up mouseup event
        this._layer.off('mouseup', this._dragMixinOnMouseUp, this);

        // show markers again
        this._initVertexes();

        L.DomUtil.removeClass(el, 'leaflet-pm-dragging');

        return true;
    }
}

export default DraggableLayer;