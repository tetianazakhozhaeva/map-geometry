import React from 'react';
import Vertex from './vertex'

class Vertexes extends React.Component{
    render(){

        let options = {
            radius: 10,
            color: '#2962ff',
            fillColor: '#ffffff',
            opacity: 1,
            fillOpacity: 1,
            weight: 1
        };

        let markerVertexes = this.props.vertexes.map(
            (vertex, index) => {
                return <Vertex
                    key={index}
                    center={vertex}
                    options = {options}
                />
            }
        );

        return (
            <div>
                {markerVertexes}
            </div>
        );
    }
}

export default Vertexes;