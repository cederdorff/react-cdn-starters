import React, { StrictMode } from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";
import { HashRouter, Routes, Route, NavLink } from "https://cdn.skypack.dev/react-router-dom";

// ====== PAGES ====== //
function Home() {
    return (
        <section className="page">
            <h1>Home Page</h1>
        </section>
    );
}

function About() {
    return (
        <section className="page">
            <h1>About Page</h1>
        </section>
    );
}

function Clients() {
    return (
        <section className="page">
            <h1>Clients Page</h1>
        </section>
    );
}

// ====== COMPONENTS ====== //
function Nav() {
    return (
        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/clients">Clients</NavLink>
        </nav>
    );
}

// ====== APP ====== //
function App() {
    return (
        <main>
            <Nav />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/clients" element={<Clients />} />
            </Routes>
        </main>
    );
}

ReactDOM.render(
    <StrictMode>
        <HashRouter>
            <App />
        </HashRouter>
    </StrictMode>,
    document.querySelector("#root")
);
