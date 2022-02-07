// ========== GLOBAL VARIABLES ==========
let _users = [];
const _baseUrl = "https://api.jsonbin.io/v3/b/{your-json-bin-id}";
const _headers = {
    "X-Master-Key": "{your-x-master-key}",
    "Content-Type": "application/json"
};

// ========== READ ========== //
async function fetchUsers() {
    const url = _baseUrl + "/latest"; // make sure to get the latest version
    const response = await fetch(url, {
        headers: _headers
    });
    const data = await response.json();
    console.log(data);
    _users = data.record;
}

/**
 * Fetchs person data from jsonbin
 */
export async function getUsers() {
    if (_users.length === 0) {
        await fetchUsers();
    }
    return _users;
}

export async function getUser(id) {
    if (_users.length === 0) {
        await fetchUsers();
    }
    return _users.find(user => user.id == id);
}

// ========== CREATE ========== //
export async function createUser({ name, mail, image }) {
    const newId = Date.now();

    // to do:
    // create new object with the properties: id, name, mail & image
    //and push to _users
    // then call await updateJSONBIN() to update your data source
}

// ========== UPDATE ========== //
export async function updateUser({ id, name, mail, image }) {
    // to do:
    // based on the given parameter, id, find the user to update and set properties: name, mail & image
    // then call await updateJSONBIN() to update your data source
}

// ========== DELETE ========== //
export async function deleteUser(id) {
    _users = _users.filter(user => user.id != id);
    await updateJSONBIN(_users);
}

// ========== UPDATE JSONBIN ========== //
/**
 * Updates the data source on jsonbin with a given users arrays
 */
async function updateJSONBIN() {
    // put users array to jsonbin
    const response = await fetch(_baseUrl, {
        method: "PUT",
        headers: _headers,
        body: JSON.stringify(_users)
    });
    // waiting for the result
    const result = await response.json(); // the new updated users array from jsonbin
    _users = result.record;
}
