import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";

const Navbar = ({isLoggedIn, setIsLoggedIn }) => {

    const [name, setName] = useState("");
    const token = localStorage.getItem("token");


    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    }
    const fetchData = async () => {
        try {
            if (localStorage.getItem("token")) {
                const response = await axios.get("http://localhost:5000/api/auth/name", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setName(response.data);
            }
        }catch(err) {
            console.log(err)
        }
    }
    useEffect(() => {
        fetchData();
    },[])

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">AppArtment</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">

                        {!isLoggedIn ? (
                            <>
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Zaloguj się</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/register">Zarejestruj się</Link>
                        </li>

                            </>
                        ) : (
                            <>
                            <li className="nav-item">
                                <button className="nav-link" onClick={handleLogout}>Wyloguj się</button>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/add">Dodaj ogłoszenie</Link>
                            </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/myOfferts">Moje ogłoszenia</Link>
                                </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/myRes">Pobyty</Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/notifiPage">Powiadomienia</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link"  to="/messagesPage">Wiadomości</Link>
                            </li>

                            </>
                            )}

                    </ul>
                    {isLoggedIn && (
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link">{name}</Link>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );

}

export default Navbar;
