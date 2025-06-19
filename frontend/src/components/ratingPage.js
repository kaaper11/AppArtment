import React, {useEffect, useState} from "react";
import axios, {get} from "axios";
import App from "../App";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {getElement} from "bootstrap/js/src/util";

const RatingPage = () => {

    const [rate, setRate] = useState(1);
    const [comment, setComment] = useState();
    const [reate, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const { id } = useParams();
    const token = localStorage.getItem("token");


    const handleSubmit  = async (e) => {
        e.preventDefault();
            try {
                const response = await axios.post(`http://localhost:5000/api/ratings/add/${id}` , {
                    id,
                    rate,
                    comment,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setSuccess(response.data.message || "Ocena została dodana!");
                setError("")
            }catch(e) {
                setError( e.response.data.message);
                setSuccess(false);
            }

    }


return(

    <div className="container">
        {success && <p style={{ color: "green" }}>{success}</p>}



        <h1 className="my-4 text-center display-5">Oceń swój pobyt!</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
            <div>
                <label className="lead" htmlFor="customRange2">Ocena: {rate}</label>
            </div>
            <div>
                <input onChange={(e) => setRate(parseInt(e.target.value))} value={rate} type="range" className="custom-range w-100" min="1" max="5" id="customRange2"/>
            </div>
            <div className="custom-control custom-radio">
                <input onChange={(e)=> setComment(e.target.value)} type="text" className="form-control" placeholder="Wpisz komenatrz" value={comment} id="one"/>
                <label  className="custom-control-label"></label>
            </div>

            <button type="submit" className="btn btn-primary">Wyślij opinię</button>
        </form>
    </div>
)


}
export default RatingPage;