import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";

const MyOfferts = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");





    const handleDelete = async (id) => {
        const resoult = window.confirm("Czy napewno chcesz usunąć ogłoszenie?")
        if (resoult) {
            try {
                await axios.delete(`http://localhost:5000/api/listings/delete/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                fetchData();
            }catch(e){
                setError("Błąd podczas usuwania!" + e)
            }
        }

    }

    const fetchData = async () => {
        try{
            const response = await axios.get(`http://localhost:5000/api/listings/offert`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setResults(response.data);
            console.log(response.data);
        }catch(e){

            setError("Błąd ładowania" + e.response.data.message);
            console.error("Błąd podczas pobierania ogłoszenia! " + e);
        }finally {
            setLoading(false);
        }
    }

    useEffect(() => {

        fetchData();

    },[]);



    return (
        <div className="container mt-5">
            <h2 className="mb-4">
                Twoje ogłoszenia
            </h2>


            {loading && <p>⏳ Ładowanie wyników...</p>}
            {!loading && results.length === 0 && <p>😕 Brak wyników dla podanego zapytania.</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="row">
                {results.map((item) => (
                    <div key={item._id} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <img
                                className="card-img-top"
                                src={`http://localhost:5000${item.images[0]}`}
                                alt={item.title}
                                style={{ height: "200px", objectFit: "cover" }}
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{item.title}</h5>
                                <p className="card-text text-truncate">{item.description}</p>
                                <p className="text-muted">{item.location}</p>
                                <a href={`/offer/${item._id}`} className="btn btn-outline-primary mt-auto my-2">
                                    Zobacz więcej
                                </a>
                                <a href={`/personalRese/${item._id}`} className="btn btn-outline-primary mt-auto">
                                    Rezerwacje
                                </a>
                                <div className="row g-2 my-1">
                                    <div className="col">
                                        <a href={`/editPage/${item._id}`} className="btn btn-outline-success w-100">
                                            Edytuj
                                        </a>
                                    </div>
                                    <div className="col">
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="btn btn-outline-danger w-100"
                                        >
                                            Usuń
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

}
export default MyOfferts;