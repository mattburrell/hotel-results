import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

export interface CheckboxGroupProps {
    options: string[];
    id: string;
    filteredTotal: (option: string) => number;
    updateResults: (selected: string[]) => void;
}

export default function CheckboxGroup({ options, id, filteredTotal, updateResults }: CheckboxGroupProps) {
    const [checkboxes, setCheckboxes] = useState(() =>
        options.reduce((obj, option) => {
            obj[`${id}-${option.replace(/\s/g, '-')}`] = false;
            return obj;
        }, {})
    );

    const handleCheckboxChange = (event: any) => {
        const { name, checked } = event.target;
        setCheckboxes((prevCheckboxes) => ({
            ...prevCheckboxes,
            [name]: checked
        }));
    };

    useEffect(() => {
        updateResults(Object.keys(checkboxes).filter((key) => checkboxes[key]).map((key) => key.replace(`${id}-`, '').replace(/-/g, ' ')));
    }, [checkboxes, updateResults]);

    return (
        <ul>
            {options.map((option) => {
                const sanitizedOption = option.replace(/\s/g, '-');
                const total = filteredTotal(option);
                return (
                    <li key={sanitizedOption}>
                        <input
                            type="checkbox"
                            id={`${id}-${sanitizedOption}`}
                            name={`${id}-${sanitizedOption}`}
                            checked={checkboxes[`${id}-${sanitizedOption}`]}
                            disabled={total === 0}
                            onChange={handleCheckboxChange} />
                        <label for={`${id}-${sanitizedOption}`}>{option}
                            {total > 0 && <span aria-label={`Count: ${total}`}>{` (${total})`}</span>}
                        </label>
                    </li>
                )
            })}
        </ul>
    );
}
