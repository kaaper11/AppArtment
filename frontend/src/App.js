import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import MainPage from './components/mainPage';
import Navbar from './components/Navbar';
import AfterSearchList from "./components/afterSearchList";
import AddNew from './components/add';
import OfferPage from './components/offerPage';
import Lowbar from "./components/Lowbar";
import ReservationPage from "./components/reservationPage";
import Payment from "./components/Payment";
import MyOfferts from "./components/myOfferts";
import EditPage from './components/editPage';
import MyRes from "./components/myRes";
import RatingPage from "./components/ratingPage";
import NotifiPage from "./components/notifiPage";
import MessagesPage from "./components/messagesPage";
import Messenger from "./components/messenger";
import AdminStartPage from "./components/adminStartPage";
import AdminUsers from "./components/adminUsers";
import AdminListings from "./components/adminListings";
import PersonalRese from "./components/personalRese";
import OneRese from "./components/oneRese";



function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <Router>
            <div>
                <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

                <Routes>
                    <Route path="/" element={<MainPage />} />

                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

                    <Route path="/register" element={<Register />} />
                    <Route path="/search" element={<AfterSearchList />} />
                    <Route path="/add" element={<AddNew />} />
                    <Route path ="/offer/:id" element={<OfferPage />} />
                    <Route path="/reservation/:id" element={<ReservationPage />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/myOfferts" element={<MyOfferts />} />
                    <Route path="/editPage/:id" element={<EditPage />} />
                    <Route path="/myRes" element={<MyRes />}/>
                    <Route path="/ratingPage/:id" element={<RatingPage />} />
                    <Route path="/notifiPage" element={<NotifiPage />} />
                    <Route path="/messagesPage" element={<MessagesPage />} />
                    <Route path="/messenger/:user1/:user2/:listingId" element={<Messenger />} />
                    <Route path="/adminStartPage" element={<AdminStartPage />} />
                    <Route path="/adminUsers" element={<AdminUsers />} />
                    <Route path="/adminListings" element={<AdminListings />} />
                    <Route path="/personalRese/:id" element={<PersonalRese />} />
                    <Route path="/oneRese/:id" element={<OneRese />} />

                </Routes>
                <Lowbar />
            </div>
        </Router>
    );
}

export default App;
