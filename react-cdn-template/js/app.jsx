import React from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";

function Greeting({ name }) {
    return <h1>Hello, {name}</h1>;
}

function MyComponent() {
    const name = "RACE";

    return (
        <section>
            <h1>Hello, {name}</h1>
        </section>
    );
}

function App() {
    return (
        <>
            <Greeting name="world" />
            <MyComponent />
        </>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
