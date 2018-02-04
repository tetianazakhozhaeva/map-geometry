/**
 * Created by tetiana on 23.01.18.
 */
import PropTypes from 'prop-types';
import L from 'leaflet';
import DraggableLayer from './draggable-layer'

class DrawRectangle extends DraggableLayer {

    constructor() {
        super();

        this.init = this.init.bind(this);
        this.clearVertexes = this.clearVertexes.bind(this);
    }

    componentDidMount() {
        this.init();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.vertexes !== this.props.vertexes && !this.dragging) {
            this._layer.setLatLngs(nextProps.vertexes);
        }
    }

    clearVertexes() {
        this.props.setVertexes([]);
    }

    _initVertexes() {
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

        this._layer.bringToBack();

        this._initVertexes();

        this._initDraggableLayer();
    }

    render() {
        return null;
    }

    componentWillUnmount() {
        this.context.map.removeLayer(this._layer);
    }
}

export default DrawRectangle;

DrawRectangle.contextTypes = {
    map: PropTypes.object
};