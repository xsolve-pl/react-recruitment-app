import React from 'react';
import { expect } from 'chai';
import Footer from './Footer';
import enzyme from '../../../services/test/enzymeWithProviders';

const mockProps = {
  changeLanguage: () => {},
  classes: {
    footer: 'footer'
  }
};

describe(`${Footer.name} component`, () => {
  it('renders without crashing', () => {
    const wrapper = enzyme.mount(<Footer {...mockProps} />);

    expect(wrapper.find('span')).to.have.length(2);
  });
});
