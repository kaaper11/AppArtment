import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";

const NotifiPage = () => {
    const [notifi, setNotifi] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    const handleDelete = async (id) => {
        try{
            await axios.delete(`http://localhost:5000/api/notifications/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            fetchData()
        }catch(err){
            setError("Nie udało się usunąć ogłoszenia" + err);
        }
    }

    const fetchData = async () => {
        setLoading(true);
        try{
            const response = await axios.get(`http://localhost:5000/api/notifications/notifi`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setNotifi(response.data);
        }catch (error) {
            setError("Błąd ładowania" + error.response.data.message);
        }finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
    },[])

    return(
        <div className="container">
            <h2 className="my-4 text-center display-5">Powiadomienia</h2>
            {loading && <p>⏳ Ładowanie wyników...</p>}
            {!loading && notifi.length === 0 && <p>😕 Brak wyników dla podanego zapytania.</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="col-12">
                {notifi.map((item) => (
                    <div key={item._id}  className="card w-75 my-2 mx-auto">
                        <div className="card-body">
                            <h5 className="card-title">{item.type}</h5>
                            <div className="row">
                                <div className="col-10">
                                    <p className="card-text">{item.message}</p>
                                    <button onClick={() => handleDelete(item._id)} className="btn btn-outline-danger">Usuń</button>
                                </div>
                                <div className="col-2">
                                    {/*{item.type === "Rezerwacja" && <button className="btn btn-outline-primary">Przejdź do rezerwacji</button>}*/}
                                    {/*{item.type === "Informacja" && <button className="btn btn-outline-primary">Przejdź do ogłoszenia</button>}*/}
                                    {/*{item.type === "Uwaga" && <button className="btn btn-outline-primary">Kontakt</button>}*/}
                                    {/*{item.type === "Ocena" && <button className="btn btn-outline-primary">Zobacz oceny</button>}*/}
                                    <p className="my-2" >{item.time}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

        </div>


    )

}
export default NotifiPage;