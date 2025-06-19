import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";

const OneRese = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [rese,setRese] = useState();
    const [user,setUser] = useState();
    const { id } = useParams()

    const token = localStorage.getItem("token");

    const fetchData = async () => {
        try{
        const response = await axios.get(`http://localhost:5000/api/reservations/oneRese/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const {x,user} = response.data;
        setRese(x);
        setUser(user);
    }catch(error){
            setError("Błąd podczas wyświerlania rezerwacji: " + error)
        }finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchData()
    },[])

    return (
        <div className="container">
            {loading && <p>⏳ Ładowanie wyników...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}


            {!loading && rese && (
                <div className="container lead border border-dark rounded-4">
                    <h1 className="display-4 my-4">Szczegóły rezerwacji:</h1>
                    <div>
                        <p>Data przyjazdu: {new Date(rese.dateFrom).toISOString().split("T")[0]}</p>
                        <p>Data odjazdu: {new Date(rese.dateTo).toISOString().split("T")[0]}</p>
                    </div>
                    <p>Właściciel: {user.firstName} {user.lastName}</p>
                    <p>Telefon: {user.phoneNumber}</p>
                    <p>Status: Opłacono</p>
                </div>
            )}

        </div>
    )
}
export default OneRese;