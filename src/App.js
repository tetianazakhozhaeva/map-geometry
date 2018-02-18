import React, { Component } from 'react';
import { bool, object, func } from 'prop-types';
import { bindActionCreators } from 'redux';
import { Map, TileLayer } from 'react-leaflet';
import { connect } from 'react-redux';
import './App.css';
import RectangleLayer from './components/geofences/rectangle-layer';
import Buttons from './components/buttons/buttons';
import { setCreateMode, setEditingMode, setCoordinates } from './components/buttons/actions';

class App extends Component {
    static propTypes = {
      isEditing: bool.isRequired,
      notice: object.isRequired,
      setCoordinates: func.isRequired,
    };
    state = {
      lat: 50,
      lng: 36,
      zoom: 13,
    };

    render() {
      const position = [this.state.lat, this.state.lng];

      return (
          <div className="App">
              <div className="container">
                  <Map
                    center={ position }
                    zoom={ this.state.zoom }
                  >
                      <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                      />
                      <RectangleLayer
                        isCreate={ !this.props.isEditing }
                        notice={ this.props.notice }
                        setCoordinates={ this.props.setCoordinates }
                      />
                  </Map>
                  <Buttons />
              </div>
          </div>
      );
    }
}

const mapStateToProps = state => ({
  isEditing: state.reducer.isEditing,
  notice: state.reducer.buffer.notice,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(Object.assign({
    setCreateMode,
    setEditingMode,
    setCoordinates,
  }), dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
