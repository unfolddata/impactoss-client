/*
 *
 * ActionList reducer
 *
 */

import { fromJS } from 'immutable';

const initialState = fromJS({
});

function actionListReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default actionListReducer;
