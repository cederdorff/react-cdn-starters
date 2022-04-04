import React from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";

function Greeting({ name }) {
    return <h1>Hello, {name}</h1>;
}

function App() {
    return (
        <>
            <Greeting name="world" />
        </>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
