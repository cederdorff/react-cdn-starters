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

function PageContent() {
    return (
        <>
            <section class="left">Column</section>
            <section class="middle">Column</section>
            <section class="right">Column</section>
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
        <main className="grid-layout">
            <Navigation />
            <Header />
            <PageContent />
            <Footer />
        </main>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
