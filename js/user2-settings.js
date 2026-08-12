document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // ELEMENTS
    // =========================================================

    const driverInput =
        document.getElementById("driverInput");

    const helperInput =
        document.getElementById("helperInput");

    const vehicleInput =
        document.getElementById("vehicleInput");


    const saveDriverBtn =
        document.getElementById("saveDriverBtn");

    const saveHelperBtn =
        document.getElementById("saveHelperBtn");

    const saveVehicleBtn =
        document.getElementById("saveVehicleBtn");


    const driverMessage =
        document.getElementById("driverMessage");

    const helperMessage =
        document.getElementById("helperMessage");

    const vehicleMessage =
        document.getElementById("vehicleMessage");


    const loggedUser =
        document.getElementById("loggedUser");

    const logoutBtn =
        document.getElementById("logoutBtn");


    // =========================================================
    // SESSION CHECK
    // =========================================================

    const sessionUser =
        sessionStorage.getItem("livebirdUser");

    if (!sessionUser) {
        window.location.href = "../index.html";
        return;
    }


    const user =
        JSON.parse(sessionUser);


    if (
        !user.username ||
        user.username.toLowerCase() !== "user2"
    ) {

        sessionStorage.removeItem(
            "livebirdUser"
        );

        window.location.href =
            "../index.html";

        return;
    }


    loggedUser.textContent =
        `Logged in as: ${user.name || user.username}`;


    // =========================================================
    // DRIVER
    // =========================================================

    saveDriverBtn.addEventListener(
        "click",
        () => {

            saveMasterItem(
                "Drivers",
                driverInput,
                driverMessage,
                saveDriverBtn,
                "Driver"
            );

        }
    );


    // =========================================================
    // HELPER
    // =========================================================

    saveHelperBtn.addEventListener(
        "click",
        () => {

            saveMasterItem(
                "Helpers",
                helperInput,
                helperMessage,
                saveHelperBtn,
                "Helper"
            );

        }
    );


    // =========================================================
    // VEHICLE
    // =========================================================

    saveVehicleBtn.addEventListener(
        "click",
        () => {

            saveMasterItem(
                "Vehicles",
                vehicleInput,
                vehicleMessage,
                saveVehicleBtn,
                "Vehicle"
            );

        }
    );


    // =========================================================
    // GENERIC SAVE FUNCTION
    // =========================================================

    async function saveMasterItem(
        type,
        input,
        messageElement,
        button,
        label
    ) {

        clearMessage(messageElement);


        const value =
            input.value.trim();


        if (!value) {

            showMessage(
                messageElement,
                `Please enter a ${label.toLowerCase()}.`,
                "error"
            );

            return;
        }


        button.disabled = true;

        button.textContent =
            "Saving...";


        try {

            const result =
                await addUser2MasterItem(
                    type,
                    value
                );


            if (result.success) {

                showMessage(
                    messageElement,
                    result.message ||
                    `${label} added successfully.`,
                    "success"
                );

                input.value = "";

            } else {

                showMessage(
                    messageElement,
                    result.message ||
                    `Unable to add ${label.toLowerCase()}.`,
                    "error"
                );

            }


        } catch (error) {

            console.error(error);

            showMessage(
                messageElement,
                "Unable to connect to the server.",
                "error"
            );


        } finally {

            button.disabled = false;

            button.textContent =
                `Save ${label}`;

        }

    }


    // =========================================================
    // ENTER KEY SUPPORT
    // =========================================================

    driverInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                saveDriverBtn.click();
            }

        }
    );


    helperInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                saveHelperBtn.click();
            }

        }
    );


    vehicleInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                saveVehicleBtn.click();
            }

        }
    );


    // =========================================================
    // MESSAGE HELPERS
    // =========================================================

    function showMessage(
        element,
        message,
        type
    ) {

        element.textContent =
            message;

        element.classList.remove(
            "success",
            "error"
        );

        element.classList.add(type);

    }


    function clearMessage(element) {

        element.textContent = "";

        element.classList.remove(
            "success",
            "error"
        );

    }


    // =========================================================
    // LOGOUT
    // =========================================================

    logoutBtn.addEventListener(
        "click",
        () => {

            sessionStorage.removeItem(
                "livebirdUser"
            );

            window.location.href =
                "../index.html";

        }
    );

});