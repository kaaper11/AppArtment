import React, {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import {getElement} from "bootstrap/js/src/util";
import axios from "axios";
import {start} from "@popperjs/core";

function MainPage() {
    const navigate = useNavigate();

    const today = new Date().toISOString().split("T")[0];
     let tomorrow = new Date();
     let next2weeks = new Date()
     tomorrow.setDate(tomorrow.getDate() + 1);
     next2weeks.setDate(tomorrow.getDate() + 14);
    tomorrow = tomorrow.toISOString().split("T")[0];
    next2weeks = next2weeks.toISOString().split("T")[0];

    let dataStart = useRef(null);
    let dataEnd = useRef(null);

    const [query, setQuery] = useState("");
    const [listData, setListData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [start, setStart] = useState();
    const [end, setEnd] = useState();


    const handleStartDateChange = () => {
        const min = addDays(dataStart.current.value,1);
        const max = addDays(dataStart.current.value,14);

        if(dataStart){
            dataEnd.current.min = min;
            dataEnd.current.max = max;
        }
        dataEnd.current.value = '';

        setStart(dataStart.current.value);

    }
    const addDays = (dateStr, days) => {
        const date = new Date(dateStr);
        date.setDate(date.getDate() + days);
        return date.toISOString().split("T")[0];
    }


    const handleSearch = () => {
        if (query.trim() !== "") {
            navigate(`/search?query=${encodeURIComponent(query.trim())}&dateFrom=${start}&dateTo=${end}`);
        }
    };

    const handleSearchImages = (query) => {
        navigate(`/search?query=${encodeURIComponent(query.trim())}&dateFrom=${start}&dateTo=${end}`);
    }

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios.get('http://localhost:5000/api/listings/random')
                setListData(response.data);
                console.log(response.data);
            }catch(error){
                setError("Błąd w ładowaniu " + error.message);
            }
        }
        fetchData()
    },[])

    //if (!loading) return <p>⏳ Ładowanie strony głównej...</p>;
    if(error) return <p>{error}</p>

    return (
        <div>
            <p className="text-sm-center fs-1 " >Znajdź wymarzone mieszkanie na swój pobyt!</p>

            <div className="container">
                <div className="row">
                    <div className="col-5"><input type="text" className="form-control" placeholder="Wpisz lokalizację lub tytuł" value={query} onChange={(e) => setQuery(e.target.value)}/> </div>
                    <div className="col-2"><input type="date" className="form-control" min = {today} max = {next2weeks} ref={dataStart} value={start} onChange={handleStartDateChange}/></div>
                    <div className="col-2"><input type="date" className="form-control"  ref={dataEnd} value={end} onChange={(e) => setEnd(e.target.value)}/></div>
                    <div className="col-3"><button className="btn btn-outline-dark" onClick={handleSearch}>Szukaj</button></div>
                </div>
            </div>


            <div className="container mt-4">

                <p className="text-sm-left fs-4  mt-4" >Oferty</p>

                <div className="row">
                    {listData.map((item ) => (
                    <div key={item.id} className="col-3">
                        <div className="card col-3 " style={{width: "18rem"}}>
                            <img
                                className="card-img-top"
                                 src={`http://localhost:5000${item.images[0]}`}
                                 alt={item.title}
                                 style={{ height: "200px", objectFit: "cover" }}alt="Card image cap"/>
                            <div className="card-body">
                                <h5 className="card-title">{item.title}</h5>
                                <p className="card-text text-truncate">{item.description}</p>
                                <p className="text-muted text-truncate">{item.location}</p>
                                <a href={`/offer/${item._id}`} className="btn btn-outline-primary mt-auto">
                                    Zobacz więcej
                                </a>
                            </div>
                        </div>
                    </div>
            ))}

                    {/*<div className="col-3">*/}
                    {/*    <div className="card col-3 " style={{width: "18rem"}}>*/}
                    {/*        <img className="card-img-top" src=".../100px180/" alt="Card image cap"/>*/}
                    {/*        <div className="card-body">*/}
                    {/*            <h5 className="card-title">Card title</h5>*/}
                    {/*            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the*/}
                    {/*                card's content.</p>*/}
                    {/*            <a href="#" className="btn btn-primary">Go somewhere</a>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*<div className="col-3">*/}
                    {/*    <div className="card col-3 " style={{width: "18rem"}}>*/}
                    {/*        <img className="card-img-top" src=".../100px180/" alt="Card image cap"/>*/}
                    {/*        <div className="card-body">*/}
                    {/*            <h5 className="card-title">Card title</h5>*/}
                    {/*            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the*/}
                    {/*                card's content.</p>*/}
                    {/*            <a href="#" className="btn btn-primary">Go somewhere</a>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*<div className="col-3">*/}
                    {/*    <div className="card col-3 " style={{width: "18rem"}}>*/}
                    {/*        <img className="card-img-top" src=".../100px180/" alt="Card image cap"/>*/}
                    {/*        <div className="card-body">*/}
                    {/*            <h5 className="card-title">Card title</h5>*/}
                    {/*            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the*/}
                    {/*                card's content.</p>*/}
                    {/*            <a href="#" className="btn btn-primary">Go somewhere</a>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                </div>
            </div>

            <div className="container mt-5" >
                <p className="text-sm-left fs-4" >Popularne cele podróży</p>

                <div className="row">
                    <div className="col-6" onClick={() => handleSearchImages("Warszawa")}>
                        <div className= "position-relative">
                            <img className="img-fluid  rounded-5" src="/Warszawa.jpg" alt="Warszawa"  style={{height:"300px", objectFit:"cover", width: "100%"}} onClick={() => handleSearchImages("warszawa")}/>
                                <div
                                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-start rounded-5"
                                    style={{
                                        padding: "10px",
                                        background: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
                                        borderRadius: "0.5rem",
                                    }}
                                >
                                    <h5 className="text-white fw-bold shadow-sm">Warszawa, Polska</h5>
                                </div>
                        </div>

                    </div>

                    <div className="col-6" onClick={() => handleSearchImages("Kraków")}>
                        <div className= "position-relative">
                            <img className="img-fluid  rounded-5" src="/Kraków.jpg" alt="Kraków" style={{height:"300px", objectFit:"cover", width: "100%"}} onClick={() => handleSearchImages("krakow")}/>
                                <div
                                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-start rounded-5"
                                    style={{
                                        padding: "10px",
                                        background: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
                                        borderRadius: "0.5rem",
                                    }}
                                >
                                    <h5 className="text-white fw-bold shadow-sm">Kraków, Polska</h5>
                                </div>
                        </div>
                    </div>

                    <div className="col-4 mt-3" onClick={() => handleSearchImages("Wrocław")}>
                        <div className= "position-relative">
                            <img className="img-fluid  rounded-5" src="/Wrocław.jpg" alt="Wrocław" style={{height:"300px", objectFit:"cover", width: "100%"}} onClick={() => handleSearchImages("wrocław")}/>
                                <div
                                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-start rounded-5"
                                    style={{
                                        padding: "10px",
                                        background: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
                                        borderRadius: "0.5rem",
                                    }}
                                >
                                    <h5 className="text-white fw-bold shadow-sm">Wrocław, Polska</h5>
                                </div>
                        </div>
                    </div>

                    <div className="col-4 mt-3" onClick={() => handleSearchImages("Gdańsk")}>
                        <div className= "position-relative">
                            <img className="img-fluid  rounded-5" src="/Gdańsk.jpg" alt="Gdańsk" style={{height:"300px", objectFit:"cover", width: "100%"}} onClick={() => handleSearchImages("gdańsk")}/>
                                <div
                                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-start rounded-5"
                                    style={{
                                        padding: "10px",
                                        background: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
                                        borderRadius: "0.5rem",
                                    }}
                                >
                                    <h5 className="text-white fw-bold shadow-sm">Gdańsk, Polska</h5>
                                </div>
                        </div>
                    </div>

                    <div className="col-4 mt-3" onClick={() => handleSearchImages("Zakopane")}>
                        <div className= "position-relative">
                            <img className="img-fluid  rounded-5" src="/Zakopane.jpg" alt="Zakopane" style={{height:"300px", objectFit:"cover", width: "100%"}} onClick={() => handleSearchImages("zakopane")}/>
                                <div
                                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-start rounded-5"
                                    style={{
                                        padding: "10px",
                                        background: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
                                        borderRadius: "0.5rem",
                                    }}
                                >
                                    <h5 className="text-white fw-bold shadow-sm">Zakopane, Polska</h5>
                                </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-4"></div>
                    <div className="col-4"></div>
                    <div className="col-4"></div>
                </div>
            </div>

        </div>


    );
}

export default MainPage;
