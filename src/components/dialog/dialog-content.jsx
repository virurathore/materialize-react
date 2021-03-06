import React from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';

import getNotDeclaredProps from '../../get-not-declared-props';

/**
 * A component which adds the appropriate styles for the content inside a dialog.
 *
 * @param {Object} props - The props for the component.
 * @param {Object} props.classes - Classes provided by Jss.
 * @param {String} props.className - Additional className.
 * @param {JSX} props.children - The actual content for the dialog.
 * @returns {JSX} - Returns the jsx.
 */
function DialogContent(props) {
  return (
    <main
      className={`${props.classes.content} ${props.className}`}
      {...getNotDeclaredProps(props, DialogContent)}
    >
      {props.children}
    </main>
  );
}

DialogContent.propTypes = {
  classes: PropTypes.shape({ content: PropTypes.string.isRequired }).isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

DialogContent.defaultProps = { className: '' };

DialogContent.styles = {
  content: {
    composes: 'dialog--content',
    padding: 24,
    paddingTop: 0,
    width: '100%',
    boxSizing: 'border-box',
  },
};

export default injectSheet(DialogContent.styles)(DialogContent);
