import React, { useState } from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";

function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

function Counter() {
  const [count, setCount] = useState(0);

  function updateCount() {
    setCount(count + 1);
  }

  return (
    <section>
      My count: <p>{count}</p>
      <button onClick={updateCount}>Increment Count</button>
    </section>
  );
}

function App() {
  return (
    <>
      <Greeting name='world' />
      <Counter />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
