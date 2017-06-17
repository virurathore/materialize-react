import PropTypes from 'prop-types';

export const schema = PropTypes.shape({
  typo: PropTypes.string,
  color: PropTypes.string,
  disabledColor: PropTypes.string,
});

/**
 * The default theme for the label   component.
 *
 * @private
 * @param {Object} vars - Variables passed by the theme compiler.
 * @returns {Object} - Returns the theme.
 */
export function defaultTheme(vars) {
  return {
    color: vars.textColor,
    disabledColor: vars.secondaryTextColor,
  };
}
