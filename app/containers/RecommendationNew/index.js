/*
*
* RecommendationNew
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { actions as formActions } from 'react-redux-form/immutable';

import { Map, List } from 'immutable';

import {
  renderMeasureControl,
  renderTaxonomyControl,
  getTitleFormField,
  getReferenceFormField,
  getAcceptedField,
  getStatusField,
  getMarkdownField,
} from 'utils/forms';

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';

import { USER_ROLES, CONTENT_SINGLE } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  updateEntityForm,
  openNewEntityModal,
  submitInvalid,
} from 'containers/App/actions';

import {
  selectReady,
  selectMeasuresCategorised,
  selectRecommendationTaxonomies,
} from 'containers/App/selectors';

import ErrorMessages from 'components/ErrorMessages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'components/forms/EntityForm';

import {
  selectDomain,
  selectConnectedTaxonomies,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES } from './constants';


export class RecommendationNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    this.props.initialiseForm('recommendationNew.form.data', this.props.viewDomain.form.data);
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.dataReady && !this.props.dataReady) {
      this.props.redirectIfNotPermitted();
    }
  }

  getHeaderMainFields = () => ([ // fieldGroups
    { // fieldGroup
      fields: [
        getReferenceFormField(this.context.intl.formatMessage, appMessages, true), // required
        getTitleFormField(this.context.intl.formatMessage, appMessages, 'titleText'),
      ],
    },
  ]);

  getHeaderAsideFields = () => ([{
    fields: [getStatusField(this.context.intl.formatMessage, appMessages)],
  }]);

  getBodyMainFields = (connectedTaxonomies, measures, onCreateOption) => ([
    {
      fields: [
        getAcceptedField(this.context.intl.formatMessage, appMessages),
        getMarkdownField(this.context.intl.formatMessage, appMessages, 'response'),
      ],
    },
    {
      label: this.context.intl.formatMessage(appMessages.entities.connections.plural),
      icon: 'connections',
      fields: [
        renderMeasureControl(measures, connectedTaxonomies, onCreateOption),
      ],
    },
  ]);

  getBodyAsideFields = (taxonomies, onCreateOption) => ([ // fieldGroups
    { // fieldGroup
      label: this.context.intl.formatMessage(appMessages.entities.taxonomies.plural),
      icon: 'categories',
      fields: renderTaxonomyControl(taxonomies, onCreateOption),
    },
  ]);

  render() {
    const { dataReady, viewDomain, connectedTaxonomies, taxonomies, measures, onCreateOption } = this.props;
    const { saveSending, saveError, submitValid } = viewDomain.page;

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}`}
          meta={[
            {
              name: 'description',
              content: this.context.intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        <Content>
          <ContentHeader
            title={this.context.intl.formatMessage(messages.pageTitle)}
            type={CONTENT_SINGLE}
            icon="recommendations"
            buttons={
              dataReady ? [{
                type: 'cancel',
                onClick: this.props.handleCancel,
              },
              {
                type: 'save',
                onClick: () => this.props.handleSubmitRemote('recommendationNew.form.data'),
              }] : null
            }
          />
          {!submitValid &&
            <ErrorMessages error={{ messages: ['One or more fields have errors.'] }} />
          }
          {saveError &&
            <ErrorMessages error={saveError} />
          }
          {(saveSending || !dataReady) &&
            <Loading />
          }
          {dataReady &&
            <EntityForm
              model="recommendationNew.form.data"
              formData={viewDomain.form.data}
              handleSubmit={(formData) => this.props.handleSubmit(formData)}
              handleSubmitFail={this.props.handleSubmitFail}
              handleCancel={this.props.handleCancel}
              handleUpdate={this.props.handleUpdate}
              fields={{ // isManager, taxonomies,
                header: {
                  main: this.getHeaderMainFields(),
                  aside: this.getHeaderAsideFields(),
                },
                body: {
                  main: this.getBodyMainFields(connectedTaxonomies, measures, onCreateOption),
                  aside: this.getBodyAsideFields(taxonomies, onCreateOption),
                },
              }}
            />
          }
        </Content>
      </div>
    );
  }
}

RecommendationNew.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  handleSubmitRemote: PropTypes.func.isRequired,
  handleSubmitFail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  dataReady: PropTypes.bool,
  taxonomies: PropTypes.object,
  measures: PropTypes.object,
  onCreateOption: PropTypes.func,
  initialiseForm: PropTypes.func,
  connectedTaxonomies: PropTypes.object,
};

RecommendationNew.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: selectDomain(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  taxonomies: selectRecommendationTaxonomies(state),
  measures: selectMeasuresCategorised(state),
  connectedTaxonomies: selectConnectedTaxonomies(state),
});

function mapDispatchToProps(dispatch) {
  return {
    initialiseForm: (model, formData) => {
      dispatch(formActions.load(model, formData));
      dispatch(formActions.reset(model));
    },
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER));
    },
    handleSubmitFail: (formData) => {
      dispatch(submitInvalid(formData));
    },
    handleSubmitRemote: (model) => {
      dispatch(formActions.submit(model));
    },
    handleSubmit: (formData) => {
      let saveData = formData;

      // measureCategories
      if (formData.get('associatedTaxonomies')) {
        saveData = saveData.set(
          'recommendationCategories',
          formData.get('associatedTaxonomies')
          .map(getCheckedValuesFromOptions)
          .reduce((updates, formCategoryIds) => Map({
            delete: List(),
            create: updates.get('create').concat(formCategoryIds.map((id) => Map({
              category_id: id,
            }))),
          }), Map({ delete: List(), create: List() }))
        );
      }

      // measures
      if (formData.get('associatedMeasures')) {
        saveData = saveData.set('recommendationMeasures', Map({
          delete: List(),
          create: getCheckedValuesFromOptions(formData.get('associatedMeasures'))
          .map((id) => Map({
            measure_id: id,
          })),
        }));
      }

      dispatch(save(saveData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath('/recommendations'));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
    onCreateOption: (args) => {
      dispatch(openNewEntityModal(args));
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(RecommendationNew);
