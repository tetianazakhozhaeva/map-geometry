import React from 'react';
import { array, func, object } from 'prop-types';
import kinks from '@turf/kinks';
import L from 'leaflet';
import MiddleVertex from './middle-vertex';
import { calcMiddleLatLng } from './geo-helper';
import Vertex from './vertex';

class Vertexes extends React.Component {
    static propTypes = {
      vertexes: array.isRequired,
      setVertexes: func.isRequired,
    };
    static contextTypes = {
      map: object,
    };

    constructor() {
      super();

      this.updateVertexes = this.updateVertexes.bind(this);
      this.setRectPosition = this.setRectPosition.bind(this);
      this.saveRect = this.saveRect.bind(this);
      this.vertexDragend = this.vertexDragend.bind(this);
      this.updateMiddleVertexes = this.updateMiddleVertexes.bind(this);
    }

    setRectPosition() {
      this._helpingPolygon = L.polygon([[0, 0], [0, 0]]);

      this._initialRectLatLngs = this.props.vertexes.slice();

      this._helpingPolygon.setLatLngs(this._initialRectLatLngs);
    }

    hasSelfIntersection() {
    // check for self intersection of the layer and return true/false
      const selfIntersection = kinks(this._helpingPolygon.toGeoJSON());
      return selfIntersection.features.length > 0;
    }

    updateVertexes(index, newLatLng) {
      const corners = this._initialRectLatLngs.slice();

      const markerLatLng = Object.assign({}, corners[ index ], newLatLng);

      // detect next and prev vertexes
      const nextMarkerIndex = (index + 2) % corners.length;
      const prevMarkerIndex = (index + corners.length - 2) % corners.length;

      const nextMiddleIndex = (index + 1) % corners.length;
      const prevMiddleIndex = (index + corners.length - 1) % corners.length;

      // get latlng of prev and next marker
      const prevMarkerLatLng = corners[ prevMarkerIndex ];
      const nextMarkerLatLng = corners[ nextMarkerIndex ];

      // calc middles
      const middleMarkerNextLatLng = calcMiddleLatLng(
        markerLatLng,
        nextMarkerLatLng, this.context.map,
      );

      const _middleMarkerNext = Object.assign(
        {}, corners[ nextMiddleIndex ],
        middleMarkerNextLatLng,
      );

      const middleMarkerPrevLatLng = calcMiddleLatLng(
        markerLatLng,
        prevMarkerLatLng, this.context.map,
      );
      const _middleMarkerPrev = Object.assign(
        {}, corners[ prevMiddleIndex ],
        middleMarkerPrevLatLng,
      );

      // update neighbor middle markers positions
      corners.splice(nextMiddleIndex, 1, _middleMarkerNext);
      corners.splice(prevMiddleIndex, 1, _middleMarkerPrev);

      corners[ index ] = Object.assign({}, markerLatLng);

      this._helpingPolygon.setLatLngs(corners);
      this._newRectLatLngs = corners;

      this.saveRect(this._newRectLatLngs);
    }

    saveRect(rectLatLngs) {
      this.props.setVertexes(rectLatLngs);
    }

    vertexDragend() {
      if (this.hasSelfIntersection()) {
        this.saveRect(this._initialRectLatLngs);
      }
    }

    updateMiddleVertexes(index, newLatLng) {
      const corners = this._initialRectLatLngs.slice();
      const middleLatLng = Object.assign({}, corners[ index ], newLatLng, { isMiddle: false });

      // detect next and prev vertexes
      const nextMarkerIndex = (index + 1) % corners.length;
      const prevMarkerIndex = (index + corners.length - 1) % corners.length;

      const nextMarkerLatLng = corners[ nextMarkerIndex ];
      const prevMarkerLatLng = corners[ prevMarkerIndex ];

      // calc middles
      const middleMarkerNextLatLng = calcMiddleLatLng(
        middleLatLng,
        nextMarkerLatLng, this.context.map,
      );
      const _middleMarkerNext = Object.assign({ isMiddle: true }, middleMarkerNextLatLng);

      const middleMarkerPrevLatLng = calcMiddleLatLng(
        middleLatLng,
        prevMarkerLatLng, this.context.map,
      );
      const _middleMarkerPrev = Object.assign(
        { isMiddle: true },
        middleMarkerPrevLatLng,
      );

      corners.splice(index, 1, _middleMarkerPrev, middleLatLng, _middleMarkerNext);

      this._helpingPolygon.setLatLngs(corners);

      this._newRectLatLngs = corners;

      this.saveRect(this._newRectLatLngs);
    }

    render() {
      const options = {
        radius: 10,
        color: '#2962ff',
        fillColor: '#ffffff',
        opacity: 1,
        fillOpacity: 1,
        weight: 1,
      };

      const optionsForMiddle = {
        radius: 5,
        color: '#2962ff',
        fillColor: '#ffffff',
        opacity: 1,
        fillOpacity: 0.7,
        weight: 2,
      };

      const markerVertexes = this.props.vertexes.map((vertex, index) => {
        if (!vertex.isMiddle) {
          return (
              <Vertex
                key={ `vertex${ index + 1 }` }
                index={ index }
                center={ vertex }
                options={ options }
                updateVertexes={ this.updateVertexes }
                setRectPosition={ this.setRectPosition }
                saveRect={ this.saveRect }
                vertexDragend={ this.vertexDragend }
              />
          );
        }
        return (
            <MiddleVertex
              key={ `middle${ index + 1 }` }
              index={ index }
              center={ vertex }
              options={ optionsForMiddle }
              updateMiddleVertexes={ this.updateMiddleVertexes }
              setRectPosition={ this.setRectPosition }
              saveRect={ this.saveRect }
              vertexDragend={ this.vertexDragend }
            />
        );
      });

      return (
          <div>
              {markerVertexes}
          </div>
      );
    }
}

export default Vertexes;
