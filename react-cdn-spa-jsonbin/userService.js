// ========== GLOBAL VARIABLES ==========
let _users = [];
let _selectedUserId;
const _baseUrl = "https://api.jsonbin.io/v3/b/61138ef2d5667e403a3fb6a1";
const _headers = {
    "X-Master-Key": "$2b$10$Uf1lbMtIPrrWeneN3Wz6JuDcyBuOz.1LbHiUg32QexCCJz3nOpoS2",
    "Content-Type": "application/json"
};

/**
 * Fetchs person data from jsonbin
 */
export async function getUsers() {
    const url = _baseUrl + "/latest"; // make sure to get the latest version
    const response = await fetch(url, {
        headers: _headers
    });
    const data = await response.json();
    console.log(data);
    _users = data.record;
    return _users;
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
    const userToUpdate = _users.find(user => user.id === id);
    userToUpdate.name = name;
    userToUpdate.mail = mail;
    userToUpdate.image = image;
    await updateJSONBIN();
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
    console.log(result);
}
