import { handleActions } from 'redux-actions';

const initialState = {
  isEditing: false,

  buffer: {
    notice: {},
  },
};

export default handleActions({
  SET_CREATE_MODE: state => ({
    ...state,
    isEditing: false,
    buffer: {
      ...state.buffer,
      notice: {
        coordinates: [
          {
            x: 0,
            y: 0,
          },
        ],
      },
    },
  }),
  SET_EDIT_MODE: state => ({
    ...state,
    isEditing: true,
    buffer: {
      ...state.buffer,
      notice: {
        coordinates: [
          {
            x: 50,
            y: 36,
          },
          {
            x: 51,
            y: 36,
          },
          {
            x: 51,
            y: 37,
          },
          {
            x: 50,
            y: 37,
          },
          {
            x: 50,
            y: 36,
          },
        ],
      },
    },
  }
  ),

  SET_COORDINATES: (state, action) => ({
    ...state,
    buffer: {
      ...state.buffer,
      notice: {
        coordinates: action.payload,
      },
    },
  }),

}, initialState);
