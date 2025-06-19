import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";

const MyRes = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");


    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/listings/res`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setResults(response.data)
        }catch(err){
            setError("Błąd ładowania " + err)
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    },[])

    return (
        <div className="container mt-5">
            <h2 className="mb-4">
                Twoje pobyty
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
                                <a href={`/oneRese/${item._id}`} className="btn btn-outline-primary mt-auto">
                                    Szczegóły rezerwacji
                                </a>
                                <div className="row g-2 my-1">
                                    <div className="col">
                                        <a href={`/ratingPage/${item._id}`} className="btn btn-outline-success w-100">
                                            Oceń pobyt
                                        </a>
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

export default MyRes