window.auth = {};

window.auth.setUserCookie = (user) => {
    setCookie("aodnPortalUser", JSON.stringify(user), 365)
}

window.auth.setGuestCookie = () => setCookie("aodnPortalGuest", true, 1);

window.auth.getUserCookie = () => {
    const cookie = getCookie("aodnPortalUser");
    return (cookie) ? JSON.parse(cookie) : null;
}

window.auth.getGuestCookie = () => {
    const cookie = getCookie("aodnPortalGuest");
    return (cookie) ? true : false;
}

window.auth.clearUserCookie = () => deleteCookie("aodnPortalUser", null);

window.auth.clearGuestCookie = () => deleteCookie("aodnPortalGuest");

window.auth.isGuestOrSignedIn = () => {
    return window.auth.getGuestCookie() || window.auth.getUserCookie();
}

window.auth.openModal = (modalName) => {
    const modal = document.getElementById(modalName);
    if(modal) modal.style.display = "block";
}

window.auth.closeModals = () => {
    document.querySelectorAll(".modal").forEach(m => m.style.display = "none");
    document.querySelectorAll(".modal-form").forEach(f=> f.reset());
    document.querySelectorAll(".modal-message").forEach(e=> e.textContent = "");
}

window.auth.refreshHeader = () => {
    const isGuest = window.auth.getGuestCookie();
    const user = window.auth.getUserCookie();
    const authSignedIn = document.getElementById("authSignedIn");
    const authSignedOut = document.getElementById("authSignedOut");
    const authIsGuest = document.getElementById("authIsGuest");
    const loginUserProfileLink = document.getElementById("loginUserProfileLink");

    if(isGuest) {
        loginUserProfileLink.textContent = "Guest";
        authIsGuest.style.display = "initial";
        authSignedIn.style.display = "none";
        authSignedOut.style.display = "initial";
    } else {
        if(user?.email) {
            loginUserProfileLink.textContent = user.email;
            authIsGuest.style.display = "none";
            authSignedIn.style.display = "initial";
            authSignedOut.style.display = "none";
        } else {
            loginUserProfileLink.textContent = "";
            authIsGuest.style.display = "none";
            authSignedIn.style.display = "none";
            authSignedOut.style.display = "initial";
        }
    }

    window.auth.closeModals();
};

/** Download handlers */

window.auth.verifySignIn = () => {
    if(!window.auth.isGuestOrSignedIn())
        window.auth.signInButtonHandler();
};

/** Button handlers */

window.auth.signUpButtonHandler = () => {
    window.auth.closeModals();
    window.auth.openModal("signUpModal");
};

window.auth.signInButtonHandler = () => {
    window.auth.closeModals();
    window.auth.openModal("signInModal");
};

window.auth.userProfileButtonHandler = (message) =>
    userAttributes((_, result) => {
        window.auth.closeModals();
        if(message) document.getElementById('userProfileMessage').textContent = message;
        document.getElementById('userViewEmail').value = result['email'];
        document.getElementById('userViewFirstName').value = result['given_name'];
        document.getElementById('userViewLastName').value = result['family_name'];
        document.getElementById('userViewCountry').value = result['custom:country'];
        document.getElementById('userViewIndustry').value = result['custom:industry'];
        document.getElementById('userViewContact').checked = result['custom:contact'] === "1";
        window.auth.openModal("userProfileView");
    });

window.auth.signOutButtonHandler = () => {
    signOutUser(() => {
        window.auth.clearUserCookie();
        window.auth.refreshHeader();
    });
};

window.auth.guestButtonHandler = (e) => {
    e.preventDefault();
    window.auth.clearUserCookie();
    window.auth.setGuestCookie();
    window.auth.refreshHeader();
};

window.auth.signInFormSubmit = (e) => {
    e.preventDefault();
    document.getElementById('signInButton').disabled = true;
    window.auth.clearGuestCookie();
    const signInEmail = document.getElementById('signInEmail').value;
    const signInPassword = document.getElementById('signInPassword').value;
    signIn(signInEmail, signInPassword, (err, res) => {
        if(err) {
            document.getElementById('signInError').textContent = err.message;
        } else {
            const cookie = {email: signInEmail, token: res.accessToken.jwtToken};
            window.auth.setUserCookie(cookie);
            window.auth.refreshHeader();
        }
        document.getElementById('signInButton').disabled = false;
    });
}

window.auth.signUpFormSubmit = (e) => {
    document.getElementById('signUpButton').disabled = true;
    e.preventDefault();

    const password = document.getElementById('signUpPassword').value;
    const passwordConfirm = document.getElementById('signUpPasswordConfirm').value;
    if(password.trim() !== passwordConfirm.trim()) {
        document.getElementById('signUpError').textContent = "Passwords do not match";
        return false;
    }
    const username = document.getElementById('signUpEmail').value;
    const givenName = document.getElementById('signUpFirstName').value;
    const familyName = document.getElementById('signUpLastName').value;
    const country = document.getElementById('signUpCountry').value;
    const contact = document.getElementById('signUpContact').checked ? "1" : "0";
    const industry = document.getElementById('signUpIndustry').value;
    signUp(username, password, givenName, familyName, country, industry, contact, (err) => {
        if(err) {
            document.getElementById('signUpError').textContent = err.message;
        } else {
            window.auth.closeModals();
            window.auth.openModal("signUpMessage");
        }
        document.getElementById('signUpButton').disabled = false;
    });
}


window.auth.userEditFormSubmit = (e) => {
    document.getElementById('userProfileSaveButton').disabled = true;
    e.preventDefault();
    const givenName = document.getElementById('userEditFirstName').value;
    const familyName = document.getElementById('userEditLastName').value;
    const country = document.getElementById('userEditCountry').value;
    const contact = document.getElementById('userEditContact').checked ? "1" : "0";
    const industry = document.getElementById('userEditIndustry').value;
    updateUserAttributes(givenName, familyName, country, industry, contact, (err) => {
        if(err) {
            document.getElementById('userEditError').textContent = err.message;
        } else {
            window.auth.userProfileButtonHandler("Your details have been updated");
        }
        document.getElementById('userProfileSaveButton').disabled = false;
    });
}

window.auth.changePasswordFormSubmit = (e) => {
    document.getElementById('changePasswordSaveButton').disabled = true;
    e.preventDefault();
    const currentPassword = document.getElementById('changePasswordCurrent').value;
    const newPassword = document.getElementById('changePasswordNew').value;
    const newPasswordConfirm = document.getElementById('changePasswordNewConfirm').value;

    if(newPassword.trim() !== newPasswordConfirm.trim()) {
        document.getElementById('changePasswordError').textContent = "Passwords do not match";
        return false;
    }
    changeUserPassword(currentPassword, newPassword, (err) => {
        if(err) {
            document.getElementById('changePasswordError').textContent = err.message;
        } else {
            window.auth.userProfileButtonHandler("Your password has been updated");
        }
        document.getElementById('changePasswordSaveButton').disabled = false;
    });
}

window.auth.editProfileButtonHandler = () => {
    userAttributes((_, result) => {
        window.auth.closeModals();
        document.getElementById('userEditEmail').value = result['email'];
        document.getElementById('userEditFirstName').value = result['given_name'];
        document.getElementById('userEditLastName').value = result['family_name'];
        document.getElementById('userEditCountry').value = result['custom:country'];
        document.getElementById('userEditIndustry').value = result['custom:industry'];
        document.getElementById('userEditContact').checked = result['custom:contact'] === "1";
        window.auth.openModal("userProfileEdit");
    });
}

window.auth.changePasswordButtonHandler = () => {
    window.auth.closeModals();
    window.auth.openModal("changePassword");
}

window.auth.requestPasswordResetButtonHandler = () => {
    window.auth.closeModals();
    window.auth.openModal("requestPasswordResetCodeModal");
}

window.auth.requestPasswordResetCodeFormSubmit = (e) => {
    e.preventDefault();
    const username = document.getElementById('requestPasswordResetCodeEmail').value;
    sendPasswordResetCode(username, (err) => {
        if(err) {
            document.getElementById('requestPasswordResetCodeError').textContent = err.message;
        } else {
            window.auth.closeModals();
            window.auth.openModal("resetPasswordModal");
        }
    })
}

window.auth.resetPasswordFormSubmit = (e) => {
    e.preventDefault();
    const username = document.getElementById('resetPasswordEmail').value;
    const newPassword = document.getElementById('resetPasswordPassword').value;
    const code = document.getElementById('resetPasswordCode').value;
    confirmPasswordReset(username, code, newPassword, (err) => {
        if(err) {
            document.getElementById('resetPasswordError').textContent = err.message;
        } else {
            window.auth.signInButtonHandler();
        }
    })
}
