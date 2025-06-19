import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";

const PersonalRese = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [rese,setRese] = useState([]);
    const [names, setNames] = useState([]);
    const { id } = useParams();

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const fetchData = async () => {
        try{
        const response = await axios.get(`http://localhost:5000/api/reservations/persRes/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const {rese, names} = response.data;
        setRese(rese);
        setNames(names);

    }catch(err){
            setError("Błąd w wyświetlaniu rezerwacji: " + err);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    },[])


    return (
        <div className="container">

            {loading && <p>⏳ Ładowanie wyników...</p>}
            {!loading && rese.length === 0 && rese.length === 0 && (
                <p>😕 Brak wyników dla podanego zapytania.</p>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="row">
                {rese.map((item, index) => (
                    <div key={item._id}>
                        <div className="card text-center my-2">
                            <div className="card-header lead">
                                {names[index]}
                            </div>
                            <div className="card-body lead">
                                <h5 className="card-title">Id rezerwacji: {item._id}</h5>
                                <p className="card-text">Od: { new Date(item.dateFrom).toISOString().split("T")[0]} Do: {new Date(item.dateTo).toISOString().split("T")[0]}</p>
                            </div>
                            <div className="card-footer text-muted lead">
                                Opłacony
                            </div>
                        </div>
                    </div>
                ))}
            </div>


        </div>
    )
}

export default PersonalRese;