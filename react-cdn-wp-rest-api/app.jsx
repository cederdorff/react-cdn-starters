import * as React from "https://cdn.skypack.dev/react";
import * as ReactDOM from "https://cdn.skypack.dev/react-dom";
import { HashRouter, Routes, Route, NavLink, useNavigate, useParams, Navigate } from "https://cdn.skypack.dev/react-router-dom";

// ====== Posts Page Component ====== //

function Posts() {
    const [posts, setPosts] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState("");

    React.useEffect(async () => {
        const url = "https://api.cederdorff.com/wp-json/wp/v2/posts?_embed";
        const response = await fetch(url);
        const data = await response.json();
        setPosts(data);
    }, []);

    const filteredPosts = posts.filter(post => post.title.rendered.toLowerCase().includes(searchValue));

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
    const navigate = useNavigate();

    function handleClick() {
        navigate(`${post.id}`);
    }

    function getFeaturedImageUrl() {
        let imageUrl = "";
        if (post._embedded) {
            imageUrl = post._embedded["wp:featuredmedia"][0].source_url;
        }
        return imageUrl;
    }

    return (
        <article onClick={handleClick}>
            <img src={getFeaturedImageUrl()} />
            <h2 dangerouslySetInnerHTML={{ __html: post?.title?.rendered }}></h2>
            <div dangerouslySetInnerHTML={{ __html: post?.excerpt?.rendered }}></div>
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

// ====== Clients Page Component ====== //
function Clients() {
    const [posts, setPosts] = React.useState([]);

    React.useEffect(async () => {
        const url = "https://api.cederdorff.com/wp-json/wp/v2/posts?&categories=2&_embed";
        const response = await fetch(url);
        const data = await response.json();
        setPosts(data);
    }, []);

    return (
        <section className="page">
            <h1>Clients Page</h1>
            <p>This page displays all posts catgorised as "Client"</p>
            <section className="grid-container">
                {posts.map(post => (
                    <PostItem post={post} />
                ))}
            </section>
        </section>
    );
}

// ====== News Page Component ====== //
function News() {
    const [posts, setPosts] = React.useState([]);

    React.useEffect(async () => {
        const url = "https://api.cederdorff.com/wp-json/wp/v2/posts?&categories=1&_embed";
        const response = await fetch(url);
        const data = await response.json();
        setPosts(data);
    }, []);

    return (
        <section className="page">
            <h1>News Page</h1>
            <p>This page displays all posts catgorised as "News"</p>
            <section className="grid-container">
                {posts.map(post => (
                    <PostItem post={post} />
                ))}
            </section>
        </section>
    );
}

// ====== Post Detail Page Component ====== //
function PostDetail() {
    const [post, setPost] = React.useState({});
    const params = useParams();
    const postId = params.postId;

    React.useEffect(async () => {
        const url = `https://api.cederdorff.com/wp-json/wp/v2/posts/${postId}?_embed`;
        const response = await fetch(url);
        const data = await response.json();
        setPost(data);
    }, [postId]);

    function getFeaturedImageUrl() {
        let imageUrl = "";
        if (post._embedded) {
            imageUrl = post._embedded["wp:featuredmedia"][0].source_url;
        }
        return imageUrl;
    }

    return (
        <section className="page">
            <h1 dangerouslySetInnerHTML={{ __html: post.title?.rendered }}></h1>
            <img src={getFeaturedImageUrl()} />
            <div dangerouslySetInnerHTML={{ __html: post.content?.rendered }}></div>
        </section>
    );
}

// ====== Nav Component ====== //
function Nav() {
    return (
        <nav>
            <NavLink to="/posts" className={({ isActive }) => (isActive ? "active" : "")}>
                Posts
            </NavLink>
            <NavLink to="/clients" className={({ isActive }) => (isActive ? "active" : "")}>
                Clients
            </NavLink>
            <NavLink to="/news" className={({ isActive }) => (isActive ? "active" : "")}>
                News
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
                <Route path="/posts" element={<Posts />} />
                <Route path="/posts/:postId" element={<PostDetail />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/clients/:postId" element={<PostDetail />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:postId" element={<PostDetail />} />
                <Route path="*" element={<Navigate to="/posts" />} />
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
