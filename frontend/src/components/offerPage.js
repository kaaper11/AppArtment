import React, {useEffect, useState} from "react";
import axios from "axios";
import { useParams, Link} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


const OfferPage = () => {
    const { id } = useParams();

    const [listing, setListing] = useState(null);
    const [full, setFull] = useState([]);
    const [avg, setAvg] = useState(null);
    const [names, setNames] = useState([]);
    const [user, setUser] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios.get(`http://localhost:5000/api/listings/${id}`)
                const {list, user} = response.data;
                setListing(list)
                setUser(user)

                const response2 = await axios.get(`http://localhost:5000/api/ratings/view/${id}`)
                const {full, avg, names} = response2.data
                setFull(full)
                setAvg(avg)
                setNames(names)
            }catch(e){
                console.error("Błąd podczas pobierania ogłoszenia!");
            }
        }
        fetchData();
    },[id])

    if (!listing) return <p>⏳ Ładowanie ogłoszenia...</p>;


    return (
        <div>
            <h1 className="my-4 text-center display-4">{listing.title}</h1>
            <div className="container">
                <div className="row">
                    <div className="col-9">
                        <p className="text-left lead fs-4">📌{listing.location}</p>
                    </div>
                    <div className="col-3">
                        {avg === "NaN" && <p className="lead">Średnia ocena: (brak ocen)</p>}
                        {avg !== "NaN" && <p className="lead">Średnia ocena: {avg} </p>}
                    </div>
                </div>

            </div>

            <div className="container mt-4">
                <div className="row">
                <div className="col-9 ">
                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        {listing.images.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                data-bs-target="#carouselExampleIndicators"
                                data-bs-slide-to={idx}
                                className={idx === 0 ? "active" : ""}
                                aria-current={idx === 0 ? "true" : undefined}
                                aria-label={`Slide ${idx}`}
                            ></button>
                        ))}
                    </div>
                    <div className="">
                    <div className="carousel-inner">
                        {listing.images.map((img, idx) => (
                            <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                                <img src={`http://localhost:5000${img}`} className="d-block w-100" alt="..." style={{height: "700px", objectFit: "cover"}} />
                            </div>
                        ))}
                    </div>
                    </div>
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide="prev"
                    >
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide="next"
                    >
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
                </div>



                <div className='col-3'>
                    <label className="lead my-1">Wybrane oceny lokalu:</label>
                    <div className="card border-secondary mb-3" style={{maxHeight: "18rem"}}>
                        <div className="card-header">{names[0]}</div>
                        <div className="card-body text-secondary">
                            {full[0]?.rate && <h5 className="card-title">{full[0]?.rate}/5</h5>}
                            {!full[0]?.rate && <h5 className="card-title">Brak wystarczającej liczby ocen</h5>}
                            {full[0]?.comment &&  <p className="card-text">Komenatrz: {full[0]?.comment}</p>}
                            {!full[0]?.comment &&  <p className="card-text">Brak komenatrza</p>}
                        </div>
                    </div>
                    <div className="card border-secondary mb-3" style={{maxHeight: "18rem"}}>
                        <div className="card-header">{names[1]}</div>
                        <div className="card-body text-secondary">
                            {full[1]?.rate && <h5 className="card-title">{full[1]?.rate}/5</h5>}
                            {!full[1]?.rate && <h5 className="card-title">Brak wystarczającej liczby ocen</h5>}
                            {full[1]?.comment &&  <p className="card-text">Komenatrz: {full[1]?.comment}</p>}
                            {!full[1]?.comment &&  <p className="card-text">Brak komenatrza</p>}
                        </div>
                    </div>
                    <div className="card border-secondary mb-3" style={{maxHeight: "18rem"}}>
                        <div className="card-header">{names[2]}</div>
                        <div className="card-body text-secondary">
                            {full[2]?.rate && <h5 className="card-title">{full[2]?.rate}/5</h5>}
                            {!full[2]?.rate && <h5 className="card-title">Brak wystarczającej liczby ocen</h5>}
                            {full[2]?.comment &&  <p className="card-text">Komenatrz: {full[2]?.comment}</p>}
                            {!full[2]?.comment &&  <p className="card-text">Brak komenatrza</p>}
                        </div>
                    </div>

                </div>

                </div>
            </div>

            <div className="container mt-4">
                <div className="row">
                    <div className="col-8 " style={{fontSize: "1.1rem"}}>
                        {listing.description}
                    </div>
                    <div className="col-4">
                        <div className="jumbotron">
                            <h1 className="display-4">Kontakt</h1>
                            <p className="lead">Chcesz skontaktować się z właścicielem przed dokonaniem rezerwacji? Nic prostrzego wybierz numer poniżej :)</p>
                            <hr className="my-2"/>
                            <p className="lead">{user.phoneNumber}</p>
                            <Link to={`/reservation/${listing._id}`}>
                                <a className="btn btn-primary btn-lg">Zarezerwuj teraz</a>
                            </Link>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default OfferPage;