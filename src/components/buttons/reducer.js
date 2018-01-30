import {handleActions} from 'redux-actions';

const initialState = {
  isEditing: false,
  geofence: {
      location: [
          {
              x: 50,
              y: 36
          }
      ]
  }
};

export default handleActions({
    SET_CREATE_MODE: (state, action) => ({
        ...state,
        isEditing: false,
    }),
    SET_EDIT_MODE: (state, action) => ({
        ...state,
        isEditing: true,
    }),

}, initialState);