import React, {useState} from "react";
import axios from "axios";
import App from "../App";
import { useNavigate } from "react-router-dom";


function Login({setIsLoggedIn}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password
            });
            //console.log(response.data);

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                setIsLoggedIn(false);
                setSuccessMessage("Zalogowano pomyślnie!");
                navigate("/");
                window.location.reload();
            } else {
                setError("Błąd logowania!");
            }
        } catch (err) {
            console.log(err);
            if (err.response && err.response.data) {
                setError(err.response.data.message);
            } else {
                setError("Wystąpił problem z połączeniem!");
            }
        }
    };


    return (
        <div className="container">
            <h1 className="my-4 text-center display-5">Logowanie</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label lead">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label lead">Hasło</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Zaloguj się</button>
            </form>
        </div>
    );
}

export default Login;
