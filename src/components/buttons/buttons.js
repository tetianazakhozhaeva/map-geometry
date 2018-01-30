import React from 'react';
import './buttons.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setCreateMode, setEditingMode} from './actions';

class Buttons extends React.Component {
    constructor() {
        super();

        this.handleCreate = this.handleCreate.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    handleCreate() {
        this.props.setCreateMode(true);
    }

    handleEdit() {
        this.props.setEditingMode(true);
    }

    render() {
        return (
            <div className='buttons-section'>
                <button className='button' onClick={this.handleCreate}>Создать</button>
                <button className='button' onClick={this.handleEdit}>Редактировать</button>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    isEditing: state.reducer.isEditing,
});
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(Object.assign({
        setCreateMode,
        setEditingMode
    }), dispatch)
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Buttons);