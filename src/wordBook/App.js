import React from "react";
import Chapter from "./Chapter/Chapter";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Word from "./Word/Word";
import Login from "./Login/Login";
import Register from "./Register/Register";
import AuthRoute from "./AuthRoute";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthRoute element={Chapter} />} />
                <Route path="/Chapter" element={<AuthRoute element={Chapter} />} />
                <Route path="/Word/:chapterName" element={<AuthRoute element={Word} />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;