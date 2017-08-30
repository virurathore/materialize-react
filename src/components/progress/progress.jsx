import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import injectSheet from 'react-jss';
import warning from 'warning';

import getNotDeclaredProps from '../../get-not-declared-props';
import { easeInOutCubic } from '../../styles/timings';

/**
 * A component to render a material design progress bar.
 *
 * @class
 * @extends PureComponent
 */
export class Progress extends PureComponent {
  static propTypes = {
    classes: PropTypes.shape({
      progress: PropTypes.string.isRequired,
      container: PropTypes.string.isRequired,
      bar: PropTypes.string.isRequired,
      primaryBar: PropTypes.string.isRequired,
      secondaryBar: PropTypes.string.isRequired,
    }).isRequired,
    theme: PropTypes.shape({ progress: PropTypes.object.isRequired }).isRequired,
    indeterminate: PropTypes.bool,
    disabled: PropTypes.bool,
    progress: PropTypes.number,
    secondaryProgress: PropTypes.number,
    className: PropTypes.string,
    active: PropTypes.bool,
  };

  static defaultProps = {
    indeterminate: false,
    progress: 0,
    className: '',
    active: false,
    secondaryProgress: 0,
    disabled: false,
  };

  /**
   * Make sure the value that the user passed in is valid and is between 0 and 100.
   *
   * @param {Number} value - The value to validate.
   * @returns {Number} - Returns the value when it's valid.
   * Returns the min or max value when it's not valid.
   */
  static clamp(value) {
    return Math.max(0, Math.min(value, 100));
  }

  /**
   * The styles for the component.
   *
   * @param {Object} theme - The theme provided by Jss.
   * @param {Object} theme.progress - The actual theme for the progress component.
   * @returns {Object} - Returns the styles which will be rendered.
   */
  static styles({ progress: theme }) {
    return {
      '@keyframes progress--bar': {
        '0%': { transform: 'scaleX(1) translateX(-100%)' },
        '50%': { transform: 'scaleX(1) translateX(0%)' },
        '75%': {
          transform: 'scaleX(1) translateX(0%)',
          animationTimingFunction: 'cubic-bezier(.28, .62, .37, .91)',
        },
        '100%': { transform: 'scaleX(0) translateX(0%)' },
      },

      '@keyframes progress--splitter': {
        '0%': { transform: 'scaleX(.75) translateX(-125%)' },
        '30%': {
          transform: 'scaleX(.75) translateX(-125%)',
          animationTimingFunction: 'cubic-bezier(.42, 0, .6, .8)',
        },
        '90%': { transform: 'scaleX(.75) translateX(125%)' },
        '100%': { transform: 'scaleX(.75) translateX(125%)' },
      },

      progress: {
        composes: 'progress',
        display: 'block',
        position: 'relative',
        width: '100%',
        overflow: 'hidden',

        '&.progress--indeterminate $primaryBar': {
          transformOrigin: 'right center',
          animationIterationCount: 'infinite',
          animationDuration: theme.indeterminateDuration,
        },

        '&.progress--indeterminate $primaryBar::after': {
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          content: '""',
          transformOrigin: 'center center',
          animationIterationCount: 'infinite',
          height: theme.barHeight,
          backgroundColor: theme.backgroundColor,
          animationDuration: theme.indeterminateDuration,
        },

        '&.progress--indeterminate[data-active=true] $primaryBar': {
          animationName: 'progress--bar',

          '&::after': { animationName: 'progress--splitter' },
        },

        '&[aria-disabled=true] $primaryBar': { backgroundColor: theme.disabledPrimaryBarColor },

        '&[aria-disabled=true] $secondaryBar': { backgroundColor: theme.disabledSecondaryBarColor },
      },

      container: {
        composes: 'progress--container',
        position: 'relative',
        width: '100%',
        height: theme.barHeight,
        backgroundColor: theme.backgroundColor,
      },

      bar: {
        composes: 'progress--bar',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        transformOrigin: 'left center',
        willChange: 'transform',
        transition: `transform 200ms ${easeInOutCubic}`,
      },

      primaryBar: {
        composes: 'progress--primary-bar',
        backgroundColor: theme.primaryBarColor,
      },

      secondaryBar: {
        composes: 'progress--secondary-bar',
        backgroundColor: theme.secondaryBarColor,
      },
    };
  }

  /**
   * Warn if the user changes the mode prop.
   */
  componentWillReceiveProps(nextProps) {
    warning(
      nextProps.indeterminate === this.props.indeterminate,
      'You should not change the mode of the progress bar!',
    );
  }

  render() {
    const {
      classes,
      indeterminate,
      disabled,
      progress,
      active,
      secondaryProgress,
      ...props
    } = this.props;
    const additionalProps = indeterminate ? { 'data-active': active } : {
      'aria-valuenow': Progress.clamp(progress),
      'aria-valuemin': 0,
      'aria-valuemax': 100,
    };
    const className = classnames(
      this.props.className,
      classes.progress,
      indeterminate && 'progress--indeterminate',
    );

    return (
      <span
        {...getNotDeclaredProps(props, Progress)}
        role="progressbar"
        aria-disabled={disabled}
        className={className}
        ref={(element) => { this.root = element; }}
        {...additionalProps}
      >
        <div className={classes.container}>
          <div
            className={`${classes.bar} ${classes.secondaryBar}`}
            style={{ transform: `scaleX(${Progress.clamp(secondaryProgress) / 100})` }}
          />

          <div
            className={`${classes.bar} ${classes.primaryBar}`}
            style={{ transform: `scaleX(${Progress.clamp(progress) / 100})` }}
          />
        </div>
      </span>
    );
  }
}

export default injectSheet(Progress.styles)(Progress);
