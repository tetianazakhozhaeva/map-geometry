import { createAction } from 'redux-actions';

export const setCreateMode = createAction('SET_CREATE_MODE', isCreate => isCreate);
export const setEditingMode = createAction('SET_EDIT_MODE', isCreate => isCreate);
export const setCoordinates = createAction('SET_COORDINATES', coordinates => coordinates);
