import React from 'react';
import { shallow, mount } from 'enzyme';

import Calculator from './Calculator';
import Display from '../Display/Display';
import Keypad from '../Keypad/Keypad';

describe('Calculator', () => {
    let wrapper;
    beforeEach(() => wrapper = shallow(<Calculator />));

    it('should render correctly', () => expect(wrapper).toMatchSnapshot());

    it('should render a <div />', () => expect(wrapper.find('div').length).toEqual(1));

    it('should render the Display component', () => expect(wrapper.containsAllMatchingElements([
        (<Display displayValue={wrapper.instance().state.displayValue} />),
        (<Keypad
            numbers={wrapper.instance().state.numbers}
            operators={wrapper.instance().state.operators}
            callOperator={wrapper.instance().callOperator}
            setOperator={wrapper.instance().setOperator}
            updateDisplay={wrapper.instance().updateDisplay}
        />)
    ])).toEqual(true));
});

describe('mounted Calculator', () => {
    let wrapper;
    beforeEach(() => wrapper = mount(<Calculator />));

    it('should call updateDisplay when a number Key component is clicked', () => {
        const spy = jest.spyOn(wrapper.instance(), 'updateDisplay');
        wrapper.instance().forceUpdate();
        expect(spy).toHaveBeenCalledTimes(0);
        wrapper.find('.number-key').first().simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call setOperator when an operator Key component is clicked', () => {
        const spy = jest.spyOn(wrapper.instance(), 'setOperator');
        wrapper.instance().forceUpdate();
        expect(spy).toHaveBeenCalledTimes(0);
        wrapper.find('.operator-key').first().simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call callOperator when the submit Key component is clicked', () => {
        const spy = jest.spyOn(wrapper.instance(), 'callOperator');
        wrapper.instance().forceUpdate();
        expect(spy).toHaveBeenCalledTimes(0);
        wrapper.find('.submit-key').first().simulate('click');
        expect(spy).toHaveBeenCalledTimes(1);
    });
});

describe('updateDisplay', () => {
    let wrapper;
    beforeEach(() => wrapper = shallow(<Calculator />));

    it('should update displayValue', () => {
        wrapper.instance().updateDisplay('1');
        expect(wrapper.state('displayValue')).toEqual('1');
    });

    it('should concatenate displayValue', () => {
        wrapper.instance().updateDisplay('1');
        wrapper.instance().updateDisplay('2');
        expect(wrapper.state('displayValue')).toEqual('12');
    });

    it('should remove leading "0" from displayValue', () => {
        wrapper.instance().updateDisplay('0');
        expect(wrapper.state('displayValue')).toEqual('0');
        wrapper.instance().updateDisplay('1');
        expect(wrapper.state('displayValue')).toEqual('1');
    });

    it('should prevent multiple leading "0" in displayValue', () => {
        wrapper.instance().updateDisplay('0');
        wrapper.instance().updateDisplay('0');
        expect(wrapper.state('displayValue')).toEqual('0');
    });

    it('should prevent multiple "." in displayValue', () => {
        wrapper.instance().updateDisplay('.');
        wrapper.instance().updateDisplay('.');
        expect(wrapper.state('displayValue')).toEqual('.');
    });

    it('should remove last char from displayValue', () => {
        wrapper.instance().updateDisplay('1');
        wrapper.instance().updateDisplay('2');
        wrapper.instance().updateDisplay('ce');
        expect(wrapper.state('displayValue')).toEqual('1');
    });

    it('should set displayValue to "0" if displayValue is empty string', () => { 
        wrapper.instance().updateDisplay('ce');
        expect(wrapper.state('displayValue')).toEqual('0');
    });
});

describe('setOperator', () => {
    let wrapper;
    beforeEach(() => wrapper = shallow(<Calculator />));

    it('should update selectedOperator', () => {
        wrapper.instance().setOperator('+');
        expect(wrapper.state('selectedOperator')).toEqual('+');
    });

    it('should update storedValue', () => {
        wrapper.setState({ displayValue: '1' });
        wrapper.instance().setOperator('+');
        expect(wrapper.state('storedValue')).toEqual('1');
    });

    it('should set displayValue to "0"', () => {
        wrapper.setState({ displayValue: '1' });
        wrapper.instance().setOperator('+');
        expect(wrapper.state('displayValue')).toEqual('0');
    });

    it('should not update storedValue if selectedOperator is not empty string', () => {
        wrapper.setState({ displayValue: '1' });
        wrapper.instance().setOperator('+');
        wrapper.instance().setOperator('-');
        expect(wrapper.state('storedValue')).toEqual('1');
    });
});

describe('callOperator', () => {
    let wrapper;
    beforeEach(() => wrapper = shallow(<Calculator />));

    it('should set displayValue to the sum of storedValue and displayValue', () => {
        wrapper.setState({ storedValue: '1' });
        wrapper.setState({ displayValue: '2' });
        wrapper.setState({ selectedOperator: '+' });
        wrapper.instance().callOperator();
        expect(wrapper.state('displayValue')).toEqual('3');
    });

    it('should set displayValue to the difference of storedValue and displayValue', () => {
        wrapper.setState({ storedValue: '1' });
        wrapper.setState({ displayValue: '2' });
        wrapper.setState({ selectedOperator: '-' });
        wrapper.instance().callOperator();
        expect(wrapper.state('displayValue')).toEqual('-1');
    });

    it('should set displayValue to the product of storedValue and displayValue', () => {
        wrapper.setState({ storedValue: '1' });
        wrapper.setState({ displayValue: '2' });
        wrapper.setState({ selectedOperator: 'x' });
        wrapper.instance().callOperator();
        expect(wrapper.state('displayValue')).toEqual('2');
    });

    it('should set displayValue to the quotient of storedValue and displayValue', () => {
        wrapper.setState({ storedValue: '1' });
        wrapper.setState({ displayValue: '2' });
        wrapper.setState({ selectedOperator: '/' });
        wrapper.instance().callOperator();
        expect(wrapper.state('displayValue')).toEqual('0.5');
    });

    it('should set displayValue to the sum of storedValue and displayValue', () => {
        wrapper.setState({ storedValue: '1' });
        wrapper.setState({ displayValue: '2' });
        wrapper.setState({ selectedOperator: '+' });
        wrapper.instance().callOperator();
        expect(wrapper.state('displayValue')).toEqual('3');
    });

    it('should set displayValue to "0" if operation results in "NaN"', () => {
        wrapper.setState({ storedValue: '1' });
        wrapper.setState({ displayValue: 'string' });
        wrapper.setState({ selectedOperator: '/' });
        wrapper.instance().callOperator();
        expect(wrapper.state('displayValue')).toEqual('0');
    });

    it('should set displayValue to "0" if operation results in "Infinity"', () => {
        wrapper.setState({ storedValue: '1' });
        wrapper.setState({ displayValue: '0' });
        wrapper.setState({ selectedOperator: '/' });
        wrapper.instance().callOperator();
        expect(wrapper.state('displayValue')).toEqual('0');
    });

    it('should set displayValue to "0" if selectedOperator is not an operator', () => {
        wrapper.setState({ storedValue: '1' });
        wrapper.setState({ displayValue: '2' });
        wrapper.setState({ selectedOperator: 'string' });
        wrapper.instance().callOperator();
        expect(wrapper.state('displayValue')).toEqual('0');
    });
    
});
