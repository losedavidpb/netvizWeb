import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Declaration of a collapsible list
interface CollapsibleList {
    options: string[];
    defaultText: string;
    onOptionSelect: (option: string) => void;
}

const CollapsibleList: React.FC<CollapsibleList> = ({ options, defaultText, onOptionSelect }) => {
    const [isListOpen, setIsListOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string>(defaultText);

    const handleOptionSelect = (option: string) => {
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
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className="list-group-item text-center"
                            onClick={() => handleOptionSelect(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CollapsibleList;