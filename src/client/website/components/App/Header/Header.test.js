import React from 'react';
import { expect } from 'chai';
import Header from './Header';
import enzymeIntl from '../../../services/test/enzymeWithProviders';

const spy = jest.fn();

const mockProps = {
  classes: {
    appBar: 'appBar',
    actionButtons: 'actionButtons',
    appLogo: 'appLogo',
    headline: 'headline',
    logoIcon: 'logoIcon',
    icon: 'icon'
  },
  leaveRetro: spy,
  openChangeNameDialog: () => {}
};

describe(`${Header.name} component`, () => {
  it('renders without crashing', () => {
    const wrapper = enzymeIntl.shallow(
      <Header {...mockProps} isOpen>
        <div className="test">Test</div>
      </Header>
    );

    expect(wrapper.find('div.test'), 'div.test').to.have.length(1);
  });
});
