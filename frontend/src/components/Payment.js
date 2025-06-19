import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import { useParams, Link, useLocation} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Tab, ListGroup } from 'react-bootstrap';

const Payment = () => {

    const location = useLocation();
    const seatchparmas = new URLSearchParams(location.search);

    const [value, setValue] = useState('');

    const id = seatchparmas.get("id");
    const dateFrom = seatchparmas.get("dateFrom");
    const dateTo = seatchparmas.get("dateTo");
    const price = seatchparmas.get("price");


    const priceCC = parseInt(price);
    const dateFromDate = new Date(dateFrom);
    const dateToDate = new Date(dateTo);

    const newDate = dateToDate - dateFromDate;
    const newDDate = newDate / (1000*60*60*24);

    const num = newDDate * priceCC


    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        setSuccessMessage("");
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
            console.log("Brak tokenu");
            return;
        }
        try{
            const response = await axios.post("http://localhost:5000/api/reservations/reservation",{
                idListing: id,
                dateFrom: dateFrom,
                dateTo: dateTo

            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setSuccessMessage("Zarezerwowano!")
        }catch(err){
            setError(err.response?.data?.message || "Wystąpił błąd podczas rezerwacji.");
        }

    }

    const handleChange = (e) => {
        const input = e.target.value;

        const sanitizedInput = input.replace(/\D/g, '');

        if (sanitizedInput.length <= 6) {
            setValue(sanitizedInput);
        }
    }

    return (
        <div className="container">
            <label className="lead my-3">Id ogłoszenia: {id}</label>
            <div className="row">
                <div className="col-6 lead">
                    Rezererwujesz od: {dateFrom}
                </div>
                <div className="col-6 lead">
                    Rezererwujesz do: {dateTo}
                </div>
            </div>
            <label className="lead my-3">Cena: {num} zł</label>

            <div className="row my-3">
                <div className="col-6 lead">
                   <label className="my-1">Wybierz formę płatności:</label>
                    <Tab.Container defaultActiveKey="#home">
                        <div className="row">
                            <div className="col-4">
                                <ListGroup>
                                    <ListGroup.Item action href="#home">
                                        Przelew
                                    </ListGroup.Item>
                                    <ListGroup.Item action href="#profile">
                                        Blik
                                    </ListGroup.Item>
                                    <ListGroup.Item action href="#messages">
                                        Karta płatnicza
                                    </ListGroup.Item>
                                    <ListGroup.Item action href="#settings">
                                        PayPal
                                    </ListGroup.Item>
                                </ListGroup>
                            </div>
                            <div className="col-8">
                                <Tab.Content>
                                    <Tab.Pane eventKey="#home"><button type="button" class="btn btn-outline-dark">Przejdź na stronę wyboru banku</button>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="#profile">
                                        <div className="row">
                                            <div className="col-4">
                                                Podaj kod blik:
                                            </div>
                                        </div>
                                        <div className="row my-2">
                                            <div className="col-4">
                                                <input type="text" onChange={handleChange} value={value} />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <button type="button" className="btn btn-outline-dark">Zapłać</button>
                                            </div>
                                        </div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="#messages">
                                        <div className="container">
                                            <div className="row">
                                                <form onSubmit={handleSubmit}>
                                                    <div className="container">
                                                        <div className="form-group">
                                                            <label htmlFor="exampleFormControlInput1" className="lead">Imię</label>
                                                            <input type="text" className="form-control"
                                                                    required/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="exampleFormControlInput1" className="lead">Nazwisko</label>
                                                            <textarea className="form-control"
                                                                      id="exampleFormControlInput1"

                                                                      required></textarea>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="exampleFormControlInput1" className="lead">Numer karty</label>
                                                            <input type="number" className="form-control"
                                                                    required/>
                                                        </div>
                                                        <div className="form-group">
                                                            <div className="row">
                                                                <div className="col-6">
                                                                    <label htmlFor="exampleFormControlInput1"
                                                                           className="lead">Ważna do</label>
                                                                    <input type="date" className="form-control"

                                                                            required/>
                                                                </div>
                                                                <div className="col-6">
                                                                    <label htmlFor="exampleFormControlInput1"
                                                                           className="lead">CVV</label>
                                                                    <input type="number" className="form-control"
                                                                           required/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-group mt-4">
                                                            <button className="btn btn-outline-dark mb-2" type="submit">Zapłać kartą
                                                            </button>
                                                        </div>
                                                        {successMessage && <p>{successMessage}</p>}
                                                        {error && <p style={{color: "red"}}>{error}</p>}
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="#settings">
                                        <button type="button" className="btn btn-outline-dark">Przejź do PayPal</button>
                                    </Tab.Pane>
                                </Tab.Content>
                            </div>
                        </div>
                    </Tab.Container>
                </div>
            </div>


            <button onClick={handleSubmit} className="btn btn-primary my-3 ">Zarezerwuj</button>


            {successMessage && <p>{successMessage}</p>}
            {error && <p style={{color: "red"}}>{error}</p>}
        </div>
    )
}

export default Payment;