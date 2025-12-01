import React from "react";
import Chapter from "./Chapter/Chapter";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Word from "./Word/Word";
import AuthRoute from "./AuthRoute";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthRoute element={Chapter} />} />
                <Route path="/Chapter" element={<AuthRoute element={Chapter} />} />
                <Route path="/Word/:chapterName" element={<AuthRoute element={Word} />} />
            </Routes>
        </Router>
    );
}

export default App;