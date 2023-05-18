import { h } from 'preact';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-preact-pure';
import CheckboxGroup from './checkboxgroup.component';

configure({ adapter: new Adapter() });

describe('CheckboxGroup', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const id = 'group';
    const filteredTotal = jest.fn();
    const updateResults = jest.fn();

    beforeEach(() => {
        filteredTotal.mockClear();
        updateResults.mockClear();
    });

    it('renders checkboxes correctly', () => {
        const wrapper = mount(
            <CheckboxGroup
                options={options}
                id={id}
                filteredTotal={filteredTotal}
                updateResults={updateResults}
            />
        );

        expect(wrapper.find('input[type="checkbox"]').length).toBe(options.length);

        options.forEach((option, index) => {
            expect(wrapper.find('label').at(index).text()).toContain(option);
        });
    });

    // etc
});
