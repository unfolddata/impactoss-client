import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`

  html,
  body {
    height: 100%;
    width: 100%;
  }
  body {
    font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.64em;
    color: #1c2121;
  }
  button, input, select, textarea {
    font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  :focus, :visited:focus {
    outline: 5px auto rgb(77, 144, 254); /* TODO: improve focus styles and individualise for specific buttons and links */
  }
  #app {
    background-color: #ffffff;
    min-height: 100%;
    min-width: 100%;
  }

  a {
    color: #0077d8;
    text-decoration: none;

    &:hover {
      color: #0063b5;
    }
  }
  h1, h2, h3, h4, h5, h6 {
    line-height: 1.25;
    font-weight: 500;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  h1 {
    font-weight: 700;
    font-size: 2.6em;
  }
  h2 {
    font-size: 2.25em;
  }
  h3 {
    font-size: 1.9em;
  }
  h4 {
    font-size: 1.5em;
  }
  h5 {
    font-size: 1.25em;
  }
  h6 {
    font-size: 1em;
  }


  p {
    margin-top: 0;
    margin-bottom: 16px;
  }

  * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .react-markdown {
    h1, h2, h3, h4, h5, h6 {
      font-weight: 700;
      margin-top: 1.75em;
      margin-bottom: 0.5em;
    }
    h1 {
      font-size: 1.75em;
      font-weight: 500;
    }
    h2 {
      font-size: 1.25em;
    }
    h3 {
      font-size: 1.15em;
    }
    h4 {
      font-size: 1em;
    }
    h5 {
      font-size: 1em;
    }
    h6 {
      font-size: 1em;
    }
  }

  .content-page {
    .react-markdown {
      p {
        &:first-child{
          font-size: 1.5em;
          color: #6A7880;
          padding-bottom: 20px;
        }
      }
    }
  }

  .new-entity-modal {
    position: absolute;
    top: 40px;
    left: 40px;
    right: 40px;
    bottom: 40px;
    border: 0;
    overflow: auto;
    --webkit-overflow-scrolling: touch;
    border-radius: 0;
    outline: none;
    padding: 20px;
    margin-right: auto;
    margin-left: auto;
    max-width: 1170px;
  }

  .new-entity-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.85);
  }

  [type="checkbox"] {
    vertical-align: middle;
    position: relative;
    bottom: 1px;
  }

  ._react-file-reader-input {
    display: inline-block;
  }
`;
