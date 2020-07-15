import React from 'react';
import { mount, shallow } from 'enzyme';

import Keypad from './Keypad';

describe('Keypad', () => {
    let wrapper;
    beforeEach(() => wrapper = shallow(
        <Keypad
            numbers={[]}
            operators={[]}
            callOperator={jest.fn()}
            setOperator={jest.fn()}
            updateDisplay={jest.fn()}
        />
    ));

    it('should render correctly', () => expect(wrapper).toMatchSnapshot());

    it('should render 4 <div />', () => expect(wrapper.find('div').length).toEqual(4));

    it('should render a Key component for each number, operator and submit', () => {
        const numbers = ['0', '1', '2'];
        const operators = ['+', '-', '*', '/'];
        wrapper.setProps({ numbers, operators });
        expect(wrapper.find('Key').length).toEqual(numbers.length + operators.length + 1);
    });
});

describe('mounted Keypad', () => {
    let wrapper;
    beforeEach(() => wrapper = mount(
        <Keypad
            numbers={[]}
            operators={[]}
            callOperator={jest.fn()}
            setOperator={jest.fn()}
            updateDisplay={jest.fn()}
        />
    ));

    it('should render the values of numbers to the DOM', () => {
        wrapper.setProps({ numbers: ['0', '1', '2'] });
        expect(wrapper.find('.numbers-container').text()).toEqual('012');
    });

    it('should render the values of operators to the DOM', () => {
        wrapper.setProps({ operators: ['+', '-', '*', '/'] });
        expect(wrapper.find('.operators-container').text()).toEqual('+-*/');
    });
});


