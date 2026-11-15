import type { ReactNode } from 'react';

/**
 * Starts the rendering of the footer
 *
 * @param param0 text of the footer
 * @returns JSX element representing the footer
 */
export const Footer: React.FC<{ text: ReactNode }> = ({ text }) => {
    return (
        <footer style={{
            backgroundColor: 'black',
            color: 'white',
            fontSize: '0.8rem',
            padding: '0.5rem 1rem',
            textAlign: 'center',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100vw',
            boxSizing: 'border-box',
            zIndex: 1000,
        }}>
            {text}
        </footer>
    );
};