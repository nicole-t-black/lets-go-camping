import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import SearchPage from "./pages/SearchPage";
import CompareSuggestPage from "./pages/CompareSuggestPage";
import FavoritesPage from "./pages/FavoritesPage";

function App() {
    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/signup" element={<SignUpPage/>}/>
                <Route path="/favorites" element={<FavoritesPage/>}/>
                <Route path="/search" element={<SearchPage/>}/>
                <Route path="/compare-suggest" element={<CompareSuggestPage/>}/>
            </Routes>
        </div>
    );
}

export default App;