<div id="resetPasswordModal" class="modal">
    <div class="modal-content">
        <div class="x-tool x-tool-close" onClick="window.auth.closeModals()"></div>
        <h2>Reset Password</h2>
        <p>A single-use code has been sent to your email address</p>
        <div id="resetPasswordError" class="modal-message modal-error" style="font-weight: bolder; text-align:center; color: darkred"></div>
        <form id="resetPasswordForm" class="modal-form" onSubmit="window.auth.resetPasswordFormSubmit(event)">
        <div>
            <label for="email">Email</label>
            <input type="email" autocomplete="username" placeholder="Enter Email" id="resetPasswordEmail" name="email" required>
        </div>
        <div>
            <label for="password">New Password</label>
            <input type="password" placeholder="Enter a new Password" id="resetPasswordPassword" name="password" required>
        </div>
        <div>
            <label for="code">Code</label>
            <input type="text" placeholder="Enter code" id="resetPasswordCode" name="code" required>
        </div>
            <button class="auth-submit-btn" style="margin-right: 20px" type="submit">Reset Password</button>
        </form>
    </div>
</div>
