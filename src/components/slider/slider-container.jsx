import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import classnames from 'classnames';

import EventHandler from '../event-handler';
import getNotDeclaredProps from '../../get-not-declared-props';

/**
 * The actual renderer of the slider.
 *
 * @class
 */
export class SliderContainer extends PureComponent {
  static propTypes = {
    classes: PropTypes.shape({
      slider: PropTypes.string.isRequired,
      track: PropTypes.string.isRequired,
      trackFocused: PropTypes.string.isRequired,
      trackDisabled: PropTypes.string.isRequired,
      thumb: PropTypes.string.isRequired,
      thumbFocused: PropTypes.string.isRequired,
      thumbActive: PropTypes.string.isRequired,
      thumbDisabled: PropTypes.string.isRequired,
      thumbActiveDisabled: PropTypes.string.isRequired,
    }).isRequired,
    className: PropTypes.string.isRequired,
    onTrackPress: PropTypes.func.isRequired,
    onThumbPress: PropTypes.func.isRequired,
    onThumbRelease: PropTypes.func.isRequired,
    onTouchMove: PropTypes.func.isRequired,
    onMouseMove: PropTypes.func.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    isFocused: PropTypes.bool.isRequired,
    isDragging: PropTypes.bool.isRequired,
    value: PropTypes.number.isRequired,
    rootRef: PropTypes.func.isRequired,
    translateX: PropTypes.number.isRequired,
    theme: PropTypes.shape({}).isRequired,
    disabled: PropTypes.bool.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
  };

  /**
   * The styles for the slider.
   *
   * @param {Object} theme - The theme provided by Jss.
   * @param {Object} theme.slider - The actual theme object for the slider.
   * @returns {Object} - Returns the styles for the component.
   */
  static styles({ slider: theme }) {
    return {
      slider: {
        composes: 'slider',
        display: 'inline-block',
        position: 'relative',
        width: '100%',
        height: theme.trackHeight,
        margin: '20px 15px',

        '&:focus': { outline: 0 },

        '&[aria-disabled=true]': { pointerEvents: 'none' },
      },

      track: {
        composes: 'slider--track',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: theme.trackColor,
        transition: 'background-color 100ms linear',

        '&::after': {
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          content: '""',
          transformOrigin: 'left center',
          backgroundColor: theme.trackActiveColor,
          transform: props => `scaleX(${props.value / props.max})`,
          transition: 'transform 100ms linear',
        },
      },

      trackFocused: {
        composes: 'slider--track-focused',
        backgroundColor: theme.focusedTrackColor,
      },

      trackDisabled: {
        composes: 'slider--track-disabled',
        backgroundColor: theme.disabledTrackColor,

        '&::after': { backgroundColor: 'transparent' },
      },

      thumb: {
        composes: 'slider--thumb',
        width: theme.thumbSize,
        position: 'absolute',
        top: (theme.trackHeight - theme.thumbSize - theme.borderWidth * 2) / 2,
        bottom: (theme.trackHeight - theme.thumbSize - theme.borderWidth * 2) / 2,
        left: -theme.thumbSize - theme.borderWidth * 2 + 0.5,
        border: `solid ${theme.borderWidth}px`,
        borderColor: theme.thumbBorderColor,
        borderRadius: '50%',
        cursor: 'drag',
        transition: 'background-color, opacity, transform 100ms linear',

        '&::after': {
          position: 'absolute',
          content: '""',
          top: (theme.thumbSize + theme.borderWidth * 2 - theme.focusCircleSize) / 2,
          left: (theme.thumbSize + theme.borderWidth * 2 - theme.focusCircleSize) / 2,
          right: (theme.thumbSize + theme.borderWidth * 2 - theme.focusCircleSize) / 2,
          bottom: (theme.thumbSize + theme.borderWidth * 2 - theme.focusCircleSize) / 2,
          backgroundColor: theme.focusedThumbBorderColor,
          opacity: 0,
          transition: 'opacity 100ms linear',
          borderRadius: '50%',
        },
      },

      thumbFocused: {
        composes: 'slider--thumb-focused',
        borderColor: theme.focusedThumbBorderColor,

        '&::after': { opacity: 0.2 },
      },

      thumbActive: {
        composes: 'slider--thumb-active',
        backgroundColor: theme.thumbActiveColor,
        borderColor: theme.thumbActiveColor,

        '&::after': { backgroundColor: theme.thumbActiveColor },
      },

      thumbDisabled: {
        composes: 'slider--thumb-disabled',
        borderColor: theme.disabledThumbColor,
      },

      thumbActiveDisabled: {
        composes: 'slider--thumb-active-disabled',
        backgroundColor: theme.disabledThumbColor,
      },
    };
  }

  render() {
    const {
      classes,
      onTrackPress,
      onThumbPress,
      onThumbRelease,
      onTouchMove,
      onMouseMove,
      onKeyPress,
      onFocus,
      onBlur,
      className,
      isFocused,
      isDragging,
      value,
      rootRef,
      translateX,
      theme,
      disabled,
      ...props
    } = this.props;

    const thumbClassNames = classnames(classes.thumb, {
      [classes.thumbFocused]: isFocused && !isDragging,
      [classes.thumbActive]: value > 0,
      [classes.thumbDisabled]: disabled,
      [classes.thumbActiveDisabled]: value > 0 && disabled,
    });
    const trackClassNames = classnames(classes.track, {
      [classes.trackFocused]: isFocused,
      [classes.trackDisabled]: disabled,
    });
    let transform = `translateX(${translateX}px)`;

    if (isDragging) {
      transform += ` scale(${theme.slider.thumbActiveSize / theme.slider.thumbSize})`;
    } else if (disabled) {
      transform += ` scale(${theme.slider.thumbDisabledSize / theme.slider.thumbSize})`;
    }

    return (
      <div
        {...getNotDeclaredProps(props, SliderContainer)}
        className={`${classes.slider} ${className}`}
        ref={rootRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-valuemax={this.props.max}
        aria-valuemin={this.props.min}
        aria-valuenow={value}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyPress}
      >
        <EventHandler
          component="span"
          className={trackClassNames}
          onPress={onTrackPress}
        />

        <EventHandler
          component="span"
          style={{ transform }}
          className={thumbClassNames}
          onPress={onThumbPress}
          onRelease={onThumbRelease}
          onMouseMove={onMouseMove}
          onTouchMove={onTouchMove}
        />
      </div>
    );
  }
}

export default injectSheet(SliderContainer.styles)(SliderContainer);