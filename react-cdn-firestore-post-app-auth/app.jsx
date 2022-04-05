// React Imports
import React, { useState, useEffect, StrictMode } from "https://cdn.skypack.dev/react";
import * as ReactDOM from "https://cdn.skypack.dev/react-dom";
import { HashRouter, Routes, Route, NavLink, Link, useNavigate, useParams, Navigate } from "https://cdn.skypack.dev/react-router-dom";
import { postsRef, usersRef } from "./firebase-config.js";
import { onSnapshot, doc, updateDoc, deleteDoc, setDoc, addDoc, getDoc, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";

// ====== PAGES ====== //

// Posts Page (Home Page)
function PostsPage({ showLoader }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const q = query(postsRef, orderBy("createdAt", "desc"));
        onSnapshot(q, data => {
            const postsData = data.docs.map(doc => {
                return { ...doc.data(), id: doc.id };
            });
            setPosts(postsData);
            console.log(postsData);
            showLoader(false);
        });
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
function CreatePage({ showLoader }) {
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        showLoader(false);
    }, []);
    async function createPost(newPost) {
        showLoader(true);
        newPost.uid = auth.currentUser.uid; // default user id added
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

function UpdatePage({ showLoader }) {
    const [post, setPost] = useState({});
    const params = useParams();
    const navigate = useNavigate();
    const postId = params.postId;

    useEffect(() => {
        async function getPost() {
            const docRef = doc(postsRef, postId);
            const docSnap = await getDoc(docRef);
            setPost(docSnap.data());
            showLoader(false);
        }

        getPost();
    }, [postId]);

    async function savePost(postToUpdate) {
        showLoader(true);
        const docRef = doc(postsRef, postId);
        await updateDoc(docRef, postToUpdate);
        navigate("/");
    }

    async function deletePost() {
        const confirmDelete = confirm(`Do you want to delete post, ${post.title}?`);
        if (confirmDelete) {
            showLoader(true);
            const docRef = doc(postsRef, postId);
            await deleteDoc(docRef);
            navigate("/");
        }
    }

    return (
        <section className="page">
            <h1>Update Post</h1>
            <PostForm post={post} handleSubmit={savePost} />
            <button className="btn-outline" onClick={deletePost}>
                Delete Post
            </button>
        </section>
    );
}

// SIGN IN Page
function SignInPage() {
    const [errorMessage, setErrorMessage] = useState("");

    function signIn(event) {
        event.preventDefault();
        const mail = event.target.mail.value;
        const password = event.target.password.value;
        const auth = getAuth();
        signInWithEmailAndPassword(auth, mail, password)
            .then(userCredential => {
                // Signed in
                const user = userCredential.user;
            })
            .catch(error => {
                let code = error.code;
                code = code.replaceAll("-", " ");
                code = code.replaceAll("auth/", "");
                setErrorMessage(code);
            });
    }
    return (
        <section className="page">
            <h1>Sign In</h1>
            <form onSubmit={signIn}>
                <input type="email" name="mail" placeholder="Type your mail" />
                <input type="password" name="password" placeholder="Type your password" />
                <p className="text-error">{errorMessage}</p>
                <button>Sign in</button>
            </form>
            <p className="text-center">
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
        </section>
    );
}

function SignUpPage() {
    const [errorMessage, setErrorMessage] = useState("");

    function signUp(event) {
        event.preventDefault();
        const mail = event.target.mail.value;
        const password = event.target.password.value;
        const auth = getAuth();

        createUserWithEmailAndPassword(auth, mail, password)
            .then(userCredential => {
                // Signed in
                const user = userCredential.user;
                // ...
            })
            .catch(error => {
                let code = error.code;
                code = code.replaceAll("-", " ");
                code = code.replaceAll("auth/", "");
                setErrorMessage(code);
            });
    }
    return (
        <section className="page">
            <h1>Sign Up</h1>
            <form onSubmit={signUp}>
                <input type="email" name="mail" placeholder="Type your mail" />
                <input type="password" name="password" placeholder="Type your password" />
                <p className="text-error">{errorMessage}</p>
                <button>Sign up</button>
            </form>

            <p className="text-center">
                Already have an account? <Link to="/signin">Sign In</Link>
            </p>
        </section>
    );
}

function ProfilePage({ showLoader }) {
    const [user, setUser] = useState({});
    const auth = getAuth();

    useEffect(async () => {
        showLoader(true);
        if (auth.currentUser) {
            setUser(auth.currentUser);
            const docRef = doc(usersRef, auth.currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.data()) {
                setUser(prevUser => ({ ...prevUser, ...docSnap.data() }));
            }
        }
        showLoader(false);
    }, [auth.currentUser]);

    function handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        setUser(prevFormData => {
            return {
                ...prevFormData,
                [name]: value
            };
        });
    }

    async function submitEvent(event) {
        event.preventDefault();
        showLoader(true);

        const userToUpdate = { name: user.name, title: user.title, image: user.image };
        console.log(userToUpdate);
        const docRef = doc(usersRef, user.uid);

        await setDoc(docRef, userToUpdate);
        showLoader(false);
    }

    function handleSignOut() {
        signOut(auth);
    }

    return (
        <section className="page">
            <h1>Profile</h1>
            <form onSubmit={submitEvent}>
                <label for="name">Name</label>
                <input type="text" value={user?.name} onChange={handleChange} name="name" placeholder="Type name" />
                <label for="email">Email</label>
                <input type="email" value={user?.email} onChange={handleChange} name="email" placeholder="Type email" disabled />
                <label for="title">Title</label>
                <input type="text" value={user?.title} onChange={handleChange} name="title" placeholder="Type your title" />
                <label for="image">Image url</label>
                <input type="url" value={user?.image} accept="image/*" onChange={handleChange} name="image" placeholder="Paste image url" />
                <img className="image-preview" src={user?.image} alt="Choose" onError={event => (event.target.src = "./img/user-placeholder.jpg")} />
                <button>Save User</button>
            </form>
            <button className="btn-outline" onClick={handleSignOut}>
                Sign Out
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
            if (docSnap.data()) {
                setUser(docSnap.data());
            }
        }
        getUser();
    }, [uid]);

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

function PostForm({ post, handleSubmit }) {
    const [formData, setFormData] = useState({ title: "", body: "", image: "" });
    const [errorMessage, setErrorMessage] = useState("");

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
        const validForm = formData.title && formData.body && formData.image;
        if (validForm) {
            handleSubmit(formData);
        } else {
            setErrorMessage("Please, fill in all fields.");
        }
    }

    return (
        <form onSubmit={submitEvent}>
            <input type="text" value={formData.title} onChange={handleChange} name="title" placeholder="Type title" />
            <input value={formData.body} onChange={handleChange} name="body" placeholder="Type body of your post" />
            <input type="url" value={formData.image} accept="image/*" onChange={handleChange} name="image" placeholder="Paste image url" />
            <img className="image-preview" src={formData.image} alt="Choose" onError={event => (event.target.src = "./img/img-placeholder.jpg")} />
            <p className="text-error">{errorMessage}</p>
            <button>Save</button>
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

// Navbar Componment
function Nav() {
    return (
        <nav>
            <NavLink to="/">Posts</NavLink>
            <NavLink to="/create">Create</NavLink>
            <NavLink to="/profile">Profile</NavLink>
        </nav>
    );
}

// ====== APP ====== //

function App() {
    const [loading, setLoading] = useState(true);
    const auth = getAuth();
    const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

    onAuthStateChanged(auth, user => {
        if (user) {
            // User is signed in
            setIsAuth(true);
            localStorage.setItem("isAuth", true);
        } else {
            // User is signed out
            setIsAuth(false);
            setLoading(false);
            localStorage.removeItem("isAuth");
        }
    });
    return (
        <main>
            {isAuth ? (
                <>
                    <Nav />
                    <Routes>
                        <Route path="/" element={<PostsPage showLoader={setLoading} />} />
                        <Route path="/create" element={<CreatePage showLoader={setLoading} />} />
                        <Route path="/profile" element={<ProfilePage showLoader={setLoading} />} />
                        <Route path="/posts/:postId" element={<UpdatePage showLoader={setLoading} />} />
                        <Route path="*" element={<Navigate replace to="/" />} />
                    </Routes>
                </>
            ) : (
                <Routes>
                    <Route path="/signin" element={<SignInPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="*" element={<Navigate replace to="/signin" />} />
                </Routes>
            )}
            <Loader show={loading} />
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
