let cognitoUser;
let userPool;

function setCookie(name, value, expiry) {
    const d = new Date();
    d.setTime(d.getTime() + (expiry*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteCookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

const getUserPool = () => {
    if (userPool === undefined) {
        userPool = new AmazonCognitoIdentity.CognitoUserPool(_config.cognito);
    }
    return userPool;
};

const getUser = (userName) => {
    if (cognitoUser === undefined) {
        let userData = {
            Username: userName,
            Pool: getUserPool(),
        };
        cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    }
    return cognitoUser;
};

const signUp = (username, password, givenName, familyName, country, industry, contact, callback) => {

    const attributeList = buildAttributeList(givenName, familyName, country, industry, contact)

    getUserPool().signUp(
        username,
        password,
        attributeList,
        null,
        callback
    );
};

const updateUserAttributes = (givenName, familyName, country, industry, contact, callback) => {

    if (cognitoUser !== undefined) {
        const attrList = buildAttributeList(givenName, familyName, country, industry, contact);
        cognitoUser.updateAttributes(attrList, callback);
    } else {
        return {};
    }
}

const buildAttributeList = (givenName, familyName, country, industry, contact) => {
    let attributeList = [];

    if(givenName !== undefined) {
        const dataGivenName = {
            Name: "given_name",
            Value: givenName,
        };
        attributeList.push(
            new AmazonCognitoIdentity.CognitoUserAttribute(dataGivenName)
        );
    }

    if(familyName !== undefined) {
        const dataFamilyName = {
            Name: "family_name",
            Value: familyName,
        };
        attributeList.push(
            new AmazonCognitoIdentity.CognitoUserAttribute(dataFamilyName)
        );
    }

    const dataLocale = {
        Name: "locale",
        Value: navigator.language,
    };
    attributeList.push(
        new AmazonCognitoIdentity.CognitoUserAttribute(dataLocale)
    );

    if(country !== undefined) {
        const datacountry = {
            Name: "custom:country",
            Value: country,
        };
        attributeList.push(
            new AmazonCognitoIdentity.CognitoUserAttribute(datacountry)
        );
    }

    if(industry !== undefined) {
        const dataIndustry = {
            Name: "custom:industry",
            Value: industry,
        };
        attributeList.push(
            new AmazonCognitoIdentity.CognitoUserAttribute(dataIndustry)
        );
    }

    if(contact !== undefined) {
        const dataContact = {
            Name: "custom:contact",
            Value: contact,
        };
        attributeList.push(
            new AmazonCognitoIdentity.CognitoUserAttribute(dataContact)
        );
    }

    return attributeList;
}

const verify = (username, code, callback) => {
    getUser(username).confirmRegistration(code, true, callback);
};

const signIn = (username, password, callback) => {
    let authenticationData = {
        Username: username,
        Password: password
    };

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
        authenticationData
    );

    getUser(username).authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            callback(null, result);
            setCookie('aodnToken', result.accessToken.jwtToken, 7);
            setCookie('isAuthenticated', true, 7);
        },
        onFailure: function (err) {
            callback(err, null);
        },
    });
};

const userAttributes = (callback) => {
    if (cognitoUser) {
        cognitoUser.getUserAttributes((err, result) => {
            if (err) {
                callback(err, null);
            } else {
                // Build attrs into object
                let userInfo = { name: cognitoUser.username };
                for (let k = 0; k < result.length; k++) {
                    userInfo[result[k].getName()] = result[k].getValue();
                }
                callback(null, userInfo);
            }
        });
    } else if (getUserPool().getCurrentUser() != null) {
        cognitoUser = getUserPool().getCurrentUser();
        cognitoUser.getSession((err, session) => {
            if (err) {
                callback(err, null);
            } else {
                cognitoUser.getUserAttributes(function(err, result) {
                    if (err) {
                        callback(err, null);
                    } else {
                        // Build attrs into object
                        let userObject = {};
                        result.forEach((attr) => {
                            userObject[attr.Name] = attr.Value;
                        });
                        callback(null, userObject);
                    }
                });
            }
        });
    } else {
        callback("No User", null);
    }
};

const signOutUser = (callback) => {

    if (cognitoUser) {
        if (cognitoUser.signInUserSession) {
            cognitoUser.signOut();
            callback(null, {})
            cognitoUser = undefined;
            deleteCookie('isAuthenticated');
            deleteCookie('aodnToken');
        }
    } else {
        try {
            callback({name: "Error", message: "User is not signed in"}, null);
        } catch (e) {
            console.log("No user is signed in");
        }
    }
};

const changeUserPassword = (oldPassword, newPassword, callback) => {

    if (cognitoUser) {
        cognitoUser.changePassword(oldPassword, newPassword, callback);
    } else {
        callback({name: "Error", message: "User is not signed in"}, null);
    }
};

const sendPasswordResetCode = (userName, callback) => {

    getUser(userName).forgotPassword({
        onFailure: (err) => callback(err, null),
        onSuccess: (result) => callback(null, result)
    });
};

const confirmPasswordReset = (username, code, newPassword, callback) => {

    getUser(username).confirmPassword(code, newPassword, {
        onFailure: (err) => callback(err, null),
        onSuccess: (result) => callback(null, result)
    });
};
