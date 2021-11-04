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
    window.auth.closeModals();
    const modal = document.getElementById(modalName);
    if(modal) modal.style.display = "block";
}

window.auth.closeModals = () => {
    ['signInModal', 'signUpModal', 'signUpMessage', 'resetPasswordModal', 'requestPasswordResetCodeModal'].forEach(
        modalName => {
        const modal = document.getElementById(modalName);
        if(modal) modal.style.display = "none";
    });
    ['signUpForm', 'signInForm', 'resetPasswordForm', 'requestPasswordResetCodeForm'].forEach(formName => {
        const form = document.getElementById(formName);
        if(form) form.reset();
    });
    ['signUpError', 'signInError', 'resetPasswordError', 'requestPasswordResetCodeError'].forEach(formName => {
        const msg = document.getElementById(formName);
        if(msg) msg.textContent = "";
    });
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
    window.auth.openModal("signUpModal");
};

window.auth.signInButtonHandler = () => {
    window.auth.openModal("signInModal");
};

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
    });
}

window.auth.signUpFormSubmit = (e) => {
    e.preventDefault();
    const username = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    const phoneNumber = document.getElementById('signUpPhoneNumber').value;
    const givenName = document.getElementById('signUpFirstName').value;
    const familyName = document.getElementById('signUpLastName').value;
    const locale = document.getElementById('signUpLocale').value;
    const industry = document.getElementById('signUpIndustry').value;
    signUp(username, password, phoneNumber, givenName, familyName, locale, industry, (err) => {
        if(err) {
            document.getElementById('signUpError').textContent = err.message;
        } else {
            window.auth.openModal("signUpMessage");
        }
    });
}

window.auth.requestPasswordResetCodeFormSubmit = (e) => {
    e.preventDefault();
    const username = document.getElementById('requestPasswordResetCodeEmail').value;
    sendPasswordResetCode(username, (err) => {
        if(err) {
            document.getElementById('requestPasswordResetCodeError').textContent = err.message;
        } else {
            window.auth.openModal("resetPasswordModal")
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
