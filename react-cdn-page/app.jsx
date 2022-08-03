import React from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";

function Navigation() {
    return (
        <nav>
            <a href="#">Home</a>
        </nav>
    );
}

function Header() {
    return (
        <header>
            <h1>Header</h1>
        </header>
    );
}

function MainContent() {
    return (
        <>
            <section className="left">Column</section>
            <section className="middle">Column</section>
            <section className="right">Column</section>
        </>
    );
}

function Footer() {
    return (
        <footer>
            <p>This is a Footer</p>
        </footer>
    );
}

function App() {
    return (
        <main className="page-layout">
            <Navigation />
            <Header />
            <MainContent />
            <Footer />
        </main>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
