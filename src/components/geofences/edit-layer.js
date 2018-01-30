import React from 'react';
import PropTypes from 'prop-types';
import EditRectangle from './edit-rectangle';
import Vertexes from './vertexes';
import './css/layers.css'

import {connect} from 'react-redux';

class EditLayer extends React.Component {

    constructor() {
        super();

        this.state = {
            vertexes: [],
        };

        this.setVertexes = this.setVertexes.bind(this);
    }

    setVertexes(latLngs) {
        this.setState({
            vertexes: latLngs,
        })
    }

    render() {
        return (
            <div>
                <EditRectangle
                    setVertexes={this.setVertexes}
                    vertexes={this.state.vertexes}
                />
                <Vertexes
                    vertexes={this.state.vertexes}
                    setVertexes={this.setVertexes}
                />
            </div>
        )
    }
}

EditLayer.contextTypes = {
    map: PropTypes.object
};

const mapStateToProps = (state) => ({
    isEditing: state.reducer.isEditing,
});

export default connect(
    mapStateToProps
)(EditLayer);