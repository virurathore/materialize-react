import PropTypes from 'prop-types';

import { whiteIcons } from '../../styles/colors';

export const schema = PropTypes.shape({
  miniSize: PropTypes.number.isRequired,
  normalSize: PropTypes.number.isRequired,
  iconSize: PropTypes.number.isRequired,

  elevation: PropTypes.number.isRequired,
  focusedElevation: PropTypes.number.isRequired,
  disabledElevation: PropTypes.number.isRequired,

  iconColor: PropTypes.string,
  backgroundColor: PropTypes.string.isRequired,
  disabledBackgroundColor: PropTypes.string.isRequired,

  animationDuration: PropTypes.number.isRequired,
});

/**
 * The default theme for the FAB   component.
 *
 * @private
 * @param {Object} vars - Variables passed by the theme compiler.
 * @returns {Object} - Returns the theme.
 */
export function defaultTheme(vars) {
  return {
    miniSize: 40,
    normalSize: 56,
    iconSize: 24,

    elevation: 1,
    focusedElevation: 4,
    disabledElevation: 0,

    iconColor: whiteIcons,
    backgroundColor: vars.primaryBase,
    disabledBackgroundColor: 'rgba(255, 255, 255, 0.1)',

    animationDuration: vars.transitionTime * 2,
  };
}
