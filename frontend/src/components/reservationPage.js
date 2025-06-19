import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import { useParams, useNavigate} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



const ReservationPage = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const [startDate, setStartDate] = useState(null);
    const [secondMinDate, setSecondMinDate] = useState(null);
    const [endDate, setEndDate] = useState(null);


    let dateOg = useRef(null);
    let afterOg = useRef(null);


    const [listing, setListing] = useState(null);
    const [availability, setAvailability] = useState(null);

    useEffect(() => {
        if (startDate) {
            const newMin = new Date(startDate);
            setSecondMinDate(addDays(newMin, 1));
        }
        const fetchData = async () => {
            try{
                const response = await axios.get(`http://localhost:5000/api/listings/${id}`)
                const {list, user} = response.data
                setListing(list)


                const availabilityRes = await axios.get(`http://localhost:5000/api/listings/availability/${id}`);
                setAvailability(availabilityRes.data);
            }catch(e){
                console.error("Błąd podczas pobierania ogłoszenia!");
            }
        }
        fetchData();
    },[id, startDate]);

    if (!listing) return <p>⏳ Ładowanie rezerwacji...</p>;
    if (!availability) return <p>Ładowanie danych o dostępności...</p>;

    const minDate = new Date().toISOString().split("T")[0];
    const maxDate = new Date(availability.availableTo)

    const range = (availability.reserved || []).map(r => ({
        start: new Date(new Date(r.from).setDate(new Date(r.from).getDate() - 1)),
        end: new Date(r.to),
    }));



    const handelChangeDay = () => {
        const min = addDays(dateOg.current.value, 1);

        if(dateOg){
            afterOg.current.min = min;
        }
        afterOg.current.value = '';
    }

    const addDays = (dateStr, days) => {
        const date = new Date(dateStr);
        date.setDate(date.getDate() + days);
        return date;
    }

    const goPay=  () => {
        if(!startDate || !endDate){
            alert("Wybierz termin!")
            return;
        }
        navigate(`/payment?id=${id}&dateFrom=${(addDays(startDate,1)).toISOString().split("T")[0]}&dateTo=${(addDays(endDate,1)).toISOString().split("T")[0]}&price=${listing.price}`);
    }

    return (
        <div>
            <div className="container">
                <div className="row lead my-2">Tytuł ogłoszenia: {listing.title}</div>
                <div className="row lead my-2">Lokazlizacja: {listing.location}</div>
                <div className="row lead my-2">Cena (za dobę): {listing.price} zł</div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-6">
                        <label className="lead my-1">Data przybycia:</label>
                    </div>
                    <div className="col-6">
                        <label className="lead my-1">Data odjazdu:</label>
                    </div>
                </div>

                <div className="row">
                    <div className="col-6 " >
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            minDate={minDate}
                            maxDate={maxDate}
                            excludeDateIntervals={range}
                            ref = {dateOg}
                        />

                    </div>

                    <div className="col-6">
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            minDate={secondMinDate}
                            maxDate={maxDate}
                            excludeDateIntervals={range}
                        />

                    </div>
                </div>
            </div>
            <div className="container">
                <button onClick={goPay} className="btn btn-primary my-3 ">Przejdź do płatności</button>
            </div>
        </div>

    )
}

export default ReservationPage;