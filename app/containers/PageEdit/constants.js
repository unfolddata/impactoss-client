/*
 *
 * PageEdit constants
 *
 */
import { fromJS } from 'immutable';

export const SAVE = 'impactoss/PageEdit/SAVE';

export const DEPENDENCIES = [
  'user_roles',
  'users',
  'pages',
];

export const FORM_INITIAL = fromJS({
  id: '',
  attributes: {
    title: '',
    content: '',
    menu_title: '',
    draft: '',
    order: '',
  },
});
