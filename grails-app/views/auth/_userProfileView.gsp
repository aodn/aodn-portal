<div id="userProfileView" class="modal">
    <div class="modal-content">
        <div class="x-tool x-tool-close" onClick="window.auth.closeModals()"></div>
        <h2>User Profile</h2>
        <div id="userProfileMessage" class="modal-message" ></div>
        <form class="modal-form">
        <div>
            <label for="userViewEmail">Email</label>
            <input type="email" id="userViewEmail" name="email" readonly>
        </div>
        <div>
            <label for="userViewFirstName">First Name</label>
            <input type="text" id="userViewFirstName" name="firstName" readonly>
        </div>
        <div>
            <label for="userViewLastName">Last Name</label>
            <input type="text" id="userViewLastName" name="lastName" readonly>
        </div>
        <div>
            <label for="userViewCountry">Country</label>
            <input type="text" id="userViewCountry" name="Country" readonly>
        </div>
        <div>
            <label for="userViewIndustry">Institutional Type</label>
            <input type="text" name="Industry" id="userViewIndustry" readonly>
        </div>
        <div style="display: block">
            <input type="checkbox" name="Contact" id="userViewContact" disabled>I agree to be contacted for the purposes of providing feedback about user experience, <a target="_blank" href="https://imos.org.au/user-registration">see more information here.</a></input>
        </div>
        </form>
        <button class="auth-submit-btn" id="userEditProfileButton" onClick="window.auth.editProfileButtonHandler()">Edit Profile</button>
        <button class="auth-submit-btn" id="userChangePasswordButton" onClick="window.auth.changePasswordButtonHandler()">Change Password</button>
        <button class="auth-submit-btn" onClick="window.auth.confirmSignOutButtonHandler()">Sign Out</button>
        <button class="auth-submit-btn" onClick="window.auth.confirmDeleteAccountButtonHandler()">Delete Account</button>
    </div>
</div>
