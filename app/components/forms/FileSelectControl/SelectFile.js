import React from 'react';
// import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import FileReaderInput from 'react-file-reader-input';
import Baby from 'babyparse';

// import appMessages from 'containers/App/messages';

import Icon from 'components/Icon';
import ButtonText from 'components/buttons/ButtonText';
import ButtonIcon from 'components/buttons/ButtonIcon';
import ButtonIconPrimary from 'components/buttons/ButtonIconPrimary';

import DocumentWrap from 'components/fields/DocumentWrap';

const Remove = styled(ButtonIcon)`
  position: absolute;
  right: 0;
  top: 0;
  padding: 1em 0.75em;
  color: ${palette('dark', 2)};
  &:hover {
    color: ${palette('primary', 0)};
  }
`;
const ImportButton = styled(ButtonText)`
  position: absolute;
  right: 3em;
  top: 0.5em;
`;

const DocumentWrapEdit = styled(DocumentWrap)`
  background-color: ${palette('primary', 4)};
  position: relative;
  padding: 1em 0.75em;
`;


const Styled = styled.div`
  padding-top: 1em;
  display: block;
`;


class SelectFile extends React.Component { // eslint-disable-line react/prefer-stateless-function

  handleChange = (e, results) => {
    // todo: limit to 1 file?
    results.forEach((result) => {
      const [evt, file] = result;
      // try {
      const parsed = Baby.parse(evt.target.result, { header: true });
      if (parsed && parsed.errors && parsed.errors.length === 0) {
        this.props.onChange({
          rows: parsed.data,
          meta: parsed.meta,
          file,
        });
        // } else {
          // console.log('error')
      }
      // }
      // catch (err) {
      //   // console.log(err)
      // }
    });
  }

  handleRemove = (e) => {
    e.preventDefault();
    this.props.onChange(null);
  }

  render() {
    // console.log(this.props.value)
    return (
      <Styled>
        { this.props.value &&
          <DocumentWrapEdit>
            <div>{this.props.value.file.name}</div>
            <ImportButton type="submit" primary>
              {`Import ${this.props.value.rows.length} row(s)`}
            </ImportButton>
            <Remove onClick={this.handleRemove}>
              <Icon name="removeLarge" />
            </Remove>
          </DocumentWrapEdit>
        }
        { !this.props.value &&
          <FileReaderInput
            as={this.props.as}
            accept={this.props.accept}
            onChange={this.handleChange}
          >
            <ButtonIconPrimary type="button">
              Select File
              <Icon name="add" text textRight />
            </ButtonIconPrimary>
          </FileReaderInput>
        }
      </Styled>
    );
  }
}

SelectFile.propTypes = {
  onChange: React.PropTypes.func,
  value: React.PropTypes.object,
  as: React.PropTypes.string,
  accept: React.PropTypes.string,
};

export default SelectFile;
