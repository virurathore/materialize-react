import React from 'react';
import test from 'ava';
import { mount } from 'enzyme';

import TextHeader from './text-header';

const props = {
  totalSections: 3,
  currentSection: 0,
  backButton: null,
  nextButton: null,
};

test('should render a HeaderWithButtons', (t) => {
  const wrapper = mount(<TextHeader {...props} />);

  t.deepEqual(wrapper.find('HeaderWithButtons').length, 1);
});

test('should compute some text as the content', (t) => {
  const wrapper = mount(<TextHeader {...props} />);
  const text = wrapper.find('span').text();

  t.deepEqual(text, 'Step 1 of 3');
});

