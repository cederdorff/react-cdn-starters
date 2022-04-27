import React, { useState } from "https://cdn.skypack.dev/react";
import * as ReactDOM from "https://cdn.skypack.dev/react-dom";

function Form() {
    const [selectedItems, setSelectedItems] = useState([]);

    function handleChange(event) {
        const checkboxes = event.target.form.elements;
        const selectedCheckboxes = [];

        for (const checkbox of checkboxes) {
            if (checkbox.checked) {
                selectedCheckboxes.push(checkbox.value);
            }
        }

        setSelectedItems(selectedCheckboxes);
    }

    return (
        <>
            <form onChange={handleChange}>
                <label>
                    JavaScript
                    <input type="checkbox" value="JavaScript" />
                </label>
                <label>
                    HTML
                    <input type="checkbox" value="HTML" />
                </label>
                <label>
                    CSS
                    <input type="checkbox" value="CSS" />
                </label>
            </form>

            {selectedItems}
        </>
    );
}

function Form2() {
    const [javaScript, setJavaScript] = useState(localStorage.getItem("JavaScript"));
    const [html, setHtml] = useState(localStorage.getItem("HTML"));
    const [css, setCss] = useState(localStorage.getItem("CSS"));

    function handleSubmit(event) {
        event.preventDefault();

        for (const item of event.target.elements) {
            if (item.checked) {
                localStorage.setItem(item.value, true);
            } else {
                localStorage.removeItem(item.value);
            }
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>
                    JavaScript
                    <input type="checkbox" value="JavaScript" onChange={e => setJavaScript(e.target.checked)} checked={javaScript} />
                </label>
                <label>
                    HTML
                    <input type="checkbox" value="HTML" onChange={e => setHtml(e.target.checked)} checked={html} />
                </label>
                <label>
                    CSS
                    <input type="checkbox" value="CSS" onChange={e => setCss(e.target.checked)} checked={css} />
                </label>

                <button>submit</button>
            </form>
        </>
    );
}

function App() {
    return (
        <>
            <h1>Hello Form</h1>
            {/* <Form /> */}
            <Form2 />
        </>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
