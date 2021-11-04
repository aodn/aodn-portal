<div id="signUpModal" class="modal">
    <div class="modal-content">
        <div class="x-tool x-tool-close" onClick="window.auth.closeModals()"></div>
        <h2>Sign Up</h2>
        <div id="signUpError" style="font-weight: bolder; text-align:center; color: darkred"></div>
        <form id="signUpForm" class="modal-form" autocomplete="off" onSubmit="window.auth.signUpFormSubmit(event, this)">
            <div>
                <label for="email">Email (Required)</label>
                <input autocomplete="off" type="email" invalid placeholder="Enter Email" id="signUpEmail" name="email" required>
            </div>
%{--            <div>--}%
%{--                <label for="password">Password (Required)</label><div style="float:right"><small>(8-15 characters, containing lower case, upper case, symbol and number)</small></div>--}%
%{--                <input autocomplete="off" type="password" title="ERROR" placeholder="Enter Password" id="signUpPassword" name="password" pattern="^[\S]+.*[\S]+$" minlength="8" maxlength="15" required>--}%
%{--            </div>--}%
%{--            <div>--}%
%{--                <label for="passwordConfirm">Confirm Password</label>--}%
%{--                <input autocomplete="off" type="password" placeholder="Enter Password" id="signUpPasswordConfirm" name="passwordConfirm" pattern="^[\S]+.*[\S]+$" minlength="8" maxlength="15" required>--}%
%{--            </div>--}%
            <hr>
            <div>
                <label for="firstName">First Name</label>
                <input type="text" placeholder="First Name" id="signUpFirstName" name="firstName">
            </div>
            <div>
                <label for="lastName">Last Name</label>
                <input type="text" placeholder="Last Name" id="signUpLastName" name="lastName">
            </div>
            <div>
                <label for="phoneNumber">Phone Number</label>
                <input type="text" placeholder="Phone Number" id="signUpPhoneNumber" name="phoneNumber">
            </div>
            <div>
                <label for="locale">Locale</label>
                <input type="text" placeholder="Locale" id="signUpLocale" name="locale">
            </div>
            <div>
                <label for="industry">Industry</label>
                <input type="text" placeholder="Industry" id="signUpIndustry" name="industry">
            </div>
            <button id="signUpButton" class="auth-submit-btn" type="submit">Sign Up</button>
        </form>
    </div>
</div>
