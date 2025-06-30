/**
 * Starts the rendering of the footer.
 *
 * @param param0 text of the footer
 * @returns JSX element representing the footer
 */
export const Footer: React.FC<{ text: string }> = ({ text }) => {
    return (
        <footer style={{
            backgroundColor: 'black',
            color: 'white',
            fontSize: '0.8rem',
            padding: '0.5rem 1rem',
            textAlign: 'center',
            position: 'fixed',
            bottom: 0,
            width: '100%',
            zIndex: 1000,
        }}>
            {text}
        </footer>
    );
};