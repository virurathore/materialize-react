import { PropTypes } from 'react';

export const schema = PropTypes.shape({
  elevation: PropTypes.number,
  pressedElevation: PropTypes.number,
  typo: PropTypes.string,

  height: PropTypes.number,
  minWidth: PropTypes.number,
  margin: PropTypes.oneOf([PropTypes.string, PropTypes.number]),

  bgColor: PropTypes.string,
  raisedBgColor: PropTypes.string,
  raisedAndPressedBgColor: PropTypes.string,
  disabledBgColor: PropTypes.string,
  raisedAndDisabledBgColor: PropTypes.string,

  color: PropTypes.string,
  disabledColor: PropTypes.string,
});

export const defaultTheme = {
  elevation: 2,
  pressedElevation: 4,
  typo: 'button',
  height: 36,
  minWidth: 88,
  margin: '0 8px',
  bgColor: 'transparent',
  raisedBgColor: 'var(primaryBase)',
  raisedAndPressedBgColor: 'var(primaryDark)',
  disabledBgColor: 'transparent',
  raisedAndDisabledBgColor: 'var(dividerColor)',
  color: 'var(textColor)',
  disabledColor: 'var(disabledColor)',
};
