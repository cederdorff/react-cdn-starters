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
            <h1>React Page Template</h1>
        </header>
    );
}

function PageContent() {
    return (
        <section>
            <h2>Here goes some page content</h2>
        </section>
    );
}

function Footer() {
    return (
        <footer>
            <p>This is my Footer</p>
        </footer>
    );
}

function App() {
    return (
        <>
            <Navigation />
            <Header />
            <PageContent />
            <Footer />
        </>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
