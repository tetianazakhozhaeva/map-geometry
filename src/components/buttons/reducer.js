import {handleActions} from 'redux-actions';

const initialState = {
    isEditing: false,

    buffer: {
        notice: {}
    },
};

export default handleActions({
    SET_CREATE_MODE: (state, action) => ({
        ...state,
        isEditing: false,
        buffer: {
            ...state.buffer,
            notice: {
                coordinates: [
                    {lat: 0, lng: 0},
                ]
            }
        }
    }),
    SET_EDIT_MODE: (state, action) => ({
        ...state,
        isEditing: true,
        buffer: {
            ...state.buffer,
            notice: {
                coordinates: [
                    {lat: 50, lng: 36},
                    {lat: 51, lng: 36},
                    {lat: 51, lng: 37},
                    {lat: 50, lng: 37},
                ]
            }
        }
    }),

    SET_COORDINATES: (state, action) => ({
        ...state,
        buffer: {
            ...state.buffer,
            notice: {
                coordinates: action.payload
            }
        }
    }),

}, initialState);