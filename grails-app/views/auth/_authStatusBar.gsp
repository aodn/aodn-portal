<div>
    <div id="authSignedIn" style="float:right; height: 36px; display:none;">
        <div class="viewPortTabActive login-user-profile-link" id="loginUserProfileLink" onclick="window.auth.userProfileButtonHandler()"></div>
    </div>
    <div id="authSignedOut" style="float:right; width: 150px; height: 36px; display:none;">
        <div class="viewPortTabActive login-button" id="loginSignUpButton" onClick="window.auth.signUpButtonHandler()">Sign Up</div>
        <div class="viewPortTabActive login-button" id="loginSignInButton" onClick="window.auth.signInButtonHandler()">Sign In</div>
    </div>
        <div id="authIsGuest" style="float:right; width: 110px; height: 36px; display:none; text-align:right; line-height: 36px; margin-right: 10px">
        <h2 style="color:#CFD4D7">Guest</h2>
    </div>
    <script>window.auth.refreshHeader()</script>
</div>
