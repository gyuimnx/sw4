import React from "react";
import Chapter from "./Chapter/Chapter";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Word from "./Word/Word";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Chapter />} /> 
                <Route path="/Chapter" element={<Chapter />} /> 
                <Route path="/Word/:chapterName" element={<Word />} />
            </Routes>
        </Router>
    );
}

export default App;