import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";



const Messenger = () => {

    const token = localStorage.getItem("token");
    const [error, setError] = useState(null);
    const [messageDB, setMessageDB] = useState([]);
    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState(null);
    const messagesEndRef = useRef(null);

    const { user1, user2, listingId } = useParams();



    const fetchData = async () => {
        setLoading(true);
        try{
            const response = await axios.get(`http://localhost:5000/api/messages/${user1}/${user2}/${listingId}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMessageDB(response.data);


        }catch(err){
            setError("Błąd podczas wyświetlania wiadomości " + err);        }
        finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response2 = await axios.post(`http://localhost:5000/api/messages/send`,{
                senderId: user1,
                receiverId: user2,
                idListing: listingId,
                message: message
            })

            setMessage("");
            fetchData();
        }catch(err){
            setError("Błąd podczas wysyłania wiadomości " + err);
        }
    }

    useEffect(() => {
        fetchData();

    },[])

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messageDB]);


    return (
        <div className="container">

            {loading && <p>⏳ Ładowanie wyników...</p>}
            {!loading && messageDB.length === 0 && <p></p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="container border my-2 bg-body-secondary rounded-3 overflow-auto" style={{ maxHeight: '400px' }}   ref={messagesEndRef}>
                <div className="row lead my-2">
                    {messageDB.map((item) => (
                        <div key={item.id}>
                            <div className="col-6">
                                {String(item.receiverId) === String(user1) && <p className="text-end border border-dark p-2 d-inline-block bg-primary text-white rounded-4">{item.message}</p>}
                            </div>
                            <div className="col-6 offset-md-6 d-flex justify-content-end">
                                {String(item.senderId) === String(user1) && <p className="text-end border border-dark p-2 d-inline-block bg-primary text-white rounded-4">{item.message}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-11">
                                <input
                                type="text"
                                className="form-control"
                                id="mess"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                placeholder="Wpisz wiadomość"/>
                        </div>
                        <div className="col-1">
                            <button type="submit" className="btn btn-primary">Wyślij</button>
                        </div>
                    </div>
                </form>

            </div>



        </div>
    )

}

export default Messenger;