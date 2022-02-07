// ========== GLOBAL VARIABLES ==========
let _users = [];
const _baseUrl = "https://api.jsonbin.io/v3/b/61138ef2d5667e403a3fb6a1";
const _headers = {
    "X-Master-Key": "$2b$10$Uf1lbMtIPrrWeneN3Wz6JuDcyBuOz.1LbHiUg32QexCCJz3nOpoS2",
    "Content-Type": "application/json"
};

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

export async function createUser({ name, mail, image }) {
    const userId = Date.now();
    const newUser = {
        name: name,
        mail: mail,
        image: image,
        id: userId
    };
    _users.push(newUser);
    await updateJSONBIN();
}

export async function updateUser({ id, name, mail, image }) {
    const userToUpdate = _users.find(user => user.id == id);
    userToUpdate.name = name;
    userToUpdate.mail = mail;
    userToUpdate.image = image;
    await updateJSONBIN();
}

export async function deleteUser(id) {
    _users = _users.filter(user => user.id != id);
    await updateJSONBIN(_users);
}

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
}
