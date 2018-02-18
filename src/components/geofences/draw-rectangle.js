/**
 * Created by tetiana on 23.01.18.
 */
import { array, object, func } from 'prop-types';
import L from 'leaflet';
import DraggableLayer from './draggable-layer';

import { calcMiddleLatLng } from './geo-helper';

class DrawRectangle extends DraggableLayer {
    static propTypes = {
      vertexes: array,
      setVertexes: func,
    };

    static contextTypes = {
      map: object,
    };

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
        const rareVertexes = nextProps.vertexes.filter(v => !v.isMiddle);

        this._layer.setLatLngs(rareVertexes);
      }
    }

    clearVertexes() {
      this.props.setVertexes([]);
    }

    _initVertexes() {
      const vertexes = this._layer.getLatLngs();
      const mainVertexes = vertexes[ 0 ];

      // detect middle points
      const middlePoints = this.detectMiddlePoints(mainVertexes);

      const allVertexes = [];

      const totalAmount = mainVertexes.length * 2;

      for (let i = 0, k = 0; i < totalAmount; i += 2, k++) {
        allVertexes[ i ] = mainVertexes[ k ];
        allVertexes[ i + 1 ] = middlePoints[ k ];
      }

      this.props.setVertexes(allVertexes);
    }

  // detect middle points
    detectMiddlePoints(mainMarkers) {
      return mainMarkers.map((m, index) => {
        let nextIndex;
        if (this.isPolygon()) {
          nextIndex = (index + 1) % mainMarkers.length;
        } else {
          nextIndex = index + 1;
        }

        return this._createMiddleMarker(mainMarkers[ index ], mainMarkers[ nextIndex ]);
      });
    }

  // creates the middle markes between coordinates
    _createMiddleMarker(leftM, rightM) {
    // cancel if there are no two markers
      if (!leftM || !rightM) {
        return false;
      }

      const latlng = calcMiddleLatLng(leftM, rightM, this.context.map);

      const middleMarker = {
        lat: latlng.lat,
        lng: latlng.lng,
        isMiddle: true,
      };

      return middleMarker;
    }

    init() {
      const center = this.context.map.getCenter();

      const currentPoint = this.context.map.latLngToContainerPoint(center);
      const width = 100;
      const height = 100;
      const xDifference = width / 2;
      const yDifference = height / 2;
      const southWest = L.point((currentPoint.x - xDifference), (currentPoint.y - yDifference));
      const northEast = L.point((currentPoint.x + xDifference), (currentPoint.y + yDifference));
      const bounds = L.latLngBounds(
        this.context.map.containerPointToLatLng(southWest),
        this.context.map.containerPointToLatLng(northEast),
      );
      this._layer = L.rectangle(bounds, { color: '#2962ff' });
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
