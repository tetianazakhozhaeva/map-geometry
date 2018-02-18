/**
 * Created by tetiana on 23.01.18.
 */
import PropTypes from 'prop-types';
import L from 'leaflet';
import DrawRectangle from './draw-rectangle';

class EditRectangle extends DrawRectangle {
  constructor() {
    super();

    this.init = this.init.bind(this);
    this.clearVertexes = this.clearVertexes.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  init() {
    this._layer = L.rectangle([{ lat: 0, lng: 0 }, { lat: 0, lng: 0 }], { color: '#2962ff' });
    this._layer.setLatLngs(this.props.vertexes);
    this._layer.setStyle({ dashArray: '5, 5' });
    this._layer.addTo(this.context.map);

    this._layer.bringToBack();

    this._initVertexes();
    this._initDraggableLayer();
  }
}

export default EditRectangle;

EditRectangle.contextTypes = {
  map: PropTypes.object,
};
