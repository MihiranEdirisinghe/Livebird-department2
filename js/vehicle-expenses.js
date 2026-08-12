document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // ELEMENTS
    // =========================================================

    const vehicleExpenseForm =
        document.getElementById("vehicleExpenseForm");

    const expenseDate =
        document.getElementById("expenseDate");

    const vehicleNo =
        document.getElementById("vehicleNo");

    const teaExpense =
        document.getElementById("teaExpense");

    const mealExpense =
        document.getElementById("mealExpense");

    const totalExpense =
        document.getElementById("totalExpense");

    const saveBtn =
        document.getElementById("saveBtn");

    const saveMessage =
        document.getElementById("saveMessage");

    const previewModal =
        document.getElementById("previewModal");

    const previewContent =
        document.getElementById("previewContent");

    const cancelPreviewBtn =
        document.getElementById("cancelPreviewBtn");

    const confirmSaveBtn =
        document.getElementById("confirmSaveBtn");

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
        sessionStorage.removeItem("livebirdUser");
        window.location.href = "../index.html";
        return;
    }


    loggedUser.textContent =
        `Logged in as: ${user.name || user.username}`;


    // =========================================================
    // DEFAULT DATE
    // =========================================================

    setTodayDate();


    // =========================================================
    // LOAD VEHICLES
    // =========================================================

    loadVehicleList();


    async function loadVehicleList() {

        try {

            const result =
                await getVehicleExpenseLists();

            if (!result.success) {

                showMessage(
                    result.message ||
                    "Unable to load vehicle list.",
                    "error"
                );

                return;
            }


            populateSelect(
                vehicleNo,
                result.vehicles || [],
                "Select Vehicle"
            );


        } catch (error) {

            console.error(error);

            showMessage(
                "Unable to load vehicle data.",
                "error"
            );

        }

    }


    // =========================================================
    // POPULATE SELECT
    // =========================================================

    function populateSelect(
        element,
        values,
        placeholder
    ) {

        element.innerHTML =
            `<option value="">${placeholder}</option>`;


        values.forEach(value => {

            const cleanValue =
                String(value || "").trim();

            if (!cleanValue) {
                return;
            }

            const option =
                document.createElement("option");

            option.value = cleanValue;
            option.textContent = cleanValue;

            element.appendChild(option);

        });

    }


    // =========================================================
    // TOTAL CALCULATION
    // =========================================================

    teaExpense.addEventListener(
        "input",
        calculateExpenseTotal
    );

    mealExpense.addEventListener(
        "input",
        calculateExpenseTotal
    );


    function calculateExpenseTotal() {

        const tea =
            parseFloat(
                teaExpense.value
            ) || 0;

        const meal =
            parseFloat(
                mealExpense.value
            ) || 0;


        totalExpense.value =
            (tea + meal).toFixed(2);

    }


    // =========================================================
    // FORM SUBMIT -> PREVIEW
    // =========================================================

    vehicleExpenseForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            clearMessage();


            if (!vehicleNo.value) {

                showMessage(
                    "Please select a Vehicle.",
                    "error"
                );

                return;
            }


            showPreview();

        }
    );


    // =========================================================
    // BUILD RECORD
    // =========================================================

    function buildRecord() {

        return {

            date:
                expenseDate.value || "",

            vehicle:
                vehicleNo.value || "",

            tea:
                teaExpense.value || "0.00",

            meal:
                mealExpense.value || "0.00",

            total:
                totalExpense.value || "0.00",

            addedBy:
                user.name || user.username

        };

    }


    // =========================================================
    // PREVIEW
    // =========================================================

    function showPreview() {

        const record =
            buildRecord();


        const rows = [

            ["Date", record.date || "-"],

            ["Vehicle No", record.vehicle || "-"],

            ["Tea Expenses", record.tea || "0.00"],

            ["Meal Expenses", record.meal || "0.00"],

            ["Total", record.total || "0.00"]

        ];


        previewContent.innerHTML = "";


        rows.forEach(([label, value]) => {

            const row =
                document.createElement("div");

            row.style.display = "flex";
            row.style.justifyContent = "space-between";
            row.style.alignItems = "center";
            row.style.gap = "20px";
            row.style.padding = "10px 0";
            row.style.borderBottom =
                "1px solid #eef2f7";


            const labelElement =
                document.createElement("span");

            labelElement.textContent =
                label;

            labelElement.style.color =
                "#64748b";

            labelElement.style.fontSize =
                "14px";


            const valueElement =
                document.createElement("strong");

            valueElement.textContent =
                value;

            valueElement.style.color =
                "#1e293b";

            valueElement.style.fontSize =
                "14px";


            row.appendChild(labelElement);
            row.appendChild(valueElement);

            previewContent.appendChild(row);

        });


        previewModal.classList.add("show");

    }


    // =========================================================
    // CLOSE PREVIEW
    // =========================================================

    cancelPreviewBtn.addEventListener(
        "click",
        () => {

            previewModal.classList.remove(
                "show"
            );

        }
    );


    previewModal.addEventListener(
        "click",
        event => {

            if (event.target === previewModal) {

                previewModal.classList.remove(
                    "show"
                );
            }

        }
    );


    // =========================================================
    // CONFIRM SAVE
    // =========================================================

    confirmSaveBtn.addEventListener(
        "click",
        async () => {

            const record =
                buildRecord();


            confirmSaveBtn.disabled =
                true;

            confirmSaveBtn.textContent =
                "Saving...";


            try {

                const result =
                    await saveVehicleExpense(
                        record
                    );


                if (result.success) {

                    previewModal.classList.remove(
                        "show"
                    );


                    showMessage(
                        "Vehicle Expense Record Saved Successfully! 🎉",
                        "success"
                    );


                    resetForm();

                } else {

                    showMessage(
                        result.message ||
                        "Unable to save vehicle expense.",
                        "error"
                    );

                }


            } catch (error) {

                console.error(error);

                showMessage(
                    "Unable to connect to the server.",
                    "error"
                );


            } finally {

                confirmSaveBtn.disabled =
                    false;

                confirmSaveBtn.textContent =
                    "Confirm & Save";

            }

        }
    );


    // =========================================================
    // RESET
    // =========================================================

    function resetForm() {

        setTodayDate();

        vehicleNo.value = "";

        teaExpense.value = "";

        mealExpense.value = "";

        totalExpense.value =
            "0.00";

    }


    // =========================================================
    // DATE
    // =========================================================

    function setTodayDate() {

        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                today.getDate()
            ).padStart(2, "0");


        expenseDate.value =
            `${year}-${month}-${day}`;

    }


    // =========================================================
    // MESSAGE
    // =========================================================

    function showMessage(
        message,
        type
    ) {

        saveMessage.textContent =
            message;

        saveMessage.classList.remove(
            "success",
            "error"
        );

        saveMessage.classList.add(type);

    }


    function clearMessage() {

        saveMessage.textContent = "";

        saveMessage.classList.remove(
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