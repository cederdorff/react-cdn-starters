import React, { useState, useEffect, StrictMode } from "https://cdn.skypack.dev/react";
import * as ReactDOM from "https://cdn.skypack.dev/react-dom";
import { HashRouter, Routes, Route, NavLink, useNavigate, useParams, Navigate } from "https://cdn.skypack.dev/react-router-dom";
import { usersRef } from "./firebase-config.js";
import { onSnapshot, doc, updateDoc, deleteDoc, addDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js";

// ====== PAGES ====== //

function UsersPage({ showLoader }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const cleanUp = onSnapshot(usersRef, data => {
            const users = data.docs.map(doc => {
                return { ...doc.data(), id: doc.id };
            });
            setUsers(users);
            showLoader(false);
        });

        return () => cleanUp();
    }, []);

    return (
        <section className="page">
            <h1>Users</h1>
            <section className="grid-container">
                {users.map(user => (
                    <UserItem key={user.id} user={user} />
                ))}
            </section>
        </section>
    );
}

function CreatePage({ showLoader }) {
    const navigate = useNavigate();

    async function createUser(newUser) {
        showLoader(true);
        await addDoc(usersRef, newUser);
        navigate("/");
    }
    return (
        <section className="page">
            <h1>Create Page</h1>
            <UserForm handleSubmit={createUser} />
        </section>
    );
}

function UpdatePage({ showLoader }) {
    const [user, setUser] = useState({ name: "", mail: "", img: "img/user-placeholder.jpg" });
    const params = useParams();
    const navigate = useNavigate();
    const userId = params.userId;

    useEffect(() => {
        const getUser = async () => {
            const docRef = doc(usersRef, userId);
            const docSnap = await getDoc(docRef);
            setUser(docSnap.data());
        };
        getUser();
    }, [userId]);

    async function saveUser(userObject) {
        showLoader(true);
        const docRef = doc(usersRef, userId);
        await updateDoc(docRef, userObject);
        navigate("/");
    }

    async function deleteUser() {
        showLoader(true);
        const userRef = doc(usersRef, userId);
        await deleteDoc(userRef);
        navigate("/");
    }

    return (
        <section className="page">
            <UserForm user={user} handleSubmit={saveUser} />
            <button className="btn-delete" onClick={deleteUser}>
                Delete User
            </button>
        </section>
    );
}

// ====== COMPONENTS ====== //

function UserItem({ user }) {
    const navigate = useNavigate();

    function handleClick() {
        navigate(`users/${user.id}`);
    }

    return (
        <article onClick={handleClick}>
            <img src={user.img} alt={user.name} />
            <h3>{user.name}</h3>
            <p>
                <a href={`mailto:${user.mail}`}>{user.mail}</a>
            </p>
        </article>
    );
}

function UserForm({ user, handleSubmit }) {
    const [formData, setFormData] = useState({ name: "", mail: "", img: "" });
    const imageRef = useRef();

    useEffect(() => {
        if (user) {
            setFormData(user);
        } else {
            setFormData({ name: "", mail: "", img: "img/user-placeholder.jpg" });
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

    function handleImageChange(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            setFormData(prevFormData => {
                return {
                    ...prevFormData,
                    img: event.target.result
                };
            });
        };
        reader.readAsDataURL(file);
    }

    function submitEvent(event) {
        event.preventDefault();
        handleSubmit(formData);
    }

    return (
        <form onSubmit={submitEvent}>
            <input type="text" value={formData.name} onChange={handleChange} name="name" placeholder="Type name" />
            <input type="email" value={formData.mail} onChange={handleChange} name="mail" placeholder="Type mail" />
            <input type="file" className="file-input" accept="image/*" onChange={handleImageChange} name="img" ref={imageRef} />
            <img className="image-preview" src={formData.img} alt="Choose" onClick={() => imageRef.current.click()} />
            <button>Save User</button>
        </form>
    );
}

function Loader({ show }) {
    return (
        <section className={show ? "loader" : "loader hide"}>
            <section className="spinner"></section>
        </section>
    );
}

function Nav() {
    return (
        <nav>
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                Users
            </NavLink>
            <NavLink to="/create" className={({ isActive }) => (isActive ? "active" : "")}>
                Create
            </NavLink>
        </nav>
    );
}

// ====== APP ====== //

function App() {
    const [loading, setLoading] = useState(true);

    return (
        <main>
            <Nav />
            <Routes>
                <Route path="/" element={<UsersPage showLoader={setLoading} />} />
                <Route path="/users/:userId" element={<UpdatePage showLoader={setLoading} />} />
                <Route path="/create" element={<CreatePage showLoader={setLoading} />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Loader show={loading} />
        </main>
    );
}

ReactDOM.render(
    <HashRouter>
        <App />
    </HashRouter>,
    document.querySelector("#root")
);
