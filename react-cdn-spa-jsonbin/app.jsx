import React from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";
import { HashRouter, Routes, Route, NavLink, useNavigate, useParams, Navigate } from "https://cdn.skypack.dev/react-router-dom";
import * as UserService from "./services/UserService.js";

// ====== User Page Component ====== //
function Users() {
    const [users, setUsers] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState("");

    React.useEffect(async () => {
        setUsers(await UserService.getUsers());
    }, []);

    const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchValue));

    return (
        <section className="page">
            <SearchBar setValue={setSearchValue} />
            <section className="grid-container">
                {filteredUsers.map(user => (
                    <UserItem user={user} />
                ))}
            </section>
        </section>
    );
}

// ====== User List Component ====== //
function UserItem({ user }) {
    const navigate = useNavigate();

    function handleClick() {
        navigate(`users/${user.id}`);
    }

    return (
        <article onClick={handleClick}>
            <img src={user.image} />
            <h2>{user.name}</h2>
            <a href={`mailto:${user.mail}`}>{user.mail}</a>
        </article>
    );
}

// ====== Search Bar Component ====== //
function SearchBar({ setValue }) {
    function handleSearch(event) {
        setValue(event.target.value.toLowerCase());
    }
    return <input type="search" placeholder="Search" onChange={handleSearch} />;
}

// ====== Create Page Component ====== //
function Create() {
    const navigate = useNavigate();

    function createEvent(newUser) {
        UserService.createUser(newUser);
        navigate("/");
    }
    return (
        <section className="page">
            <h1>Create New User</h1>
            <UserForm handleSubmit={createEvent} />
        </section>
    );
}

function UserForm({ user, handleSubmit }) {
    const [formData, setFormData] = React.useState({ name: "", mail: "", image: "" });

    React.useEffect(() => {
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

function Update() {
    const [user, setUser] = React.useState({});
    const params = useParams();
    const navigate = useNavigate();
    const userId = params.userId;

    React.useEffect(async () => {
        setUser(await UserService.getUser(userId));
    }, [userId]);

    async function saveUser(userToUpdate) {
        UserService.updateUser(userToUpdate);
        navigate("/");
    }

    async function deleteUser() {
        const confirmDelete = confirm(`Do you want to delete user, ${user.name}?`);
        if (confirmDelete) {
            UserService.deleteUser(userId);
            navigate("/");
        }
    }

    return (
        <section className="page">
            <h1>Update User</h1>
            <UserForm user={user} handleSubmit={saveUser} />
            <button className="btn-delete" onClick={deleteUser}>
                Delete User
            </button>
        </section>
    );
}

// ====== Nav Component ====== //
function Nav() {
    return (
        <nav>
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                Home
            </NavLink>
            <NavLink to="/create" className={({ isActive }) => (isActive ? "active" : "")}>
                Create
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
                <Route path="/users/:userId" element={<Update />} />
                <Route path="/create" element={<Create />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </main>
    );
}

// ====== React Render App ====== //

ReactDOM.render(
    <React.StrictMode>
        <HashRouter>
            <App />
        </HashRouter>
    </React.StrictMode>,
    document.querySelector("#root")
);
