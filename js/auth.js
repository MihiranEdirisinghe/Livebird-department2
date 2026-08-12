const USER_PERMISSIONS = {
    user1: {
        name: "Charith",
        home: "pages/dashboard.html"
    },

    user2: {
        name: "Nilupa",
        home: "pages/user2-dashboard.html"
    },

    user3: {
        name: "Akila",
        home: "pages/user3-dashboard.html"
    },

    user4: {
        name: "Admin",
        home: "pages/admin-analytics-report.html"
    }
};


document.addEventListener("DOMContentLoaded", () => {

    const signInBtn = document.getElementById("signInBtn");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginMessage = document.getElementById("loginMessage");

    signInBtn.addEventListener("click", handleLogin);

    passwordInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            handleLogin();
        }
    });


    async function handleLogin() {

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        loginMessage.textContent = "";

        if (!username || !password) {
            loginMessage.textContent = "Please enter username and password.";
            return;
        }

        signInBtn.disabled = true;
        signInBtn.textContent = "Signing In...";

        try {

            const result = await loginRequest(username, password);

            if (!result.success) {
                loginMessage.textContent =
                    result.message || "Invalid username or password.";
                return;
            }

            const userKey = result.username.toLowerCase();

            const userConfig = USER_PERMISSIONS[userKey];

            if (!userConfig) {
                loginMessage.textContent =
                    "Your account does not have system access.";
                return;
            }

            sessionStorage.setItem(
                "livebirdUser",
                JSON.stringify({
                    username: result.username,
                    name: result.name
                })
            );

            window.location.href = userConfig.home;

        } catch (error) {

            console.error(error);

            loginMessage.textContent =
                "Unable to connect to the server. Please try again.";

        } finally {

            signInBtn.disabled = false;
            signInBtn.textContent = "Sign In";

        }

    }

});