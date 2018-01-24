import React, {Component} from 'react';
import './App.css';
import {Map, TileLayer} from 'react-leaflet';
import EditLayer from './components/edit-layer';

class App extends Component {

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
                        center={position}
                        zoom={this.state.zoom}
                    >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                        />
                        <EditLayer />
                    </Map>
                </div>
            </div>
        );
    }
}

export default App;
