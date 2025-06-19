import React, {useState} from "react";
import axios from "axios";

const Register = () => {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [dob, setDob] = useState("");
const [phoneNumber,setPhoneNumber] = useState("");
const [error, setError] = useState("");
const [successMessage, setSuccessMessage] = useState('');

const handleSubmit = async (e) => {
    e.preventDefault();

try {
    const response = await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password,
        firstName,
        lastName,
        dob,
        phoneNumber
    })
    setSuccessMessage(response.data.message);
    setError("");
    console.log(response.data);
    window.location.href = "http://localhost:3000/login";
}catch(err) {
    setError("Rejestrac nie powiodła się!");
    setError("");
}
}

return (
    <div>
        <h2>Rejestracja</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

        <form onSubmit={handleSubmit}>
            <div className="container lead">
                <div className="form-group">
                    <label className="lead">Email:</label>
                    <input className="form-control"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </div>
                <div>
                    <label className="lead">Hasło:</label>
                    <input className="form-control"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </div>
                <div>
                    <label className="lead">Imię:</label>
                    <input className="form-control"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    />
                </div>
                <div>
                    <label className="lead">Nazwisko:</label>
                    <input className="form-control"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    />
                </div>
                <div>
                    <label className="lead">Data urodzenia:</label>
                    <input className="form-control"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    />
                </div>
                <div>
                    <label className="lead">Numer telefonu:</label>
                    <input className="form-control"
                           type="text"
                           value={phoneNumber}
                           onChange={(e) => setPhoneNumber(e.target.value)}
                           required
                    />
                </div>
                <div>
                    <button type="submit"  className="btn btn-primary my-2">Zarejestruj się!</button>
                </div>
            </div>
        </form>
    </div>
)
}

export default Register;