// React Imports
import React, { useState, useEffect, StrictMode } from "https://cdn.skypack.dev/react";
import * as ReactDOM from "https://cdn.skypack.dev/react-dom";
import { HashRouter, Routes, Route, NavLink } from "https://cdn.skypack.dev/react-router-dom";

// ====== PAGES ====== //

// Users Page (Home Page)
function UsersPage() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function getUsers() {
            const url = "https://raw.githubusercontent.com/cederdorff/react-cdn-starters/main/data/users.json";
            const response = await fetch(url);
            const data = await response.json();
            setUsers(data);
        }

        getUsers();
    }, []);

    return (
        <section className="page">
            <h1>Users</h1>
            <section className="grid-container">
                {users.map(user => (
                    <article>
                        <img src={user.image} alt={user.name} />
                        <h3>{user.name}</h3>
                        <p>
                            <a href={`mailto:${user.mail}`}>{user.mail}</a>
                        </p>
                    </article>
                ))}
            </section>
        </section>
    );
}

// About Page
function AboutPage() {
    return (
        <section className="page">
            <h1>About Page</h1>
        </section>
    );
}

// Clients Page
function ClientsPage() {
    return (
        <section className="page">
            <h1>Clients Page</h1>
        </section>
    );
}

// ====== COMPONENTS ====== //

// Navbar Componment
function Nav() {
    return (
        <nav>
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                Home
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
                About
            </NavLink>
            <NavLink to="/clients" className={({ isActive }) => (isActive ? "active" : "")}>
                Clients
            </NavLink>
        </nav>
    );
}

// ====== APP ====== //

function App() {
    return (
        <main>
            <Nav />
            <Routes>
                <Route path="/" element={<UsersPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/clients" element={<ClientsPage />} />
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
