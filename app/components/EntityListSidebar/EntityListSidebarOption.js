/*
 *
 * EntityListSidebarOption
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { palette } from 'styled-theme';

import appMessage from 'utils/app-message';

import Button from 'components/buttons/Button';
import Icon from 'components/Icon';

// TODO compare TaxonomySidebarItem
const Styled = styled(Button)`
  font-weight: bold;
  padding: 0.75em 2em;
  width: 100%;
  text-align: left;
  color:  ${(props) => props.active ? palette('asideListItem', 1) : palette('asideListItem', 0)};
  background-color: ${(props) => props.active ? palette('asideListItem', 3) : palette('asideListItem', 2)};
  border-bottom: 1px solid ${palette('asideListItem', 4)};
  &:hover {
    color: ${(props) => props.active ? palette('asideListItemHover', 1) : palette('asideListItemHover', 0)};
    background-color: ${(props) => props.active ? palette('asideListItemHover', 3) : palette('asideListItemHover', 2)};
    border-bottom-color: ${palette('asideListItemHover', 4)}
  }
`;
const Label = styled.span`
  vertical-align: middle;
  position: relative;
  top: 2px;
`;
const IconWrapper = styled.span`
  color: ${palette('light', 3)};
  vertical-align: middle;
  float: right;
  padding: 0 5px;
`;
const Dot = styled.div`
  background-color: ${(props) => palette(props.palette, props.pIndex)};
  display: block;
  border-radius: ${(props) => props.round ? 999 : 3}px;
  width: 1em;
  height: 1em;
`;
const DotWrapper = styled.div`
  padding: 5px;
  float: right;
`;

class EntityListSidebarOption extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  renderDot = (groupId, optionId) => {
    switch (groupId) {
      case 'taxonomies':
      case 'connectedTaxonomies':
        return (<Dot palette="taxonomies" pIndex={parseInt(optionId, 10)} />);
      case 'connections':
        return (<Dot palette={optionId} pIndex={0} round />);
      default:
        return null;
    }
  }
  render() {
    const { option, onShowForm, groupId } = this.props;

    return (
      <Styled
        active={option.get('active')}
        onClick={() => onShowForm({
          group: groupId,
          optionId: option.get('id'),
          path: option.get('path'),
          key: option.get('key'),
          ownKey: option.get('ownKey'),
          active: option.get('active'),
          create: option.get('create') && option.get('create').toJS(),
        })}
      >
        <Label>
          { option.get('message')
            ? appMessage(this.context.intl, option.get('message'))
            : option.get('label')
          }
        </Label>
        <DotWrapper>
          { this.renderDot(groupId, option.get('id')) }
        </DotWrapper>
        { option.get('icon') &&
          <IconWrapper>
            <Icon name={option.get('icon')} />
          </IconWrapper>
        }
      </Styled>
    );
  }
}

EntityListSidebarOption.propTypes = {
  option: PropTypes.object.isRequired,
  groupId: PropTypes.string.isRequired,
  onShowForm: PropTypes.func.isRequired,
};


EntityListSidebarOption.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default EntityListSidebarOption;