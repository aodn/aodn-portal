<div id="changePassword" class="modal">
    <div class="modal-content">
        <div class="x-tool x-tool-close" onClick="window.auth.closeModals()"></div>
        <h2>Change Password</h2>
        <div id="changePasswordError" class="modal-message modal-error" ></div>
        <form id="changePasswordForm" class="modal-form" autocomplete="off" onSubmit="window.auth.changePasswordFormSubmit(event, this)">
            <div>
                <label for="signUpPassword">Current Password (Required)</label>
                <input autocomplete="off" type="password" title="ERROR" placeholder="Current Password" id="changePasswordCurrent" name="changePasswordCurrent" pattern="^[\S]+.*[\S]+$" minlength="8" maxlength="20" required>
            </div>
            <div>
                <label for="signUpPassword">New Password (Required)</label><div style="float:right"><small>(At least 8 characters)</small></small></div>
                <input autocomplete="off" type="password" title="ERROR" placeholder="Enter Password" id="changePasswordNew" name="changePasswordNew" pattern="^[\S]+.*[\S]+$" minlength="8" maxlength="20" required>
            </div>
            <div>
                <label for="signUpPasswordConfirm">Confirm New Password</label>
                <input autocomplete="off" type="password" placeholder="Enter Password" id="changePasswordNewConfirm" name="changePasswordNewConfirm" pattern="^[\S]+.*[\S]+$" minlength="8" maxlength="20" required>
            </div>
            <button class="auth-submit-btn" type="submit" id="changePasswordSaveButton" >Change Password</button>
            </form>
    </div>
</div>
