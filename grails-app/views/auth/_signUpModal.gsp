<div id="signUpModal" class="modal">
    <div class="modal-content">
        <div class="x-tool x-tool-close" onClick="window.auth.closeModals()"></div>
        <h2>Register</h2>
        <div id="signUpError" class="modal-message modal-error" ></div>
        <form id="signUpForm" class="modal-form" autocomplete="off" onSubmit="window.auth.signUpFormSubmit(event, this)">
            <div>
                <label for="signUpEmail">Email (Required)</label>
                <input autocomplete="off" type="email" invalid placeholder="Enter Email" id="signUpEmail" name="email" required>
            </div>
            <div>
                <label for="signUpPassword">Password (Required)</label><div style="float:right"><small>(At least 8 characters)</small></div>
                <input autocomplete="off" type="password" title="ERROR" placeholder="Enter Password" id="signUpPassword" name="password" pattern="^[\S]+.*[\S]+$" minlength="8" maxlength="20" required>
            </div>
            <div>
                <label for="signUpPasswordConfirm">Confirm Password</label>
                <input autocomplete="off" type="password" placeholder="Enter Password" id="signUpPasswordConfirm" name="passwordConfirm" pattern="^[\S]+.*[\S]+$" minlength="8" maxlength="20" required>
            </div>
            <div>
                <label for="signUpFirstName">First Name (Required)</label>
                <input type="text" placeholder="First Name" id="signUpFirstName" name="firstName" required>
            </div>
            <div>
                <label for="signUpLastName">Last Name (Required)</label>
                <input type="text" placeholder="Last Name" id="signUpLastName" name="lastName" required>
            </div>
            <div>
                <label for="signUpCountry">Country (Required)</label>
                <select name="Country" id="signUpCountry">
                    <g:render template="/auth/countryOptions"/>
                </select>
            </div>
            <div>
                <label for="signUpIndustry">Institutional Type (Required)</label>
                <select name="Industry" id="signUpIndustry">
                    <g:render template="/auth/industryOptions"/>
                </select>
            </div>
            <input type="checkbox" checked id="signUpAgree" name="agree" onclick="document.getElementById('signUpButton').disabled = !event.target.checked">I Agree to the <a target="_blank" href="https://imos.org.au/imostermsofuse0">IMOS Terms & Privacy Conditions</a> and the <a target="_blank" href="https://imos.org.au/acknowledging-us">Data Use Acknowledgement</a></input><br>
            <input type="checkbox" checked id="signUpContact" name="contact">I agree to be contacted for the purposes of providing feedback about user experience, <a target="_blank" href="https://imos.org.au/user-registration">see more information here.</a></input>
            <div style="margin-top: 15px"><button id="signUpButton" class="auth-submit-btn" type="submit">Register</button></div>
        </form>
    </div>
</div>
