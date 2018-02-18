import React from 'react';
import L from 'leaflet';
import { object, func, number } from 'prop-types';

class MiddleVertex extends React.Component {
    static propTypes = {
      center: object.isRequired,
      options: object.isRequired,
      index: number.isRequired,
      updateMiddleVertexes: func.isRequired,
      setRectPosition: func.isRequired,
      vertexDragend: func.isRequired,
    };
    static contextTypes = {
      map: object,
    };

    constructor() {
      super();

      this.handleMouseDown = this.handleMouseDown.bind(this);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    componentDidMount() {
      this.vertex = L.circleMarker(this.props.center, this.props.options);
      this.vertex.addTo(this.context.map);

      this.init();
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.center !== this.props.center) {
        this.vertex.setLatLng(nextProps.center);
      }
    }

    componentWillUnmount() {
      this.vertex.off('mousedown', this.handleMouseDown);
      this.context.map.off('mousemove', this.handleMouseMove);
      this.vertex.off('mouseup', this.handleMouseUp);

      this.vertex.remove();
    }

    init() {
      this.vertex.on('mousedown', this.handleMouseDown);
    }

    handleMouseDown(e) {
      // disable map dragging
      this.context.map.dragging.disable();

      this._tempDragCoord = e.latlng;

      this.props.setRectPosition();

      this.context.map.on('mousemove', this.handleMouseMove);

      document.addEventListener('mouseup', this.handleMouseUp);
    }

    handleMouseMove(e) {
      // latLng of mouse event
      const { latlng } = e;

      if (this.outOfBounds(latlng)) {
        return;
      }

      this.vertex.setLatLng(latlng);

      this.props.updateMiddleVertexes(this.props.index, latlng);
    }

    handleMouseUp() {
      this.props.vertexDragend();

      this.context.map.off('mousemove', this.handleMouseMove);
      document.removeEventListener('mouseup', this.handleMouseUp);

      // enable map dragging
      this.context.map.dragging.enable();
    }

    // util outOfBounds
    outOfBounds(position) {
      const { map } = this.context;
      return map.getBounds()
        .getEast() <= position.lng
            || map.getBounds()
              .getWest() >= position.lng
            || map.getBounds()
              .getNorth() <= position.lat
            || map.getBounds()
              .getSouth() >= position.lat;
    }

    render() {
      return null;
    }
}

export default MiddleVertex;
