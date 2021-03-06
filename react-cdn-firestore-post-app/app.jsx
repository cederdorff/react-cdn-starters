// React Imports
import React, { useState, useEffect, StrictMode } from "https://cdn.skypack.dev/react";
import * as ReactDOM from "https://cdn.skypack.dev/react-dom";
import { HashRouter, Routes, Route, NavLink, useNavigate, useParams } from "https://cdn.skypack.dev/react-router-dom";
import { postsRef, usersRef } from "./firebase-config.js";
import { onSnapshot, doc, updateDoc, deleteDoc, addDoc, getDoc, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js";

// ====== PAGES ====== //

// Posts Page (Home Page)
function PostsPage() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function getPosts() {
            const q = query(postsRef, orderBy("createdAt", "desc"));
            onSnapshot(q, data => {
                const postsData = data.docs.map(doc => {
                    return { ...doc.data(), id: doc.id };
                });
                setPosts(postsData);
            });
        }
        getPosts();
    }, []);
    return (
        <section className="page">
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
        newPost.uid = "fTs84KRoYw5pRZEWCq2Z"; // default user id added
        newPost.createdAt = serverTimestamp();
        await addDoc(postsRef, newPost);
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
    const [formData, setFormData] = useState({ title: "", body: "", image: "" });

    useEffect(() => {
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
    const [post, setPost] = useState({});
    const params = useParams();
    const navigate = useNavigate();
    const postId = params.postId;
    const docRef = doc(postsRef, postId);

    useEffect(() => {
        async function getPost() {
            const docSnap = await getDoc(docRef);
            setPost(docSnap.data());
        }
        getPost();
    }, []);

    async function savePost(postToUpdate) {
        await updateDoc(docRef, postToUpdate);
        navigate("/");
    }

    async function deletePost() {
        const confirmDelete = confirm(`Do you want to delete post, ${post.title}?`);
        if (confirmDelete) {
            await deleteDoc(docRef);
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

    function handleClick() {
        navigate(`posts/${post.id}`);
    }

    return (
        <article onClick={handleClick}>
            <UserAvatar uid={post.uid} />
            <img src={post.image} />
            <h2>{post.title}</h2>
            <p>{post.body}</p>
        </article>
    );
}

// ====== UserAvatar Component ====== //
function UserAvatar({ uid }) {
    const [user, setUser] = useState({
        image: "./img/user-placeholder.jpg",
        name: "User's Name",
        title: "User's Title"
    });

    useEffect(() => {
        async function getUser() {
            const docRef = doc(usersRef, uid);
            const docSnap = await getDoc(docRef);
            setUser(docSnap.data());
        }
        getUser();
    }, []);

    return (
        <div className="avatar">
            <img src={user.image} />
            <span>
                <h3>{user.name}</h3>
                <p>{user.title}</p>
            </span>
        </div>
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
    <StrictMode>
        <HashRouter>
            <App />
        </HashRouter>
    </StrictMode>,
    document.querySelector("#root")
);
