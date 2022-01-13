<div id="signInModal" class="modal">
    <div class="modal-content">
        <div class="x-tool x-tool-close" onClick="window.auth.closeModals()"></div>
        <h2>Sign In</h2>
        <div id="signInError" class="modal-message modal-error"></div>
        <form id="signInForm" class="modal-form" onSubmit="window.auth.signInFormSubmit(event)">
        <div>
            <label for="signInEmail">Email</label>
            <input type="email" autocomplete="username" placeholder="Enter Email" id="signInEmail" name="email" required>
        </div>
        <div>
            <label for="signInPassword">Password</label>
            <input type="password" autocomplete="current-password" placeholder="Enter Password" id="signInPassword" name="password" required>
        </div>
            <button class="auth-submit-btn" style="margin-right: 20px" id="signInButton" type="submit">Sign In</button>
            <a href="#" onClick="window.auth.requestPasswordResetButtonHandler()">Reset Password</a>
        </form>
        <hr>
        <div style="text-align: center">
            <h2>Don't yet have an account?</h2>
            <button class="auth-submit-btn" onClick="window.auth.openModal('signUpModal')">Register</button>
            or
            <a href="#" onClick="window.auth.guestButtonHandler(event);">Continue As Guest</a>
        </div>
    </div>
</div>
