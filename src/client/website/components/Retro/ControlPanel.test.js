import React from 'react';
import * as sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Switch, TextField } from 'material-ui';
import ControlPanel from './ControlPanel';

const createTestSubject = props => shallow(<ControlPanel {...props} />);
const DEFAULT_PROPS = {
  sort: false,
  // Functions
  filterCardsBy: () => {
  },
  toggleSortByVotes: () => {
  },
  classes: {
    column: 'someString',
    columns: 'someString'
  }
};
const generateTestProps = ({ sort, filterCardsBy, toggleSortByVotes, classes }) => ({
  sort,
  filterCardsBy,
  toggleSortByVotes,
  classes
});

describe('ControlPanel', () => {
  it('Should trigger toggleSortByVotes', () => {
    const testProps = {
      ...DEFAULT_PROPS,
      toggleSortByVotes: sinon.spy()
    };
    const subject = createTestSubject(generateTestProps(testProps));
    const switchComponent = subject.find(Switch);
    switchComponent.simulate('change');
    expect(testProps.toggleSortByVotes.calledOnce).to.be.equal(true);
  });

  it('Should trigger filterCardsBy when search term is provided', () => {
    const testProps = {
      ...DEFAULT_PROPS,
      filterCardsBy: sinon.spy()
    };
    const subject = createTestSubject(generateTestProps(testProps));
    const textField = subject.find(TextField);
    textField.simulate('change', { target: { value: '' } });
    expect(testProps.filterCardsBy.calledOnce).to.be.equal(true);
  });

  it('Should trigger filterCardsBy with empty string if input lenght is less then 2', () => {
    const testProps = {
      ...DEFAULT_PROPS,
      filterCardsBy: sinon.spy()
    };
    const subject = createTestSubject(generateTestProps(testProps));
    const textField = subject.find(TextField);
    textField.simulate('change', { target: { value: '' } });
    expect(testProps.filterCardsBy.calledWith()).to.be.equal(true);
  });

  it('Should trigger filterCardsBy with search term when input length >= 2', () => {
    const testProps = {
      ...DEFAULT_PROPS,
      filterCardsBy: sinon.spy()
    };
    const searchTerm = 'look its me';
    const subject = createTestSubject(generateTestProps(testProps));
    const textField = subject.find(TextField);
    textField.simulate('change', { target: { value: searchTerm } });
    expect(testProps.filterCardsBy.calledWith(searchTerm)).to.be.equal(true);
  });
});
