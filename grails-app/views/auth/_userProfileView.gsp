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
            <label for="userViewIndustry">Industry</label>
            <input type="text" name="Industry" id="userViewIndustry" readonly>
        </div>
        <div>
            <label for="userViewContact">OK to contact</label>
            <input type="checkbox" name="Contact" id="userViewContact" disabled>
        </div>
        </form>
        <button class="auth-submit-btn" style="width: 150px" id="userEditProfileButton" onClick="window.auth.editProfileButtonHandler()">Edit Profile</button>
        <button class="auth-submit-btn" style="width: 150px" id="userChangePasswordButton" onClick="window.auth.changePasswordButtonHandler()">Change Password</button>
        <button class="auth-submit-btn" style="width: 20%; float:right;" onClick="window.auth.signOutButtonHandler()">Sign Out</button>
    </div>
</div>
