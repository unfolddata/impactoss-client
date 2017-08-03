import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import Grid from 'grid-styled';

import Container from 'components/styled/Container';
import Row from 'components/styled/Row';

import messages from './messages';

import Banner from './Banner';

const Styled = styled.div`
  background-color: ${palette('secondary', 1)};
  color: ${palette('primary', 4)};
`;
const Main = styled.div`
  padding: 2em 0 3em;
`;
const FooterContact = styled.a`
`;
const FooterProjectLink = styled.a`
font-weight:bold;
`;


class Footer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  // onClick = (evt, path) => {
  //   if (evt !== undefined && evt.preventDefault) evt.preventDefault();
  //   this.props.onPageLink(path);
  // }

  render() {
    return (
      <Styled >
        <Banner />
        <Main>
          <Container>
            <Row>
              <Grid sm={1 / 2}>
                <FormattedMessage {...messages.disclaimer} />
                <div>
                  <FooterContact
                    target="_blank"
                    href={`mailto:${this.context.intl.formatMessage(messages.contact.email)}`}
                    title={this.context.intl.formatMessage(messages.contact.anchor)}
                  >
                    <FormattedMessage {...messages.contact.anchor} />
                  </FooterContact>
                </div>
              </Grid>
              <Grid sm={1 / 4}>
                <FormattedMessage {...messages.responsible.text} />
              </Grid>
              <Grid sm={1 / 4}>
                <FormattedMessage {...messages.project.text} />
                <div>
                  <FooterProjectLink
                    target="_blank"
                    href={this.context.intl.formatMessage(messages.project.url)}
                    title={this.context.intl.formatMessage(messages.project.anchor)}
                  >
                    <FormattedMessage {...messages.project.anchor} />
                  </FooterProjectLink>
                </div>
              </Grid>
            </Row>
          </Container>
        </Main>
      </Styled>
    );
  }
}

// Footer.propTypes = {
//   pages: PropTypes.array,
//   onPageLink: PropTypes.func.isRequired,
// };

Footer.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default Footer;
