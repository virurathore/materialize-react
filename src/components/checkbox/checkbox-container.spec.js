import React from 'react';
import test from 'ava';
import sinon from 'sinon';

import CheckboxContainer from './checkbox-container.jsx';
import {
  shallow,
  mount,
} from 'tests/enzyme';

test('should render a button', (t) => {
  const wrapper = shallow(<CheckboxContainer name="test" />);

  t.deepEqual(wrapper.find('button').length, 1);
});

test('should get and set the state with the checked property', (t) => {
  const wrapper = shallow(<CheckboxContainer name="test" />);
  const instance = wrapper.instance();

  t.deepEqual(instance.checked, wrapper.state('checked'));

  instance.checked = !wrapper.state('checked');

  t.deepEqual(instance.checked, wrapper.state('checked'));
});

test('should have a negative tabIndex and aria-disabled set to true when it\'s disabled', (t) => {
  const wrapper = shallow(
    <CheckboxContainer
      disabled
      name="test"
    />,
  );

  t.deepEqual(wrapper.find({ 'aria-disabled': true }).length, 1);
  t.deepEqual(wrapper.find({ tabIndex: -1 }).length, 1);
});

test('should have the checked state set to true when the defaultChecked prop is passed', (t) => {
  const wrapper = shallow(
    <CheckboxContainer
      defaultChecked
      name="test"
    />,
  );

  t.deepEqual(wrapper.state('checked'), true);
});

test('should call the focus event handler passed to the element', (t) => {
  const onFocus = sinon.spy();
  const onBlur = sinon.spy();
  const wrapper = mount(
    <CheckboxContainer
      name="test"
      onFocus={onFocus}
      onBlur={onBlur}
    />,
  );

  wrapper.simulate('focus');

  t.deepEqual(onFocus.callCount, 1);

  wrapper.simulate('blur');

  t.deepEqual(onBlur.callCount, 1);
});

test('should not update the state when there is no keyCode in a key event', (t) => {
  const wrapper = shallow(<CheckboxContainer name="test" />);

  wrapper.simulate('keyDown');

  t.deepEqual(wrapper.state('checked'), false);
});

test('should only update the state when the key is a valid keyCode', (t) => {
  const onKeyDown = sinon.spy();
  const wrapper = shallow(
    <CheckboxContainer
      name="test"
      onKeyDown={onKeyDown}
    />,
  );

  t.plan(CheckboxContainer.keyCodes.length * 3);

  CheckboxContainer.keyCodes.forEach((keyCode, index) => {
    wrapper.simulate('keyDown', { keyCode });

    t.deepEqual(onKeyDown.callCount, index + 1);
    t.deepEqual(wrapper.state('checked'), true);
    t.deepEqual(wrapper.instance().keyDown, true);

    wrapper.simulate('keyUp');
  });
});

test('should not update the state when the keyUp event hasn\'t fired yet', (t) => {
  const onChange = sinon.spy();
  const wrapper = shallow(
    <CheckboxContainer
      name="test"
      onChange={onChange}
    />,
  );

  wrapper.simulate('keyDown', { keyCode: CheckboxContainer.keyCodes[0] });

  t.deepEqual(onChange.callCount, 1);

  wrapper.simulate('keyDown', { keyCode: CheckboxContainer.keyCodes[0] });

  t.deepEqual(onChange.callCount, 1);
});

test('events should work when no event handlers have been passed', (t) => {
  const wrapper = mount(<CheckboxContainer name="test" />);

  wrapper.simulate('focus');
  wrapper.simulate('blur');

  wrapper.simulate('keyDown');
  wrapper.simulate('keyUp');

  t.pass();
});
