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

function App() {
    return (
        <>
            <h1>Hello Form</h1>
            <Form />
        </>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
