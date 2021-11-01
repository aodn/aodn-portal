<div id="signInModal" class="modal">
    <div class="modal-content">
        <div class="x-tool x-tool-close" onClick="window.auth.closeModals()"></div>
        <h2>Sign In</h2>
        <div id="signInError" style="font-weight: bolder; text-align:center; color: darkred"></div>
        <form id="signInForm" class="modal-form" onSubmit="window.auth.signInFormSubmit(event)">
        <div>
            <label for="email">Email</label>
            <input type="email" autocomplete="username" placeholder="Enter Email" id="signInEmail" name="email" required>
        </div>
        <div>
            <label for="password">Password</label>
            <input type="password" autocomplete="current-password" placeholder="Enter Password" id="signInPassword" name="password" required>
        </div>
            <button class="auth-submit-btn" style="margin-right: 20px" type="submit">Sign In</button>
            <a href="#" onClick="window.auth.guestButtonHandler(event);">Reset Password</a>
        </form>
        <hr>
        <div style="text-align: center">
            <h2>Don't yet have an account?</h2>
            <button class="auth-submit-btn" onClick="window.auth.openModal('signUpModal')">Sign Up</button>
            or
            <a href="#" onClick="window.auth.guestButtonHandler(event);">Continue As Guest</a>
        </div>
        <hr>
        <div>
            <h2>Why Sign In?</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.</p>
        </div>
    </div>
</div>
