import React, { useState, useEffect, StrictMode } from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";
import { HashRouter, Routes, Route, NavLink, useNavigate, useParams, Navigate } from "https://cdn.skypack.dev/react-router-dom";
import * as UserService from "./services/UserService.js";

// ====== User Page Component ====== //
function Users() {
    const [users, setUsers] = useState([]);

    useEffect(async () => {
        // setUsers(await UserService.getUsers());
    }, []);

    return (
        <section className="page">
            <section className="grid-container">
                {users.map(user => (
                    <UserItem user={user} />
                ))}
            </section>
        </section>
    );
}

// ====== User List Component ====== //
function UserItem({ user }) {
    return (
        <article>
            <img src={user.image} />
            <h2>{user.name}</h2>
            <a href={`mailto:${user.mail}`}>{user.mail}</a>
        </article>
    );
}

// ====== Create Page Component (to do) ====== //

// ====== Update Page Component (to do) ====== //

// ====== User Form Component ====== //
function UserForm({ user, handleSubmit }) {
    const [formData, setFormData] = useState({ name: "", mail: "", image: "" });

    useEffect(() => {
        if (user) {
            setFormData(user);
        } else {
            setFormData({ name: "", mail: "", image: "" });
        }
    }, [user]);

    function handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: value
            };
        });
    }

    function submitEvent(event) {
        event.preventDefault();
        handleSubmit(formData);
    }

    return (
        <form onSubmit={submitEvent}>
            <input type="text" value={formData.name} onChange={handleChange} name="name" placeholder="Type name" />
            <input type="email" value={formData.mail} onChange={handleChange} name="mail" placeholder="Type mail" />
            <input type="url" value={formData.image} accept="image/*" onChange={handleChange} name="image" placeholder="Paste image url" />
            <img className="image-preview" src={formData.image} alt="Choose" onError={event => (event.target.src = "./img/user-placeholder.jpg")} />
            <button>Save</button>
        </form>
    );
}

// ====== Nav Component ====== //
function Nav() {
    return (
        <nav>
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                Home
            </NavLink>
        </nav>
    );
}

// ====== App Component ====== //
function App() {
    return (
        <main>
            <Nav />
            <Routes>
                <Route path="/" element={<Users />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </main>
    );
}

// ====== React Render App ====== //

ReactDOM.render(
    <StrictMode>
        <HashRouter>
            <App />
        </HashRouter>
    </StrictMode>,
    document.querySelector("#root")
);
