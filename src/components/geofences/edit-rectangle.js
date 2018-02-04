/**
 * Created by tetiana on 23.01.18.
 */
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
        this._layer = L.rectangle([{lat: 0, lng:0}, {lat: 0, lng:0}], {color: '#2962ff'});
        this._layer.setLatLngs(this.props.vertexes);
        this._layer.setStyle({dashArray: '5, 5'})
        this._layer.addTo(this.context.map);

        this._layer.bringToBack();

        this._initDraggableLayer();
    }

    render() {
        return null;
    }

    componentWillUnmount() {
        this.context.map.removeLayer(this._layer);
    }
}

export default EditRectangle;

EditRectangle.contextTypes = {
    map: PropTypes.object
};