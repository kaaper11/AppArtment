import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';

const Lowbar = () => {

    return (
        <footer className="mt-4" style={{
            backgroundColor: '#f8f9fa',  // jasny szary odcień
            color: '#6c757d',             // delikatny ciemnoszary tekst
            padding: '20px 0',
            textAlign: 'center',
            fontSize: '16px',
            fontFamily: 'Poppins, sans-serif',
            marginTop: 'auto'
        }}>
            AppArtment 2025
        </footer>
    )
}

export default Lowbar;