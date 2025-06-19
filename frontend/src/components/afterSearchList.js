import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function AfterSearchList() {
    const location = useLocation();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");
    const dateFrom = queryParams.get("dateFrom");
    const dateTo = queryParams.get("dateTo");

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/listings/search`, {
                    params: { location: query, title: query, dateFrom: dateFrom, dateTo: dateTo },
                });
                setResults(response.data);
            } catch (err) {
                console.error("Błąd podczas pobierania ogłoszeń:", err);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchResults();
        }
    }, [query]);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">
                Wyniki wyszukiwania dla: <span className="text-primary">{query}</span>
            </h2>

            {loading && <p>⏳ Ładowanie wyników...</p>}
            {!loading && results.length === 0 && <p>😕 Brak wyników dla podanego zapytania.</p>}

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
                                <a href={`/offer/${item._id}`} className="btn btn-outline-primary mt-auto">
                                    Zobacz więcej
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AfterSearchList;
