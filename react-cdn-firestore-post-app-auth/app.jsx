// React Imports
import * as React from "https://cdn.skypack.dev/react";
import * as ReactDOM from "https://cdn.skypack.dev/react-dom";
import {
    HashRouter,
    Routes,
    Route,
    NavLink,
    Link,
    useNavigate,
    useParams,
    Navigate
} from "https://cdn.skypack.dev/react-router-dom";
import { postsRef, usersRef } from "./firebase-config.js";
import {
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    addDoc,
    getDoc,
    serverTimestamp,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js";
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";

// ====== PAGES ====== //

// Posts Page (Home Page)
function PostsPage({ showLoader }) {
    const [posts, setPosts] = React.useState([]);

    React.useEffect(async () => {
        const q = query(postsRef, orderBy("createdAt", "desc"));
        onSnapshot(q, data => {
            const postsData = data.docs.map(doc => {
                return { ...doc.data(), id: doc.id };
            });
            setPosts(postsData);
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
    React.useEffect(() => {
        showLoader(false);
    }, []);
    async function createPost(newPost) {
        showLoader(true);
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
            <input
                type="url"
                value={formData.image}
                accept="image/*"
                onChange={handleChange}
                name="image"
                placeholder="Paste image url"
            />
            <img
                className="image-preview"
                src={formData.image}
                alt="Choose"
                onError={event => (event.target.src = "./img/user-placeholder.jpg")}
            />
            <button>Save</button>
        </form>
    );
}

function UpdatePage({ showLoader }) {
    const [post, setPost] = React.useState({});
    const params = useParams();
    const navigate = useNavigate();
    const postId = params.postId;
    const docRef = doc(postsRef, postId);

    React.useEffect(async () => {
        const docSnap = await getDoc(docRef);
        setPost(docSnap.data());
        showLoader(false);
    }, []);

    async function savePost(postToUpdate) {
        showLoader(true);
        await updateDoc(docRef, postToUpdate);
        navigate("/");
    }

    async function deletePost() {
        const confirmDelete = confirm(`Do you want to delete post, ${post.title}?`);
        if (confirmDelete) {
            showLoader(true);
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

// SIGN IN Page
function SignInPage() {
    const [errorMessage, setErrorMessage] = React.useState("");

    function signIn(event) {
        event.preventDefault();
        const mail = event.target.mail.value;
        const password = event.target.password.value;
        const auth = getAuth();
        signInWithEmailAndPassword(auth, mail, password)
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
    const [errorMessage, setErrorMessage] = React.useState("");

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

function ProfilePage({ showLoader }) {
    const [user, setUser] = React.useState({});
    const auth = getAuth();

    React.useEffect(() => {
        setUser(auth.currentUser);
        showLoader(false);
    }, [auth]);
    return (
        <section className="page">
            <h1>Profile</h1>
            {JSON.stringify(user)}
        </section>
    );
}

// ====== UserAvatar Component ====== //
function UserAvatar({ uid }) {
    const [user, setUser] = React.useState({
        image: "./img/user-placeholder.jpg",
        name: "User's Name",
        title: "User's Title"
    });

    React.useEffect(async () => {
        const docRef = doc(usersRef, uid);
        const docSnap = await getDoc(docRef);
        setUser(docSnap.data());
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

function Loader({ show }) {
    return (
        <section className={show ? "loader" : "loader hide"}>
            <section className="spinner"></section>
        </section>
    );
}

// Navbar Componment
function Nav() {
    function handleSignOut() {
        const auth = getAuth();
        signOut(auth);
    }
    return (
        <nav>
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                Posts
            </NavLink>
            <NavLink to="/create" className={({ isActive }) => (isActive ? "active" : "")}>
                Create
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
                Profile
            </NavLink>
            <a className="btn-sign-out" onClick={handleSignOut}>
                Sign Out
            </a>
        </nav>
    );
}

// ====== APP ====== //

function App() {
    const [loading, setLoading] = React.useState(true);
    const auth = getAuth();
    const [isAuth, setIsAuth] = React.useState(localStorage.getItem("isAuth"));

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
    <React.StrictMode>
        <HashRouter>
            <App />
        </HashRouter>
    </React.StrictMode>,
    document.querySelector("#root")
);
