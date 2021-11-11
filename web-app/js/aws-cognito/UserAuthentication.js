"use strict";

const UserAuthentication = function () {
  let _cognitoUser = null;
  let _userPool = null;

  const _getUserPool = function () {
    if (!_userPool) {
      _userPool = new AmazonCognitoIdentity.CognitoUserPool(_config.cognito);
    }
    return _userPool;
  };

  const _getUser = function (email) {
    if (!_cognitoUser) {
      _cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: email,
        Pool: _getUserPool(),
      });
    }
    return _cognitoUser;
  };

  const _buildAttributeList = function (
    givenName,
    familyName,
    country,
    industry,
    contact
  ) {
    let attributeList = [];

    if (givenName !== undefined) {
      const dataGivenName = {
        Name: "given_name",
        Value: givenName,
      };
      attributeList.push(
        new AmazonCognitoIdentity.CognitoUserAttribute(dataGivenName)
      );
    }

    if (familyName !== undefined) {
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

    if (country !== undefined) {
      const datacountry = {
        Name: "custom:country",
        Value: country,
      };
      attributeList.push(
        new AmazonCognitoIdentity.CognitoUserAttribute(datacountry)
      );
    }

    if (industry !== undefined) {
      const dataIndustry = {
        Name: "custom:industry",
        Value: industry,
      };
      attributeList.push(
        new AmazonCognitoIdentity.CognitoUserAttribute(dataIndustry)
      );
    }

    if (contact !== undefined) {
      const dataContact = {
        Name: "custom:contact",
        Value: contact,
      };
      attributeList.push(
        new AmazonCognitoIdentity.CognitoUserAttribute(dataContact)
      );
    }

    return attributeList;
  };

  const _setCookie = function (name, value, expiry) {
    const d = new Date();
    d.setTime(d.getTime() + expiry * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  };

  const _getCookie = function (cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  };

  const _deleteCookie = function (name) {
    document.cookie =
      name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  };

  const _setUserCookie = function (userToken) {
    _setCookie("aodnPortalUser", JSON.stringify(userToken), 365);
  };

  const _setGuestCookie = function () {
    _setCookie("aodnPortalGuest", true, 1);
  };

  const _getUserCookie = function () {
    const cookie = _getCookie("aodnPortalUser");
    return cookie ? JSON.parse(cookie) : null;
  };

  const _getGuestCookie = function () {
    const cookie = _getCookie("aodnPortalGuest");
    return cookie ? true : null;
  };

  const _clearCookies = function () {
    _deleteCookie("aodnPortalUser");
    _deleteCookie("aodnPortalGuest");
  };

  return {
    isGuest: function () {
      return _getGuestCookie() !== null;
    },
    setAsGuest: function (callback) {
      _setGuestCookie();
      callback();
    },
    isSignedIn: function () {
      return _cognitoUser !== null && _getUserCookie() !== null;
    },
    signUp: function (
      username,
      password,
      givenName,
      familyName,
      country,
      industry,
      contact,
      callback
    ) {
      const attributeList = _buildAttributeList(
        givenName,
        familyName,
        country,
        industry,
        contact
      );
      _getUserPool().signUp(username, password, attributeList, null, callback);
    },
    setDetails: function (
      givenName,
      familyName,
      country,
      industry,
      contact,
      callback
    ) {
      if (_cognitoUser !== undefined) {
        const attrList = _buildAttributeList(
          givenName,
          familyName,
          country,
          industry,
          contact
        );
        _cognitoUser.updateAttributes(attrList, callback);
      } else {
        return {};
      }
    },
    signIn: function (email, password, callback) {
      _clearCookies();
      const authenticationDetails =
        new AmazonCognitoIdentity.AuthenticationDetails({
          Username: email,
          Password: password,
        });
      _getUser(email).authenticateUser(authenticationDetails, {
        onSuccess: function (res) {
          _setUserCookie({ email, token: res.accessToken.jwtToken });
          callback(null);
        },
        onFailure: function (err) {
          _cognitoUser = null;
          callback(err);
        },
      });
    },
    getDetails: function (callback) {
      if (_cognitoUser) {
        _cognitoUser.getUserAttributes((err, result) => {
          if (err) {
            callback(err, null);
          } else {
            // Build attrs into object
            let userInfo = { name: _cognitoUser.username };
            for (let k = 0; k < result.length; k++) {
              userInfo[result[k].getName()] = result[k].getValue();
            }
            callback(null, userInfo);
          }
        });
      } else if (_getUserPool().getCurrentUser() != null) {
        _cognitoUser = _getUserPool().getCurrentUser();
        _cognitoUser.getSession((err, session) => {
          if (err) {
            callback(err, null);
          } else {
            _cognitoUser.getUserAttributes(function (err, result) {
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
    },
    signOut: function (callback) {
      if (_cognitoUser && _cognitoUser.signInUserSession) {
        _cognitoUser.signOut();
        _cognitoUser = undefined;
        _clearCookies();
        callback(null, {});
      }
    },
    delete: function (callback) {
      _cognitoUser.deleteUser(callback, function () {
        _clearCookies;
        callback();
      });
    },
    changeUserPassword: function (oldPassword, newPassword, callback) {
      if (_cognitoUser) {
        _cognitoUser.changePassword(oldPassword, newPassword, callback);
      } else {
        callback({ name: "Error", message: "User is not signed in" }, null);
      }
    },
    sendPasswordResetCode: function (userName, callback) {
      _getUser(userName).forgotPassword({
        onFailure: (err) => callback(err, null),
        onSuccess: (result) => callback(null, result),
      });
    },
    confirmPasswordReset: function (username, code, newPassword, callback) {
      _getUser(username).confirmPassword(code, newPassword, {
        onFailure: (err) => callback(err, null),
        onSuccess: (result) => callback(null, result),
      });
    },
  };
};

window.auth = { pendingConfirmation: 0 };
