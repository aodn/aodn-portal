<div id="userProfileEdit" class="modal">
    <div class="modal-content">
        <div class="x-tool x-tool-close" onClick="window.auth.closeModals()"></div>
        <h2>Edit User Profile</h2>
        <div id="userEditError" class="modal-message modal-error" ></div>
        <form id="userEditForm" class="modal-form" autocomplete="off" onSubmit="window.auth.userEditFormSubmit(event, this)">
            <div>
                <label for="userEditEmail">Email</label>
                <input autocomplete="off" type="email" invalid placeholder="Enter Email" id="userEditEmail" name="email" readonly>
            </div>
            <div>
                <label for="userEditFirstName">First Name (Required)</label>
                <input type="text" placeholder="First Name" id="userEditFirstName" name="firstName" required>
            </div>
            <div>
                <label for="userEditLastName">Last Name (Required)</label>
                <input type="text" placeholder="Last Name" id="userEditLastName" name="lastName" required>
            </div>
            <div>
                <label for="userEditCountry">Country (Required)</label>
                <select name="Country" id="userEditCountry">
                   <g:render template="/auth/countryOptions"/> 
                </select>
            </div>
            <div>
                <label for="userEditIndustry">Institutional Type (Required)</label>
                <select name="Industry" id="userEditIndustry">
                    <g:render template="/auth/industryOptions"/>
                </select>
            </div>
            <div style="display: block">
                <input type="checkbox" checked id="userEditContact" name="contact">I agree to be contacted for the purposes of providing feedback about user experience, <a target="_blank" href="https://imos.org.au/user-registration">see more information here.</a></input>
            </div>
            <div style="display: block; margin-top: 20px">
                <button class="auth-submit-btn" type="submit" id="userProfileSaveButton" >Update Profile</button>
            </div>
        </form>
    </div>
</div>
