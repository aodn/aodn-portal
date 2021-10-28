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

const signUp = (username, password, phoneNumber, givenName, familyName, locale, industry, callback) => {

    // Default to example callback
    callback = callback || exampleCallback(true, "User registered.");

    const attributeList = buildAttributeList(phoneNumber, givenName, familyName, locale, industry)

    getUserPool().signUp(
        username,
        password,
        attributeList,
        null,
        callback
    );
};

const updateUserAttributes = (phoneNumber, givenName, familyName, locale, industry, callback) => {

    // Default to example callback
    callback = callback || exampleCallback(true, "User attributes updated.");

    if (cognitoUser !== undefined) {
        const attrList = buildAttributeList(phoneNumber, givenName, familyName, locale, industry);
        cognitoUser.updateAttributes(attrList, callback);
    } else {
        return {};
    }
}

const buildAttributeList = (phoneNumber, givenName, familyName, locale, industry) => {
    let attributeList = [];

    if(phoneNumber !== undefined) {
        const dataPhoneNumber = {
            Name: "phone_number",
            Value: phoneNumber,
        };
        attributeList.push(
            new AmazonCognitoIdentity.CognitoUserAttribute(dataPhoneNumber)
        );
    }

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

    if(locale !== undefined) {
        const dataLocale = {
            Name: "locale",
            Value: locale,
        };
        attributeList.push(
            new AmazonCognitoIdentity.CognitoUserAttribute(dataLocale)
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

    return attributeList;
}

const verify = (username, code, callback) => {

    // Default to example callback
    callback = callback || exampleCallback(true, "User signed in.");

    getUser(username).confirmRegistration(code, true, callback);
};

const signIn = (username, password, callback) => {

    // Default to example callback
    callback = callback || exampleCallback(true, "User signed in.");

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

    // Default to example callback
    callback = callback || exampleCallback(true, "User signed out.");

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

    // Default to example callback
    callback = callback || exampleCallback(false, "Password changed.");

    if (cognitoUser) {
        cognitoUser.changePassword(oldPassword, newPassword, callback);
    } else {
        callback({name: "Error", message: "User is not signed in"}, null);
    }
};

const sendPasswordResetCode = (userName, callback) => {

    // Default to example callback
    callback = callback || exampleCallback(false, "Password reset requested.");

    getUser(userName).forgotPassword({
        onFailure: (err) => callback(err, null),
        onSuccess: (result) => callback(null, result)
    });
};

const confirmPasswordReset = (username, code, newPassword, callback) => {

    // Default to example callback
    callback = callback || exampleCallback(false, "Password updated.");

    getUser(username).confirmPassword(code, newPassword, {
        onFailure: (err) => callback(err, null),
        onSuccess: (result) => callback(null, result)
    });
};


/*
    Example function to update part of the UI - Effectively will be replace by https://github.com/aodn/backlog/issues/3520
    Note: This is called twice as it is in awkward demo setup
 */

const loginIcon = () => {
    if (getCookie('skipLogin')) {
        return "";
    } else {
        let el = jQuery("<span></span>");
        el.attr('class', 'fa fa-sign-in')
            .on('click', () => {
                window.showLogin();
            });
        return el;
    }
}

const logoutIcon = () => {
    let el = jQuery("<span></span>");
    el.attr('class', 'fa fa-sign-out')
        .on('click', () => {signOutUser()})
    return el;
}

const updateUserSlug = () => {
    userAttributes(exampleCallback(false, "Updating slug", (err, result) => {
        if (err) {
            jQuery("#nameTag").text('Hi Guest ');
            jQuery("#authStatus").empty().append(loginIcon());
        } else if (result.hasOwnProperty("given_name")){
            jQuery("#nameTag").text(`Hi ${result.given_name} `);
            jQuery("#authStatus").empty().append(logoutIcon());
        } else {
            jQuery("#nameTag").text('Hi Guest ');
            jQuery("#authStatus").empty().append(loginIcon());
        }
    }));
};

/*
    This function is just a placeholder for what the UI will actually do
 */
const exampleCallback = (updateSlug, message, callback) => {

    // Handle missing callback
    if(callback === undefined){
        callback = (err, result) => {};
    }

    return (err, result) => {
        if (err) {
            console.log(err.message || JSON.stringify(err));
            callback(err, null)
        } else {
            console.log(message || "Success", result);
            callback(null, result)
            if(updateSlug) {
                updateUserSlug();
            }
        }
    }
}
