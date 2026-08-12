document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // ELEMENTS
    // =========================================================

    const farmerType =
        document.getElementById("farmerType");

    const farmerName =
        document.getElementById("farmerName");

    const saveFarmerBtn =
        document.getElementById("saveFarmerBtn");

    const farmerMessage =
        document.getElementById("farmerMessage");


    const customerName =
        document.getElementById("customerName");

    const saveCustomerBtn =
        document.getElementById("saveCustomerBtn");

    const customerMessage =
        document.getElementById("customerMessage");


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

    const user = JSON.parse(sessionUser);

    if (
        !user.username ||
        user.username.toLowerCase() !== "user1"
    ) {
        sessionStorage.removeItem("livebirdUser");
        window.location.href = "../index.html";
        return;
    }


    loggedUser.textContent =
        `Logged in as: ${user.name || user.username}`;


    // =========================================================
    // SAVE FARMER
    // =========================================================

    saveFarmerBtn.addEventListener(
        "click",
        async () => {

            clearMessage(farmerMessage);

            const type =
                farmerType.value;

            const name =
                farmerName.value.trim();


            if (!name) {

                showMessage(
                    farmerMessage,
                    "Please enter a farmer name.",
                    "error"
                );

                return;
            }


            saveFarmerBtn.disabled = true;

            saveFarmerBtn.textContent =
                "Saving...";


            try {

                const result =
                    await addFarmer(
                        type,
                        name
                    );


                if (result.success) {

                    showMessage(
                        farmerMessage,
                        result.message ||
                        "Farmer added successfully.",
                        "success"
                    );

                    farmerName.value = "";

                } else {

                    showMessage(
                        farmerMessage,
                        result.message ||
                        "Unable to add farmer.",
                        "error"
                    );

                }

            } catch (error) {

                console.error(error);

                showMessage(
                    farmerMessage,
                    "Unable to connect to the server.",
                    "error"
                );

            } finally {

                saveFarmerBtn.disabled = false;

                saveFarmerBtn.textContent =
                    "Save Farmer";
            }

        }
    );


    // =========================================================
    // SAVE CUSTOMER
    // =========================================================

    saveCustomerBtn.addEventListener(
        "click",
        async () => {

            clearMessage(customerMessage);

            const name =
                customerName.value.trim();


            if (!name) {

                showMessage(
                    customerMessage,
                    "Please enter a customer name.",
                    "error"
                );

                return;
            }


            saveCustomerBtn.disabled = true;

            saveCustomerBtn.textContent =
                "Saving...";


            try {

                const result =
                    await addCustomer(name);


                if (result.success) {

                    showMessage(
                        customerMessage,
                        result.message ||
                        "Customer added successfully.",
                        "success"
                    );

                    customerName.value = "";

                } else {

                    showMessage(
                        customerMessage,
                        result.message ||
                        "Unable to add customer.",
                        "error"
                    );

                }

            } catch (error) {

                console.error(error);

                showMessage(
                    customerMessage,
                    "Unable to connect to the server.",
                    "error"
                );

            } finally {

                saveCustomerBtn.disabled = false;

                saveCustomerBtn.textContent =
                    "Save Customer";
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

        element.textContent = message;

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