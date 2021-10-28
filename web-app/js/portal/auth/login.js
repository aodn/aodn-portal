(function () {
    window.showLogin = () => {
        if (!getCookie('isAuthenticated') && !getCookie('skipLogin')) {
            let modal = document.getElementById("loginModal"),
                login = document.getElementById("loginButton"),
                guest = document.getElementById("guestButton");
            modal.style.display = "block";
            guest.onclick = function() {
                setCookie('skipLogin', true, 7);
                updateUserSlug()
                modal.style.display = "none";
            }
            login.onclick = function() {
                const form  = document.getElementById('loginForm'),
                    formData = {
                        username: form.elements['username'].value,
                        password: form.elements['password'].value
                    };
                signIn(formData.username, formData.password);
                modal.style.display = "none";
            }
        }
    };
})();

