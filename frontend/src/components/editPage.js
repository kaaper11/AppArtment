import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import Add from "./add";

const EditPage = () => {

    const today = new Date().toISOString().split("T")[0];
    let tomorrow = new Date();
    let next2weeks = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1);
    next2weeks.setDate(tomorrow.getDate() + 14);
    tomorrow = tomorrow.toISOString().split("T")[0];
    next2weeks = next2weeks.toISOString().split("T")[0];

    let dataStart = useRef(null);
    let dataEnd = useRef(null);

    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        setDateFrom(newStartDate);

        const min = addDays(newStartDate, 1);
        const max = addDays(newStartDate, 14);

        if (dataEnd.current) {
            dataEnd.current.min = min;
        }

        dataEnd.current.value = '';
    };

    const addDays = (dateStr, days) => {
        const date = new Date(dateStr);
        date.setDate(date.getDate() + days);
        return date.toISOString().split("T")[0];
    }

    const {id} = useParams();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [location, setLocation] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [images, setImages] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            console.log("Brak tokenu");
            return;
        }

        const formData = new FormData();
        formData.append("data", JSON.stringify({
            title,
            description,
            price,
            location,
            anvalible_dates: [dateFrom, dateTo]
        }));

        images.forEach((image) => {
            formData.append("images", image);
        })

        console.log("🧪 Wysyłane dane:");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            const res = await axios.put(`http://localhost:5000/api/listings/update/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            //console.log("✅ Sukces:", res.data);
            setSuccessMessage("Ogłoszenie zostało zaktualizowane!");
        } catch (err) {
            console.error("❌ Błąd:", err.response?.data || err.message);
            setError("Wystąpił błąd podczas edytowania ogłoszenia." + err);
        }


    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="container">
                <div class="form-group">
                    <label for="exampleFormControlInput1" className="lead">Tytuł ogłoszenia</label>
                    <input type="text" className="form-control" onChange={(e) => setTitle(e.target.value)} required/>
                </div>
                <div class="form-group">
                    <label for="exampleFormControlInput1" className="lead">Opis ogłoszenia</label>
                    <textarea className="form-control" id="exampleFormControlInput1" onChange={(e) => setDescription(e.target.value)}  required></textarea>
                </div>
                <div class="form-group">
                    <label for="exampleFormControlInput1" className="lead">Cena za jedną noc</label>
                    <input type="number" className="form-control" placeholder="Cena" onChange={(e) => setPrice(e.target.value)} required />
                </div>
                <div class="form-group">
                    <label for="exampleFormControlInput1" className="lead">Lokalizacja</label>
                    <input type="text" className="form-control" onChange={(e) => setLocation(e.target.value)} required />
                </div>
                <div class="form-group">
                    <div className="row">
                        <div className="col-6">
                            <label htmlFor="exampleFormControlInput1" className="lead">Dostępność od</label>
                            <input type="date" className="form-control" min = {today}  ref={dataStart} onChange={handleStartDateChange}  required />
                        </div>
                        <div className="col-6">
                            <label htmlFor="exampleFormControlInput1" className="lead">Dostępność do</label>
                            <input type="date" ref={dataEnd} className="form-control" onChange={(e) => setDateTo(e.target.value)} required />
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label htmlFor="exampleFormControlInput1" className="lead">Zdjęcia obiektu</label>
                    <input type="file" className="form-control" accept="image/*" multiple  onChange={(e) => setImages(Array.from(e.target.files))}  required />
                </div>
                <div class="form-group mt-4">
                    <button className="btn btn-primary mb-2" type="submit">Dodaj ogłoszenie</button>
                </div>
                {successMessage && <p>{successMessage}</p>}
                {error && <p style={{color: "red"}}>{error}</p>}
            </div>
        </form>
    );
}

export default EditPage;