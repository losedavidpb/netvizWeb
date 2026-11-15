import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Properties of a collapsible list
interface CollapsibleList {
    options: string[];                          // Available options
    selectedOption: string;                     // Currently selected option
    onOptionSelect: (option: string) => void;   // Handler to be executed when option is changed
}

/**
 * Renders a button that toggles the visibility of a list of options
 *
 * @param options available options
 * @param selectedOption option that is currently selected
 * @param onOptionSelect handler to be executed when option is changed
 *
 * @returns JSX.Element representing the collapsible list component
 */
export const CollapsibleList: React.FC<CollapsibleList> = ({ options, selectedOption, onOptionSelect }) => {
    const [isListOpen, setIsListOpen] = useState(false);

    const onClickEvent = (option: string) => {
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