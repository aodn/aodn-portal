<div id="requestPasswordResetCodeModal" class="modal">
    <div class="modal-content">
        <div class="x-tool x-tool-close" onClick="window.auth.closeModals()"></div>
        <h2>Request Password Reset Code</h2>
        <p>A single-use code will be sent to your email address</p>
        <div id="requestPasswordResetCodeError" class="modal-message modal-error"></div>
        <form id="requestPasswordResetCodeForm" class="modal-form" onSubmit="window.auth.requestPasswordResetCodeFormSubmit(event)">
        <div>
            <label for="email">Email</label>
            <input type="email" autocomplete="username" placeholder="Enter Email" id="requestPasswordResetCodeEmail" name="email" required>
        </div>
            <button class="auth-submit-btn" style="margin-right: 20px" type="submit">Request Code</button>
        </form>
    </div>
</div>
