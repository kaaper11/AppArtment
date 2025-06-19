import React, {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import {getElement} from "bootstrap/js/src/util";
import axios from "axios";
import {start} from "@popperjs/core";
import { jwtDecode } from "jwt-decode";
import {pem as jwt} from "node-forge";

const AdminUsers = () => {

    const [user, setUser] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('')

    const [warningTexts, setWarningTexts] = useState({}); // klucz: ID użytkownika
    const [activeInput, setActiveInput] = useState(null);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();



    const handleInputChange = (id, value) => {
        setActiveInput(id);
        setWarningTexts((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleDelete = async (id) => {
        const resoult = window.confirm("Czy napewno chcesz usunąć użytkownika?")
        if (resoult) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/deleteUser/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                fetchData()
            }catch(err) {
                setError("Nie udało się usunąć użytkownika " +  err);
            }
        }
    }


    const handleAttention = async (id) => {
        const text = warningTexts[id];

        try{
            setWarningTexts((prev) => {
                const newTexts = { ...prev, [id]: "" };
                return newTexts;
            });
            setActiveInput(null);
            const response = await axios.post(`http://localhost:5000/api/admin//sendDanger/${id}`, {
                message: "Ostrzeżenie administartora: "+text
            })

        }catch(err) {
            setError("Nie udało się wysłać ostrzeżenia: " + err);
        }

    }

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:5000/api/admin/allUsers", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUser(response.data);

        }catch(err) {
            setError("Błąd podczas ładowania: " + err);
        }finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (!token) {
            navigate("/")
        }
        try {
            const decoded = jwtDecode(token);
            if (decoded.role !== "admin") {
                navigate("/");
            }
        }catch(err) {
            console.error("Nieprawidłowy token:" + err);
            navigate("/");
        }
        fetchData();
    },[navigate])

    return (



        <div className='container'>


            {loading && <p>⏳ Ładowanie wyników...</p>}
            {!loading && user.length === 0 && <p>😕 Brak wyników dla podanego zapytania.</p>}

            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className='row'>
                <div className='col-12'>
                    {user.map((usera) => (
                        <div key={usera._id} className="card my-2 lead" >
                                <div className="card-header">
                                    {usera.firstName} {usera.lastName}
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title row">
                                        <div className="col-6">
                                            {usera.email}
                                        </div>
                                        <div className="col-6 d-flex gap-2">
                                            <input className="form-control" value={warningTexts[usera._id] || ""} onChange={(e) =>
                                                handleInputChange(usera._id, e.target.value)
                                            }
                                                   disabled={
                                                       activeInput !== null && activeInput !== usera._id
                                                   } placeholder="Wpisz ostrzeżenie" type="text" />
                                            <button onClick={() => handleAttention(usera._id)} className="btn btn-primary">Wyślij</button>
                                        </div>
                                    </h5>

                                    <p className="card-text">{(new Date(usera.dob)).toISOString().split("T")[0]}</p>
                                    <div className="row">
                                        <div className="col-12">
                                            <button onClick={() => handleDelete(usera._id)} className="btn btn-danger">Usuń użytkownika</button>

                                        </div>
                                    </div>

                                </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AdminUsers;