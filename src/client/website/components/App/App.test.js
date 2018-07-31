import React from 'react';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import { expect } from 'chai';
import { BrowserRouter } from 'react-router-dom';
import App from './index';
import enzyme from '../../services/test/enzymeWithProviders';

const mockProps = {
  classes: {
    app: 'app'
  },
  changeLanguage: () => {}
};

const mockContext = {
  socket: {},
  store: configureMockStore()({
    user: {},
    retro: {
      join: {}
    }
  })
};

const childContextTypes = {
  socket: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
};

describe(`${App.name} component`, () => {
  it('renders without crashing with mock minimal props', () => {
    const wrapper = enzyme.mount(
      <BrowserRouter>
        <App {...mockProps}>
          <div className="test">Test</div>
        </App>
      </BrowserRouter>,
      { context: mockContext, childContextTypes }
    );
    expect(wrapper.find('Header'), 'Header').to.have.length(1);
    expect(wrapper.find('section'), 'section').to.have.length(1);
    expect(wrapper.find('div.test'), 'div.test').to.have.length(1);
    expect(wrapper.find('Footer'), 'Footer').to.have.length(1);
  });
  it('renders without crashing with children', () => {
    const wrapper = enzyme.mount(
      <BrowserRouter>
        <App
          headerChildren={<div className="testHeader">Header</div>}
          dialogChildren={<div className="testDialogs">Content</div>}
          {...mockProps}
        >
          <div className="test">Test</div>
        </App>
      </BrowserRouter>,
      {
        context: mockContext,
        childContextTypes
      }
    );

    expect(wrapper.find('Header'), 'Header').to.have.length(1);
    expect(wrapper.find('section'), 'section').to.have.length(1);
    expect(wrapper.find('div.test'), 'div.test').to.have.length(1);
    expect(wrapper.find('div.testHeader'), 'div.testHeader').to.have.length(1);
    expect(wrapper.find('div.testDialogs'), 'div.testDialogs').to.have.length(1);
    expect(wrapper.find('Footer'), 'Footer').to.have.length(1);
  });
});
