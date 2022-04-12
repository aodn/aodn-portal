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
        <hr>
        <div>
          <h3 style="margin: 5px; margin-left: 0px;">Why are we asking you to register to use the AODN Portal?</h3>
          <p>In registering to use the AODN Portal, we’ll use the details you voluntarily provide to more
            fully understand how you use the service. We value your insights into what works well and how we can improve and
            ease data access and use. We will respect your privacy and appreciate your feedback.</p>
        </div>
        <div>
          <h3 style="margin: 5px; margin-left: 0px;">How will we look after your personal information?</h3>
          <p>Only selected people in the IMOS Office will be able to access the information you provide. The
            information will be securely stored, and you will only be contacted for the purpose of providing feedback about your
            user experience. You can opt-out of this at any time by deleting your account from the Portal or by contacting the
            AODN Technical team <a href="mailto:info@aodn.org.au">here</a>.</p>
        </div>
    </div>
</div>
