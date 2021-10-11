let cognitoUser;
let userPool;

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

const signUp = (
    username,
    password,
    phoneNumber,
    givenName,
    familyName,
    locale,
    industry
) => {
    let attributeList = [];

    const dataPhoneNumber = {
        Name: "phone_number",
        Value: phoneNumber,
    };

    const dataGivenName = {
        Name: "given_name",
        Value: givenName,
    };

    const dataFamilyName = {
        Name: "family_name",
        Value: familyName,
    };

    const dataLocale = {
        Name: "locale",
        Value: locale,
    };

    const dataIndustry = {
        Name: "custom:industry",
        Value: industry,
    };

    attributeList.push(
        new AmazonCognitoIdentity.CognitoUserAttribute(dataPhoneNumber)
    );
    attributeList.push(
        new AmazonCognitoIdentity.CognitoUserAttribute(dataGivenName)
    );
    attributeList.push(
        new AmazonCognitoIdentity.CognitoUserAttribute(dataFamilyName)
    );
    attributeList.push(
        new AmazonCognitoIdentity.CognitoUserAttribute(dataLocale)
    );
    attributeList.push(
        new AmazonCognitoIdentity.CognitoUserAttribute(dataIndustry)
    );

    getUserPool().signUp(
        username,
        password,
        attributeList,
        null,
        (err, result) => {
            if (err) {
                alert(err.message || JSON.stringify(err));
            } else {
                console.log("User signed up.", result);
            }
        }
    );
};

const verify = (username, code) => {
    getUser(username).confirmRegistration(code, true, (err, result) => {
        if (err) {
            alert(err.message || JSON.stringify(err));
        } else {
            console.log("User confirmed", result);
        }
    });
};

const signIn = (username, password) => {
    let authenticationData = {
        Username: username,
        Password: password,
    };

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
        authenticationData
    );

    getUser(username).authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            updateUserSlug();
        },

        onFailure: function (err) {
            alert(err.message || JSON.stringify(err));
        },
    });
};

const userAttributes = (attrCallback) => {
    if (cognitoUser) {
        cognitoUser.getUserAttributes((err, result) => {
            if (err) {
                attrCallback({});
            } else {
                let userInfo = { name: cognitoUser.username };
                for (let k = 0; k < result.length; k++) {
                    userInfo[result[k].getName()] = result[k].getValue();
                }
                attrCallback(userInfo);
            }
        });
    }
    if (getUserPool().getCurrentUser() != null) {
        cognitoUser = getUserPool().getCurrentUser();
        cognitoUser.getSession((err, session) => {
            if (err) {
                alert(err);
                return;
            }

            cognitoUser.getUserAttributes(function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    let userObject = {};
                    result.forEach((attr) => {
                        userObject[attr.Name] = attr.Value;
                    });
                    attrCallback(userObject);
                }
            });
        });
    } else {
        console.log("No User");
        attrCallback({});
    }
};

const updateUserSlug = () => {
    userAttributes((attrs) => {
        const userName = attrs.hasOwnProperty("given_name")
            ? attrs.given_name
            : "Guest";

        jQuery("#nameTag").html(`Hi, ${userName} `);
    });
};

const signOutUser = (callback) => {
    if (cognitoUser) {
        if (cognitoUser.signInUserSession) {
            cognitoUser.signOut();
            if(callback !== undefined) {
                callback(null, {});
            }
            updateUserSlug();
            return;
        }
    }
    try {
        callback({name: "Error", message: "User is not signed in"}, null);
    } catch (e) {
        console.log("No user is signed in");
    }
};

const changeUserPassword = (oldPassword, newPassword) => {
    if (cognitoUser) {
        cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
            if(err){
                console.log(err);
            } else {
                console.log("Password changed.", result);
            }
        });
        return;
    }
    callback({ name: "Error", message: "User is not signed in" }, null);
};

const sendPasswordResetCode = (userName) => {
    getUser(userName).forgotPassword((err, result) => {
        if(err){
            alert(err.message || JSON.stringify(err));
        } else {
            console.log("Password changed requested.", result);
        }
    });
};

const confirmPasswordReset = (username, code, newPassword, callback) => {
    getUser(username).confirmPassword(code, newPassword, (err, result) => {
        if(err){
            alert(err.message || JSON.stringify(err));
        } else {
            console.log("Password reset.", result);
        }
    });
};
