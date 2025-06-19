import React, {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import {getElement} from "bootstrap/js/src/util";
import axios from "axios";
import {start} from "@popperjs/core";
import { jwtDecode } from "jwt-decode";
import {pem as jwt} from "node-forge";
import AdminStartPage from "./adminStartPage";

const AdminListings = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [warningTexts, setWarningTexts] = useState({}); // klucz: ID użytkownika
    const [activeInput, setActiveInput] = useState(null);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();


    const [list, setList] = useState([]);


    const handleInputChange = (id, value) => {
        setActiveInput(id);
        setWarningTexts((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleAttention = async (id, ids) => {
        const text = warningTexts[ids];

        try{
            setWarningTexts((prev) => {
                const newTexts = { ...prev, [ids]: "" };
                return newTexts;
            });
            setActiveInput(null);
            const response = await axios.post(`http://localhost:5000/api/admin/sendDanger/${id}`, {
                message: "Ostrzeżenie administartora: "+text
            })

        }catch(err) {
            setError("Nie udało się wysłać ostrzeżenia: " + err);
        }

    }

    const handleFull = async (id) => {
        navigate(`/offer/${id}`);
    }

    const handleDelete = async (id) => {
        const resoult = window.confirm("Czy napewno chcesz usunąć ogłoszenie?")
        if (resoult) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/deleteListing/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                fetchData()
            }catch(err) {
                setError("Nie udało się usunąć ogłoszenia " +  err);
            }
        }
    }



            const fetchData = async () => {
        try{
            const response = await axios.get("http://localhost:5000/api/admin/allListings", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setList(response.data);
        }catch(err){
            setError("Błąd podczas wyświetlania" + err);
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

    return(
        <div className="container">
            {loading && <p>⏳ Ładowanie wyników...</p>}
            {!loading && list.length === 0 && <p>😕 Brak wyników dla podanego zapytania.</p>}

            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className='row'>
                <div className='col-12'>
                    {list.map((usera) => (
                        <div key={usera._id} className="card my-2 lead" >
                            <div className="card-header">
                                {usera.title}
                            </div>
                            <div className="card-body">
                                <h5 className="card-title row">
                                    <div className="col-6 text-truncate">
                                        {usera.description}
                                    </div>
                                    <div className="col-6 d-flex gap-2">
                                        <input className="form-control" value={warningTexts[usera._id] || ""} onChange={(e) =>
                                            handleInputChange(usera._id, e.target.value)
                                        }
                                               disabled={
                                                   activeInput !== null && activeInput !== usera._id
                                               } placeholder="Wpisz ostrzeżenie" type="text" />
                                        <button onClick={() => handleAttention(usera.owner,usera._id)} className="btn btn-primary">Wyślij</button>
                                    </div>
                                </h5>

                                <p className="card-text">{usera.location} </p>
                                <div className="row">
                                    <div className="col-6">
                                        <button onClick={() => handleDelete(usera._id)}  className="btn btn-danger">Usuń ogłoszenie</button>
                                    </div>
                                    <div className="col-6 text-end">
                                        <button onClick={() => handleFull(usera._id)} className="btn btn-primary">Zobacz całe ogłoszenie</button>
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
export default AdminListings;