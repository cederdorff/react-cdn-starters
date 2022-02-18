// React Imports
import * as React from "https://cdn.skypack.dev/react";
import * as ReactDOM from "https://cdn.skypack.dev/react-dom";
import { HashRouter, Routes, Route, NavLink, useNavigate, useParams } from "https://cdn.skypack.dev/react-router-dom";

// ====== PAGES ====== //

// Posts Page (Home Page)
function PostsPage() {
    const [posts, setPosts] = React.useState([]);

    React.useEffect(async () => {
        const url = "https://user-app-289f1.firebaseio.com/posts.json";
        const response = await fetch(url);
        const data = await response.json();
        const postsArray = Object.keys(data).map(key => ({ id: key, ...data[key] })); // from object to array
        setPosts(postsArray.reverse());
    }, []);

    return (
        <section className="page">
            <h1>Posts</h1>
            <section className="grid-container">
                {posts.map(post => (
                    <PostItem post={post} key={post.id} />
                ))}
            </section>
        </section>
    );
}

// Create Page
function CreatePage() {
    const navigate = useNavigate();

    async function createPost(newPost) {
        const url = "https://user-app-289f1.firebaseio.com/posts.json";
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(newPost)
        });
        const data = await response.json();
        console.log(data);
        navigate("/");
    }
    return (
        <section className="page">
            <h1>Create New Post</h1>
            <PostForm handleSubmit={createPost} />
        </section>
    );
}

function PostForm({ post, handleSubmit }) {
    const [formData, setFormData] = React.useState({ title: "", body: "", image: "" });

    React.useEffect(() => {
        if (post) {
            setFormData(post);
        } else {
            setFormData({ title: "", body: "", image: "" });
        }
    }, [post]);

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
            <input type="text" value={formData.title} onChange={handleChange} name="title" placeholder="Type title" />
            <input value={formData.body} onChange={handleChange} name="body" placeholder="Type body of your post" />
            <input type="url" value={formData.image} accept="image/*" onChange={handleChange} name="image" placeholder="Paste image url" />
            <img className="image-preview" src={formData.image} alt="Choose" onError={event => (event.target.src = "./img/user-placeholder.jpg")} />
            <button>Save</button>
        </form>
    );
}

function UpdatePage() {
    const [post, setPost] = React.useState({});
    const params = useParams();
    const navigate = useNavigate();
    const postId = params.postId;
    const url = `https://user-app-289f1.firebaseio.com/posts/${postId}.json`;

    React.useEffect(async () => {
        const response = await fetch(url);
        const data = await response.json();
        setPost(data);
    }, [url]);

    async function savePost(postToUpdate) {
        const response = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(postToUpdate)
        });
        const data = await response.json();
        console.log(data);
        navigate("/");
    }

    async function deletePost() {
        const confirmDelete = confirm(`Do you want to delete post, ${post.title}?`);
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
            <h1>Update Post</h1>
            <PostForm post={post} handleSubmit={savePost} />
            <button className="btn-delete" onClick={deletePost}>
                Delete Post
            </button>
        </section>
    );
}

// ====== COMPONENTS ====== //

// ====== Post List Component ====== //
function PostItem({ post }) {
    const navigate = useNavigate();
    console.log(post);

    function handleClick() {
        navigate(`posts/${post.id}`);
    }

    return (
        <article onClick={handleClick}>
            <img src={post.image} />
            <h2>{post.title}</h2>
            <p>{post.body}</p>
        </article>
    );
}

// Navbar Componment
function Nav() {
    return (
        <nav>
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                Posts
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
                <Route path="/" element={<PostsPage />} />
                <Route path="/create" element={<CreatePage />} />
                <Route path="/posts/:postId" element={<UpdatePage />} />
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
