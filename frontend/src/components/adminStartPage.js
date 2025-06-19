import React, {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import {getElement} from "bootstrap/js/src/util";
import axios from "axios";
import {start} from "@popperjs/core";
import { jwtDecode } from "jwt-decode";
import {pem as jwt} from "node-forge";

const AdminStartPage = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/")
        }
        try {
            const decoded = jwtDecode(token);
            if (decoded.role !== "admin") {
                navigate("/");
            }
        }catch(err) {
            console.error("Nieprawidłowy token:" + err);
            navigate("/");
        }
    },[navigate])

    const handleUsers = () => {
        navigate("/adminUsers");
    }
    const handleListings  = () => {
        navigate("/adminListings");
    }

    return(
        <div className="container">
            <p className="text-sm-center fs-1 lead" >Witaj Adminie!</p>
            <div className="row">
                <div className="col-6">
                    <button onClick={handleUsers} type="button"  className="btn btn-primary btn-lg w-100">Moderuj użytkowników</button>
                </div>
                <div className="col-6">
                    <button onClick={handleListings} type="button" className="btn btn-secondary btn-lg w-100">Moderuj ogłoszenia</button>
                </div>
            </div>
        </div>
    )
}

export  default AdminStartPage