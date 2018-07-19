import React from 'react';
import * as sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Button } from 'material-ui';

import GroupCardsDialog from './GroupCardsDialog';

const context = { socket: { value: 'lsllss' } };
const createTestSubject = props => shallow(<GroupCardsDialog {...props} />, { context });
const DEFAULT_PROPS = {
  removeCard: () => {
  },
  editCard: () => {
  },
  closeDialog: () => {
  },
  open: true,
  cardToGroup: {
    from: {
      id: 'NaN NaN',
      columnId: 'FooBar',
      text: 'test text'
    },
    to: {
      id: 'NaN NaN',
      columnId: 'FooBar',
      text: 'test text'
    }
  }
};
const generateTestProps = ({ closeDialog, cardToGroup, removeCard, editCard, open }) => ({
  closeDialog,
  cardToGroup,
  removeCard,
  editCard,
  open
});

describe('GroupCardsDialog', () => {
  it('should render a dialog component', () => {
    const subject = createTestSubject(generateTestProps(DEFAULT_PROPS));
    subject.update();
    const buttons = subject.find(Button);
    expect(buttons).to.have.length(2);
  });

  it('should run closeDialog on cancel button click', () => {
    let wasTriggered = false;
    const testProps = {
      ...DEFAULT_PROPS,
      closeDialog: () => {
        wasTriggered = !wasTriggered;
      }
    };

    const subject = createTestSubject(testProps);
    const button = subject.find(Button).at(0);
    button.simulate('click');
    expect(wasTriggered).to.be.equal(true);
  });

  it('should run removeCard on confirm button click', (done) => {
    const testProp = {
      ...DEFAULT_PROPS,
      removeCard: sinon.spy()
    };

    const subject = createTestSubject(testProp);
    const button = subject.find(Button).at(1);
    button.simulate('click');
    setTimeout(() => {
      expect(testProp.removeCard.calledOnce).to.be.equal(true);
      done();
    }, 1);
  });

  it('should run editCard on confirm button click', (done) => {
    const testProp = {
      ...DEFAULT_PROPS,
      editCard: sinon.spy()
    };

    const subject = createTestSubject(testProp);
    const button = subject.find(Button).at(1);
    button.simulate('click');
    setTimeout(() => {
      expect(testProp.editCard.calledOnce).to.be.equal(true);
      done();
    }, 1);
  });

  it('should run editCard on confirm button click', (done) => {
    const expectedText = `${DEFAULT_PROPS.cardToGroup.from.text}\n\n${DEFAULT_PROPS.cardToGroup.to.text}`;
    const expectedID = DEFAULT_PROPS.cardToGroup.to.id;
    const testProp = {
      ...DEFAULT_PROPS,
      editCard: sinon.spy()
    };

    const subject = createTestSubject(testProp);
    const button = subject.find(Button).at(1);
    button.simulate('click');
    setTimeout(() => {
      expect(testProp.editCard
        .calledWith(context.socket, { id: expectedID, text: expectedText })).to.be.equal(true);
      done();
    }, 1);
  });
});
