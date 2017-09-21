import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import warning from 'warning';
import injectSheet from 'react-jss';
import classnames from 'classnames';
import { position } from 'polished';

import EventHandler from '../event-handler';
import getNotDeclaredProps from '../../get-not-declared-props';
import elevation from '../../styles/elevation';
import breakpoints from '../../styles/breakpoints';

/**
 * A component to render a dialog.
 *
 * @class
 */
export class DialogContainer extends PureComponent {
  static propTypes = {
    classes: PropTypes.shape({
      dialogContainer: PropTypes.string.isRequired,
      hideContainer: PropTypes.string.isRequired,
      backdrop: PropTypes.string.isRequired,
      backdropActive: PropTypes.string.isRequired,
      dialog: PropTypes.string.isRequired,
      fullscreenDialog: PropTypes.string.isRequired,
    }).isRequired,
    className: PropTypes.string,
    animateInName: PropTypes.string,
    animateOutName: PropTypes.string,
    animateInFullscreenName: PropTypes.string,
    animateOutFullscreenName: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    animateInName: 'dialog--animate-in',
    animateOutName: 'dialog--animate-out',
    animateInFullscreenName: 'dialog--animate-in-fullscreen',
    animateOutFullscreenName: 'dialog--animate-out-fullscreen',
  };

  static contextTypes = {
    dialogController: PropTypes.shape({
      initiateContainer: PropTypes.func.isRequired,
      removeContainer: PropTypes.func.isRequired,
    }).isRequired,
  };

  /**
   * The styles for the dialog component.
   *
   * @param {Object} theme - The theme provided by Jss.
   * @param {Object} theme.dialog - The actual theme for the dialog component.
   * @returns {Object} - Returns the styles.
   */
  static styles({ dialog: theme }) {
    return {
      '@keyframes dialog--animate-in': {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },

      '@keyframes dialog--animate-out': {
        from: { opacity: 1 },
        to: { opacity: 0 },
      },

      '@keyframes dialog--animate-in-fullscreen': {
        from: { transform: 'translateY(100%)' },
        to: { transform: 'translateY(0)' },
      },

      '@keyframes dialog--animate-out-fullscreen': {
        from: { transform: 'translateY(0)' },
        to: { transform: 'translateY(100%)' },
      },

      dialogContainer: {
        composes: 'dialog--container',
        ...position('fixed', '0', '0', '0', '0'),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'scale(1)',
        zIndex: theme.zIndex,
        padding: 32,

        [breakpoints.up('tablet')]: { padding: 64 },
      },

      hideContainer: {
        composes: 'dialog--container-hidden',
        transform: 'scale(0)',
      },

      backdrop: {
        composes: 'dialog--backdrop',
        ...position('absolute', '0', '0', '0', '0'),
        opacity: 0,
        backgroundColor: theme.backdropColor,
        transition: `opacity ${theme.animationDuration}ms linear`,
      },

      backdropActive: {
        composes: 'dialog--backdrop-active',
        opacity: 1,
      },

      dialog: {
        composes: 'dialog',
        backgroundColor: theme.backgroundColor,
        borderRadius: theme.borderRadius,
        boxShadow: elevation(theme.elevation),
        animationDuration: theme.animationDuration,
        animationFillMode: 'forwards',
        opacity: 0,
      },

      fullscreenDialog: {
        composes: 'dialog--fullscreen',
        boxShadow: 'none',
        borderRadius: 0,
        opacity: 1,
        ...position('absolute', '0', '0', '0', '0'),
      },
    };
  }

  state = {
    currentDialog: null,
    animatingOut: false,
  };

  /**
   * Initiate the container in the controller.
   */
  componentWillMount() {
    this.context.dialogController.initiateContainer(this.openDialog, this.closeDialog);
  }

  /**
   * Remove the container from the controller.
   */
  componentWillUnmount() {
    this.context.dialogController.removeContainer();
  }

  isAnimatedIn = false;

  /**
   * The callback for when a dialog should be opened.
   *
   * @param {Object} dialog - The dialog object.
   * @returns {Boolean} - Returns whether or not the dialog will be opened.
   */
  openDialog = (dialog) => {
    if (this.state.currentDialog) {
      return warning(false, 'There is already a dialog currently opened!');
    }

    this.setState({ currentDialog: dialog });

    return true;
  };

  /**
   * Close the current dialog.
   * This will only change the animationOut state so the dialog animates out correctly.
   */
  closeDialog = () => {
    this.setState(({ currentDialog }) => {
      if (currentDialog) {
        this.isAnimatedIn = false;

        return { animatingOut: true };
      }

      return warning(false, 'There is currently no open dialog! This action will have no effect');
    });
  };

  /**
   * When the backdrop is pressed and the dialog is supposed to close on that,
   * we close the dialog.
   */
  handleBackdropPress = () => {
    if (this.state.currentDialog.closeOnOutsideClick && this.isAnimatedIn) {
      this.closeDialog();
    }
  };

  /**
   * When the out animation ends, we call the onClose handler of the dialog
   * and set the currentDialog state to null again.
   */
  handleAnimationEnd = () => {
    this.setState(({
      animatingOut,
      currentDialog,
    }) => {
      if (animatingOut) {
        currentDialog.onClose();

        return {
          currentDialog: null,
          animatingOut: false,
        };
      }

      this.isAnimatedIn = true;

      return null;
    });
  };

  render() {
    const {
      classes,
      className,
      ...props
    } = this.props;
    const { currentDialog } = this.state;
    const classNames = classnames(
      classes.dialogContainer,
      className,
      { [classes.hideContainer]: !currentDialog },
    );

    let dialog = null;
    let backdrop = null;

    if (currentDialog) {
      const Element = currentDialog.component;
      const dialogClasses = classnames(
        classes.dialog,
        currentDialog.fullscreen && classes.fullscreenDialog,
        currentDialog.className,
      );
      let name = this.state.animatingOut ? 'animateOut' : 'animateIn';

      if (currentDialog.fullscreen) {
        name += 'Fullscreen';
      }

      dialog = (
        <div
          role="dialog"
          className={dialogClasses}
          style={{ animationName: this.props[`${name}Name`] }}
          onAnimationEnd={this.handleAnimationEnd}
        >
          <Element
            {...currentDialog.additionalProps}
            close={this.closeDialog}
          />
        </div>
      );

      if (!currentDialog.fullscreen) {
        const backdropClasses = classnames(
          classes.backdrop,
          { [classes.backdropActive]: currentDialog.backdrop && !this.state.animatingOut },
        );

        backdrop = (
          <EventHandler
            component="span"
            className={backdropClasses}
            onPress={this.handleBackdropPress}
          />
        );
      }
    }

    return (
      <div
        aria-modal
        className={classNames}
        {...getNotDeclaredProps(props, DialogContainer)}
      >
        {backdrop}
        {dialog}
      </div>
    );
  }
}

export default injectSheet(DialogContainer.styles)(DialogContainer);
