if (window.auth) {
  window.user = window.auth ? UserAuthentication() : {};
  window.auth = window.auth || {};
  var currentUser;

  window.auth.openModal = function (modalName) {
    const modal = document.getElementById(modalName);
    if (modal) modal.style.display = "block";
  };

  window.auth.closeModals = function () {
    document.querySelectorAll(".modal").forEach(function (m) {
      m.style.display = "none";
    });
    document.querySelectorAll(".modal-form").forEach(function (f) {
      f.reset();
    });
    document.querySelectorAll(".modal-message").forEach(function (e) {
      e.textContent = "";
    });
  };

  window.auth.refreshHeader = function () {
    const authSignedIn = document.getElementById("authSignedIn");
    const authSignedOut = document.getElementById("authSignedOut");
    const authIsGuest = document.getElementById("authIsGuest");
    const loginUserProfileLink = document.getElementById(
      "loginUserProfileLink"
    );

    if (window.user.isGuest()) {
      loginUserProfileLink.textContent = "Guest";
      authIsGuest.style.display = "initial";
      authSignedIn.style.display = "none";
      authSignedOut.style.display = "initial";
      currentUser = "Guest";
    } else if (window.user.isSignedIn()) {
      const details = window.user.getUserCookie();
      loginUserProfileLink.textContent = details.email;
      authIsGuest.style.display = "none";
      authSignedIn.style.display = "initial";
      authSignedOut.style.display = "none";
      currentUser = details.name;
    } else {
      loginUserProfileLink.textContent = "";
      authIsGuest.style.display = "none";
      authSignedIn.style.display = "none";
      authSignedOut.style.display = "initial";
    }

    window.auth.closeModals();
  };

  /** Download handlers */

  window.auth.verifySignIn = function () {
    if (window.auth.pendingConfirmation-- > 0) return;
    if (!window.user.isGuest() && !window.user.isSignedIn())
      window.auth.signInButtonHandler();
  };

  /** Button handlers */

  window.auth.signUpButtonHandler = function () {
    window.auth.closeModals();
    window.auth.openModal("signUpModal");
  };

  window.auth.signInButtonHandler = function () {
    window.auth.closeModals();
    window.auth.openModal("signInModal");
  };

  window.auth.confirmSignOutButtonHandler = function () {
    window.auth.closeModals();
    window.auth.openModal("confirmSignOutModal");
  };

  window.auth.confirmDeleteAccountButtonHandler = function () {
    window.auth.closeModals();
    window.auth.openModal("confirmUserDeleteModal");
  };

  window.auth.deleteAccountButtonHandler = function () {
    window.user.delete(function () {
      window.location.reload();
    });
  };

  window.auth.userProfileButtonHandler = function (message) {
    window.user.getDetails(function (_, result) {
      window.auth.closeModals();
      if (message)
        document.getElementById("userProfileMessage").textContent = message;
      document.getElementById("userViewEmail").value = result["email"];
      document.getElementById("userViewFirstName").value = result["given_name"];
      document.getElementById("userViewLastName").value = result["family_name"];
      document.getElementById("userViewCountry").value =
        result["custom:country"];
      document.getElementById("userViewIndustry").value =
        result["custom:industry"];
      document.getElementById("userViewContact").checked =
        result["custom:contact"] === "1";
      window.auth.openModal("userProfileView");
    });
  };

  window.auth.signOutButtonHandler = function () {
    window.user.signOut(function () {
      window.location.pathname = "/";
    });
  };

  window.auth.guestButtonHandler = function (e) {
    e.preventDefault();
    window.user.setAsGuest(window.auth.refreshHeader);
  };

  window.auth.signInFormSubmit = function (e) {
    e.preventDefault();
    document.getElementById("signInButton").disabled = true;
    const signInEmail = document.getElementById("signInEmail").value;
    const signInPassword = document.getElementById("signInPassword").value;
    window.user.signIn(signInEmail, signInPassword, function (err) {
      document.getElementById("signInError").textContent = err
        ? err.message
        : "";
      document.getElementById("signInButton").disabled = false;
      if (window.user.isSignedIn()) {
        window.auth.closeModals();
        window.auth.refreshHeader();
      }
    });
  };

  window.auth.signUpFormSubmit = function (e) {
    document.getElementById("signUpButton").disabled = true;
    e.preventDefault();

    const password = document.getElementById("signUpPassword").value;
    const passwordConfirm = document.getElementById(
      "signUpPasswordConfirm"
    ).value;
    if (password.trim() !== passwordConfirm.trim()) {
      document.getElementById("signUpError").textContent =
        "Passwords do not match";
      document.getElementById("signUpButton").disabled = false;
      return false;
    }
    const username = document.getElementById("signUpEmail").value;
    const givenName = document.getElementById("signUpFirstName").value;
    const familyName = document.getElementById("signUpLastName").value;
    const country = document.getElementById("signUpCountry").value;
    const contact = document.getElementById("signUpContact").checked
      ? "1"
      : "0";
    const industry = document.getElementById("signUpIndustry").value;
    window.user.signUp(
      username,
      password,
      givenName,
      familyName,
      country,
      industry,
      contact,
      function (err) {
        if (err) {
          document.getElementById("signUpError").textContent = err.message;
        } else {
          window.auth.closeModals();
          window.auth.pendingConfirmation = 4;
          window.auth.openModal("signUpMessage");
        }
        document.getElementById("signUpButton").disabled = false;
      }
    );
  };

  window.auth.userEditFormSubmit = function (e) {
    document.getElementById("userProfileSaveButton").disabled = true;
    e.preventDefault();
    const givenName = document.getElementById("userEditFirstName").value;
    const familyName = document.getElementById("userEditLastName").value;
    const country = document.getElementById("userEditCountry").value;
    const contact = document.getElementById("userEditContact").checked
      ? "1"
      : "0";
    const industry = document.getElementById("userEditIndustry").value;
    window.user.setDetails(
      givenName,
      familyName,
      country,
      industry,
      contact,
      function (err) {
        if (err) {
          document.getElementById("userEditError").textContent = err.message;
        } else {
          window.auth.userProfileButtonHandler(
            "Your details have been updated"
          );
        }
        document.getElementById("userProfileSaveButton").disabled = false;
      }
    );
  };

  window.auth.changePasswordFormSubmit = function (e) {
    document.getElementById("changePasswordSaveButton").disabled = true;
    e.preventDefault();
    const currentPassword = document.getElementById(
      "changePasswordCurrent"
    ).value;
    const newPassword = document.getElementById("changePasswordNew").value;
    const newPasswordConfirm = document.getElementById(
      "changePasswordNewConfirm"
    ).value;

    if (newPassword.trim() !== newPasswordConfirm.trim()) {
      document.getElementById("changePasswordError").textContent =
        "Passwords do not match";
      return false;
    }
    window.user.changeUserPassword(
      currentPassword,
      newPassword,
      function (err) {
        if (err) {
          document.getElementById("changePasswordError").textContent =
            err.message;
        } else {
          window.auth.userProfileButtonHandler(
            "Your password has been updated"
          );
        }
        document.getElementById("changePasswordSaveButton").disabled = false;
      }
    );
  };

  window.auth.editProfileButtonHandler = function () {
    window.user.getDetails(function (_, result) {
      window.auth.closeModals();
      document.getElementById("userEditEmail").value = result["email"];
      document.getElementById("userEditFirstName").value = result["given_name"];
      document.getElementById("userEditLastName").value = result["family_name"];
      document.getElementById("userEditCountry").value =
        result["custom:country"];
      document.getElementById("userEditIndustry").value =
        result["custom:industry"];
      document.getElementById("userEditContact").checked =
        result["custom:contact"] === "1";
      window.auth.openModal("userProfileEdit");
    });
  };

  window.auth.changePasswordButtonHandler = function () {
    window.auth.closeModals();
    window.auth.openModal("changePassword");
  };

  window.auth.requestPasswordResetButtonHandler = function () {
    window.auth.closeModals();
    window.auth.openModal("requestPasswordResetCodeModal");
  };

  window.auth.requestPasswordResetCodeFormSubmit = function (e) {
    e.preventDefault();
    const username = document.getElementById(
      "requestPasswordResetCodeEmail"
    ).value;
    window.user.sendPasswordResetCode(username, function (err) {
      if (err) {
        document.getElementById("requestPasswordResetCodeError").textContent =
          err.message;
      } else {
        window.auth.closeModals();
        window.auth.openModal("resetPasswordModal");
      }
    });
  };

  window.auth.resetPasswordFormSubmit = function (e) {
    e.preventDefault();
    const username = document.getElementById("resetPasswordEmail").value;
    const newPassword = document.getElementById("resetPasswordPassword").value;
    const code = document.getElementById("resetPasswordCode").value;
    window.user.confirmPasswordReset(
      username,
      code,
      newPassword,
      function (err) {
        if (err) {
          document.getElementById("resetPasswordError").textContent =
            err.message;
        } else {
          window.auth.signInButtonHandler();
        }
      }
    );
  };
}
