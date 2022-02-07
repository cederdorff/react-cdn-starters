import * as React from "https://cdn.skypack.dev/react";
import * as ReactDOM from "https://cdn.skypack.dev/react-dom";
import { HashRouter, Routes, Route, NavLink } from "https://cdn.skypack.dev/react-router-dom";

// ====== Home Page Component ====== //
function Home() {
    const [users, setUsers] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState("");

    React.useEffect(async () => {
        const url = "https://raw.githubusercontent.com/cederdorff/react-cdn-starters/main/data/users.json";
        const response = await fetch(url);
        const data = await response.json();
        setUsers(data);
    }, []);

    const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchValue));

    return (
        <section className="page">
            <h1>Home Page</h1>
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
    return (
        <article>
            <img src={user.image} />
            <h2>{user.name}</h2>
            <a href={`mailto:${user.mail}`}>{user.mail}</a>
        </article>
    );
}

// ====== Posts Page Component ====== //

function Posts() {
    const [posts, setPosts] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState("");

    React.useEffect(async () => {
        const url = "https://raw.githubusercontent.com/cederdorff/react-cdn-starters/main/data/posts.json";
        const response = await fetch(url);
        const data = await response.json();
        setPosts(data);
        console.log(data);
    }, []);

    const filteredPosts = posts.filter(post => post.title.toLowerCase().includes(searchValue));

    return (
        <section className="page">
            <h1>Posts Page</h1>
            <SearchBar setValue={setSearchValue} />
            <section className="grid-container">
                {filteredPosts.map(post => (
                    <PostItem post={post} />
                ))}
            </section>
        </section>
    );
}

// ====== Post Item Component ====== //
function PostItem({ post }) {
    return (
        <article>
            <img src={post.image} />
            <h2>{post.title}</h2>
            <p>{post.body}</p>
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

// ====== About Page Component ====== //
function About() {
    return (
        <section className="page">
            <h1>About Page</h1>
            <p>This is my about page</p>
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
            <NavLink to="/posts" className={({ isActive }) => (isActive ? "active" : "")}>
                Posts
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
                About
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
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/posts" element={<Posts />} />
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
