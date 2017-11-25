const userstorage = require("./userstorage");

exports.checkAuthorization = function(callerId) {
    return new Promise((resolve, reject) => {
        userstorage.checkAuthorizationForId(callerId)
            .then(found => {
                if (found) {
                    resolve();
                }
                else
                    resolve(false);
            })
            .then(found => {
                if (found) {
                    resolve();
                } else {
                    reject({ action: 2, error: "No authorization" });
                }
            });
    })
}