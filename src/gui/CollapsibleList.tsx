import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Properties of a collapsible list
interface CollapsibleList {
    options: string[];                          // Available options
    defaultText: string;                        // Default option
    onOptionSelect: (option: string) => void;   // Handler to be executed when option is changed
}

/**
 * Renders a button that toggles the visibility of a list of options.
 *
 * When an option has been selected, the passed callback
 * function will be executed.
 *
 * @param options available options
 * @param defaultText default option that is initially selected
 * @param onOptionSelect handler to be executed when option is changed
 *
 * @returns JSX.Element representing the collapsible list component.
 */
export const CollapsibleList: React.FC<CollapsibleList> = ({ options, defaultText, onOptionSelect }) => {
    const [isListOpen, setIsListOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string>(defaultText);

    const onClickEvent = (option: string) => {
        setSelectedOption(option);
        onOptionSelect(option);
        setIsListOpen(false);
    };

    return (
        <div className="d-flex flex-column">
            <button
                className="btn btn-light btn-outline-primary d-flex align-items-center justify-content-center mb-2"
                onClick={() => setIsListOpen(prevState => !prevState)}
            >
                <span className="me-2">{selectedOption}</span>
                {isListOpen ? (<FaChevronUp />) : (<FaChevronDown />)}
            </button>

            {isListOpen && (
                <ul className="list-group">
                    {options.map((option) => (
                        <li
                            key={option}
                            className="list-group-item text-center"
                            onClick={() => onClickEvent(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};