import React, { useEffect, useState } from "react";
import axios from "axios";

const MessagesPage = () => {
    const token = localStorage.getItem("token");

    const [myres, setMyres] = useState([]);
    const [names, setNames] = useState([]);
    const [ires, setIres] = useState([]);
    const [dates, setDates] = useState([]);
    const [rese2, setRese2] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [names2, setNames2] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);

            const response = await axios.get("http://localhost:5000/api/reservations/myres", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { rese, finish, name } = response.data;

            setMyres(rese);
            setNames(finish);
            setDates(name);

            const response2 = await axios.get("http://localhost:5000/api/reservations/ires", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { list, name2, rese2 } = response2.data;

            setIres(list);
            setNames2(name2); // np. ["Właściciel 1", "Właściciel 2"]
            setRese2(rese2);  // [{ _id, idUser, idListing, dateFrom, dateTo }]
        } catch (err) {
            setError("Błąd podczas ładowania: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="container">
            <h2 className="my-4 text-center display-5">Wiadomości</h2>

            {loading && <p>⏳ Ładowanie wyników...</p>}
            {!loading && ires.length === 0 && myres.length === 0 && (
                <p>😕 Brak wyników dla podanego zapytania.</p>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Wiadomości z Twoich lokali */}
            <div className="row">
                <p className="lead">Wiadomości z Twoich lokali</p>
                {myres.map((item, index) => {
                    const relatedDates = dates.filter((d) => d.idListing === item._id);
                    const relatedName = names[index] || "Nieznany użytkownik";

                    return relatedDates.map((d) => (
                        <div className="col-12 mb-3" key={d._id}>
                            <div className="card">
                                <h5 className="card-header lead">{item.title}</h5>
                                <div className="card-body">
                                    <h5 className="card-title lead">Rozmawiaj z: {relatedName}</h5>
                                    <p className="card-text lead">
                                        Od: {new Date(d.dateFrom).toISOString().split("T")[0]}{" "}
                                        Do: {new Date(d.dateTo).toISOString().split("T")[0]}
                                    </p>
                                    <a
                                        href={`/messenger/${item.owner}/${d.idUser}/${item._id}`}
                                        className="btn btn-primary"
                                    >
                                        Przejdź do chatu
                                    </a>
                                </div>
                            </div>
                        </div>
                    ));
                })}
            </div>

            {/* Wiadomości z Twoich pobytów */}
            <div className="row mt-4">
                <p className="lead">Wiadomości z Twoich pobytów</p>
                {ires.map((item, index) => {
                    const relatedDates = rese2.filter((d) => d.idListing === item._id);
                    const relatedName = names2[index] || "Nieznany właściciel";

                    return relatedDates.map((d) => (
                        <div className="col-12 mb-3" key={d._id}>
                            <div className="card">
                                <h5 className="card-header lead">{item.title}</h5>
                                <div className="card-body">
                                    <h5 className="card-title lead">Rozmawiaj z: {relatedName}</h5>
                                    <p className="card-text lead">
                                        Od: {new Date(d.dateFrom).toISOString().split("T")[0]}{" "}
                                        Do: {new Date(d.dateTo).toISOString().split("T")[0]}
                                    </p>
                                    <a
                                        href={`/messenger/${d.idUser}/${item.owner}/${item._id}`}
                                        className="btn btn-primary"
                                    >
                                        Przejdź do chatu
                                    </a>
                                </div>
                            </div>
                        </div>
                    ));
                })}
            </div>
        </div>
    );
};

export default MessagesPage;
