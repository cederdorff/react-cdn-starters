// React Imports
import * as React from "https://cdn.skypack.dev/react";
import * as ReactDOM from "https://cdn.skypack.dev/react-dom";
import { HashRouter, Routes, Route, NavLink, useNavigate, useParams } from "https://cdn.skypack.dev/react-router-dom";

// ====== PAGES ====== //

// Users Page (Home Page)
function UsersPage() {
    const [users, setUsers] = React.useState([]);

    React.useEffect(async () => {
        const url = "https://user-app-289f1.firebaseio.com/users.json";
        const response = await fetch(url);
        const data = await response.json();
        const usersArray = Object.keys(data).map(key => ({ id: key, ...data[key] })); // from object to array
        setUsers(usersArray);
        console.log(usersArray);
    }, []);

    return (
        <section className="page">
            <h1>Users</h1>
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

// Create Page
function CreatePage() {
    const navigate = useNavigate();

    async function createUser(newUser) {
        const url = "https://user-app-289f1.firebaseio.com/users.json";
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(newUser)
        });
        const data = await response.json();
        console.log(data);
        navigate("/");
    }
    return (
        <section className="page">
            <h1>Create Page</h1>
            <UserForm handleSubmit={createUser} />
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

function UpdatePage() {
    const [user, setUser] = React.useState({});
    const params = useParams();
    const navigate = useNavigate();
    const userId = params.userId;
    const url = `https://user-app-289f1.firebaseio.com/users/${userId}.json`;

    React.useEffect(async () => {
        const response = await fetch(url);
        const data = await response.json();
        setUser(data);
    }, [url]);

    async function saveUser(userToUpdate) {
        const response = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(userToUpdate)
        });
        const data = await response.json();
        console.log(data);
        navigate("/");
    }

    async function deleteUser() {
        const confirmDelete = confirm(`Do you want to delete user, ${user.name}?`);
        if (confirmDelete) {
            const response = await fetch(url, {
                method: "DELETE"
            });
            const data = await response.json();
            console.log(data);
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

// ====== COMPONENTS ====== //

// Navbar Componment
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
    return (
        <main>
            <Nav />
            <Routes>
                <Route path="/" element={<UsersPage />} />
                <Route path="/create" element={<CreatePage />} />
                <Route path="/users/:userId" element={<UpdatePage />} />
            </Routes>
        </main>
    );
}

ReactDOM.render(
    <React.StrictMode>
        <HashRouter>
            <App />
        </HashRouter>
    </React.StrictMode>,
    document.querySelector("#root")
);
