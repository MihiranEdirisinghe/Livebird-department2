document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // ELEMENTS
    // =========================================================

    const tripDate =
        document.getElementById("tripDate");

    const vehicleNumber =
        document.getElementById("vehicleNumber");

    const driverName =
        document.getElementById("driverName");

    const doa =
        document.getElementById("doa");

    const helper1 =
        document.getElementById("helper1");

    const helper2 =
        document.getElementById("helper2");

    const helper3 =
        document.getElementById("helper3");

    const outTime =
        document.getElementById("outTime");

    const outAmPm =
        document.getElementById("outAmPm");

    const inTime =
        document.getElementById("inTime");

    const inAmPm =
        document.getElementById("inAmPm");

    const totalTripTime =
        document.getElementById("totalTripTime");

    const batchContainer =
        document.getElementById("batchContainer");

    const addBatchBtn =
        document.getElementById("addBatchBtn");

    const saveAllBtn =
        document.getElementById("saveAllBtn");

    const saveMessage =
        document.getElementById("saveMessage");

    const previewModal =
        document.getElementById("previewModal");

    const previewContent =
        document.getElementById("previewContent");

    const cancelPreviewBtn =
        document.getElementById("cancelPreviewBtn");

    const closePreviewBtn =
        document.getElementById("closePreviewBtn");

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
    // STATE
    // =========================================================

    let batchCounter = 0;


    // =========================================================
    // INITIAL SETUP
    // =========================================================

    setTodayDate();

    loadUser2Lists();

    addBatchRow();


    // =========================================================
    // LOAD LISTS
    // =========================================================

    async function loadUser2Lists() {

        try {

            const result =
                await getUser2DashboardLists();

            if (!result.success) {
                showMessage(
                    result.message ||
                    "Unable to load vehicle data.",
                    "error"
                );

                return;
            }


            populateSelect(
                vehicleNumber,
                result.vehicles || [],
                "Select Vehicle"
            );

            populateSelect(
                driverName,
                result.drivers || [],
                "Select Driver"
            );

            populateSelect(
                helper1,
                result.helpers || [],
                "Helper 1"
            );

            populateSelect(
                helper2,
                result.helpers || [],
                "Helper 2"
            );

            populateSelect(
                helper3,
                result.helpers || [],
                "Helper 3"
            );


        } catch (error) {

            console.error(error);

            showMessage(
                "Unable to load vehicle/driver/helper data.",
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
    // TRIP TIME CALCULATION
    // =========================================================

    outTime.addEventListener(
        "input",
        calculateTripTime
    );

    outAmPm.addEventListener(
        "change",
        calculateTripTime
    );

    inTime.addEventListener(
        "input",
        calculateTripTime
    );

    inAmPm.addEventListener(
        "change",
        calculateTripTime
    );


    function calculateTripTime() {

        const out =
            parseTime(
                outTime.value,
                outAmPm.value
            );

        const incoming =
            parseTime(
                inTime.value,
                inAmPm.value
            );

        if (!out || !incoming) {

            totalTripTime.value =
                "00:00:00";

            return;
        }


        let diff =
            incoming - out;

        if (diff < 0) {
            diff += 24 * 60 * 60 * 1000;
        }


        const totalSeconds =
            Math.floor(diff / 1000);

        const hours =
            Math.floor(
                totalSeconds / 3600
            );

        const minutes =
            Math.floor(
                (totalSeconds % 3600) / 60
            );

        const seconds =
            totalSeconds % 60;


        totalTripTime.value =
            `${String(hours).padStart(2, "0")}:` +
            `${String(minutes).padStart(2, "0")}:` +
            `${String(seconds).padStart(2, "0")}`;

    }


    function parseTime(
        value,
        ampm
    ) {

        const clean =
            String(value || "").trim();

        const match =
            clean.match(
                /^(\d{1,2}):(\d{2})$/
            );

        if (!match) {
            return null;
        }


        let hour =
            Number(match[1]);

        const minute =
            Number(match[2]);


        if (
            hour < 1 ||
            hour > 12 ||
            minute < 0 ||
            minute > 59
        ) {
            return null;
        }


        if (
            ampm === "AM" &&
            hour === 12
        ) {
            hour = 0;
        }

        if (
            ampm === "PM" &&
            hour !== 12
        ) {
            hour += 12;
        }


        const date =
            new Date();

        date.setHours(
            hour,
            minute,
            0,
            0
        );

        return date;

    }


    // =========================================================
    // ADD BATCH
    // =========================================================

    addBatchBtn.addEventListener(
        "click",
        addBatchRow
    );


    function addBatchRow() {

        batchCounter++;

        const batchId =
            `batch-${batchCounter}`;


        const card =
            document.createElement("div");

        card.className =
            "batch-card";

        card.dataset.batchId =
            batchId;


        card.innerHTML = `

            <div class="batch-card-header">

                <h3 class="batch-card-title">
                    Batch Details
                </h3>

                <button
                    type="button"
                    class="delete-batch-btn"
                >
                    Delete Batch
                </button>

            </div>


            <div class="batch-grid">

                <div class="form-group">
                    <label>Farmer Batch No</label>

                    <input
                        type="text"
                        class="batch-no"
                        placeholder="e.g., 1616"
                    >
                </div>


                <div class="form-group">
                    <label>Location</label>

                    <input
                        type="text"
                        class="batch-location"
                        placeholder="e.g., Epaladeniya 01"
                    >
                </div>


                <div class="form-group">
                    <label>Age (Days)</label>

                    <input
                        type="number"
                        class="batch-age"
                        placeholder="35"
                        min="0"
                    >
                </div>


                <div class="form-group">
                    <label>Exp Avg Weight (KG)</label>

                    <input
                        type="number"
                        class="batch-expected-avg"
                        placeholder="2.00"
                        step="0.001"
                        min="0"
                    >
                </div>


                <div class="form-group">
                    <label>Order Birds</label>

                    <input
                        type="number"
                        class="batch-order-birds"
                        placeholder="0"
                        min="0"
                    >
                </div>


                <div class="form-group">
                    <label>Available Birds</label>

                    <input
                        type="number"
                        class="batch-available-birds"
                        placeholder="0"
                        min="0"
                    >
                </div>


                <div class="form-group">
                    <label>Weight (KG)</label>

                    <input
                        type="number"
                        class="batch-weight"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                    >
                </div>


                <div class="form-group">
                    <label>Avg Weight (KG)</label>

                    <input
                        type="text"
                        class="batch-avg-weight readonly-field"
                        value="0.000"
                        readonly
                    >
                </div>


                <div class="form-group">
                    <label>Weight Diff (KG)</label>

                    <input
                        type="number"
                        class="batch-weight-diff"
                        placeholder="0.00"
                        step="0.01"
                    >
                </div>

            </div>
        `;


        batchContainer.appendChild(
            card
        );


        const deleteBtn =
            card.querySelector(
                ".delete-batch-btn"
            );


        deleteBtn.addEventListener(
            "click",
            () => {

                card.remove();

            }
        );


        const availableInput =
            card.querySelector(
                ".batch-available-birds"
            );

        const weightInput =
            card.querySelector(
                ".batch-weight"
            );

        const avgInput =
            card.querySelector(
                ".batch-avg-weight"
            );


        const calcAverage = () => {

            const available =
                parseFloat(
                    availableInput.value
                ) || 0;

            const weight =
                parseFloat(
                    weightInput.value
                ) || 0;


            if (available > 0) {

                avgInput.value =
                    (weight / available)
                        .toFixed(3);

            } else {

                avgInput.value =
                    "0.000";
            }

        };


        availableInput.addEventListener(
            "input",
            calcAverage
        );

        weightInput.addEventListener(
            "input",
            calcAverage
        );

    }


    // =========================================================
    // GET BATCH DATA
    // =========================================================

    function getBatchData() {

        const cards =
            document.querySelectorAll(
                ".batch-card"
            );


        return Array.from(cards)
            .map(card => {

                return {

                    batchNo:
                        card.querySelector(
                            ".batch-no"
                        ).value.trim(),

                    location:
                        card.querySelector(
                            ".batch-location"
                        ).value.trim(),

                    age:
                        card.querySelector(
                            ".batch-age"
                        ).value || "0",

                    expectedAvg:
                        card.querySelector(
                            ".batch-expected-avg"
                        ).value || "0",

                    orderBirds:
                        card.querySelector(
                            ".batch-order-birds"
                        ).value || "0",

                    availableBirds:
                        card.querySelector(
                            ".batch-available-birds"
                        ).value || "0",

                    avgWeight:
                        card.querySelector(
                            ".batch-avg-weight"
                        ).value || "0.000",

                    weight:
                        card.querySelector(
                            ".batch-weight"
                        ).value || "0.00",

                    weightDiff:
                        card.querySelector(
                            ".batch-weight-diff"
                        ).value || "0.00"

                };

            });

    }


    // =========================================================
    // SAVE BUTTON -> PREVIEW
    // =========================================================

    saveAllBtn.addEventListener(
        "click",
        () => {

            clearMessage();


            const batches =
                getBatchData();


            if (batches.length === 0) {

                showMessage(
                    "Please add at least one batch.",
                    "error"
                );

                return;
            }


            showPreview(batches);

        }
    );


    // =========================================================
    // PREVIEW
    // =========================================================

    function showPreview(batches) {

        const helpers =
            [
                helper1.value,
                helper2.value,
                helper3.value
            ]
            .filter(Boolean)
            .join(", ") || "-";


        previewContent.innerHTML = `

            <div class="preview-trip-card">

                <p>
                    <strong>Date:</strong>
                    ${escapeHtml(tripDate.value || "-")}
                </p>

                <p>
                    <strong>Vehicle:</strong>
                    ${escapeHtml(vehicleNumber.value || "-")}
                </p>

                <p>
                    <strong>Driver:</strong>
                    ${escapeHtml(driverName.value || "-")}
                </p>

                <p>
                    <strong>Helpers:</strong>
                    ${escapeHtml(helpers)}
                </p>

                <p>
                    <strong>DOA:</strong>
                    ${escapeHtml(doa.value || "0")}
                </p>

                <p>
                    <strong>Out Time:</strong>
                    ${escapeHtml(
                        outTime.value
                            ? `${outTime.value} ${outAmPm.value}`
                            : "-"
                    )}
                </p>

                <p>
                    <strong>In Time:</strong>
                    ${escapeHtml(
                        inTime.value
                            ? `${inTime.value} ${inAmPm.value}`
                            : "-"
                    )}
                </p>

                <p>
                    <strong>Total Trip Time:</strong>
                    ${escapeHtml(totalTripTime.value)}
                </p>

            </div>

            <p>
                <strong>
                    Total Batches to Save:
                    ${batches.length}
                </strong>
            </p>

        `;


        batches.forEach(
            (batch, index) => {

                const card =
                    document.createElement("div");

                card.className =
                    "preview-batch-card";


                card.innerHTML = `

                    <h3>
                        Batch #${index + 1}
                        -
                        ${escapeHtml(batch.batchNo || "-")}
                        (${escapeHtml(batch.location || "-")})
                    </h3>

                    <div class="preview-batch-grid">

                        <div>
                            Birds:
                            <strong>
                                ${escapeHtml(batch.availableBirds)}
                            </strong>
                        </div>

                        <div>
                            Weight:
                            <strong>
                                ${escapeHtml(batch.weight)}
                            </strong>
                            kg
                        </div>

                        <div>
                            Avg Weight:
                            <strong>
                                ${escapeHtml(batch.avgWeight)}
                            </strong>
                            kg
                        </div>

                    </div>
                `;


                previewContent.appendChild(
                    card
                );

            }
        );


        previewModal.classList.add(
            "show"
        );

    }


    // =========================================================
    // CLOSE PREVIEW
    // =========================================================

    cancelPreviewBtn.addEventListener(
        "click",
        closePreview
    );

    closePreviewBtn.addEventListener(
        "click",
        closePreview
    );


    previewModal.addEventListener(
        "click",
        event => {

            if (
                event.target === previewModal
            ) {
                closePreview();
            }

        }
    );


    function closePreview() {

        previewModal.classList.remove(
            "show"
        );

    }


    // =========================================================
    // CONFIRM SAVE
    // =========================================================

    confirmSaveBtn.addEventListener(
        "click",
        async () => {

            const batches =
                getBatchData();


            const helpers =
                [
                    helper1.value,
                    helper2.value,
                    helper3.value
                ]
                .filter(Boolean)
                .join(", ") || "-";


            const payload = {

                date:
                    tripDate.value,

                vehicle:
                    vehicleNumber.value || "-",

                driver:
                    driverName.value || "-",

                helpers:
                    helpers,

                doa:
                    doa.value || "0",

                outTime:
                    outTime.value
                        ? `${outTime.value} ${outAmPm.value}`
                        : "-",

                inTime:
                    inTime.value
                        ? `${inTime.value} ${inAmPm.value}`
                        : "-",

                totalTripTime:
                    totalTripTime.value || "00:00:00",

                addedBy:
                    user.name || user.username,

                batches:
                    batches

            };


            confirmSaveBtn.disabled =
                true;

            confirmSaveBtn.textContent =
                "Saving...";


            try {

                const result =
                    await saveUser2DailyEntry(
                        payload
                    );


                if (result.success) {

                    closePreview();

                    showMessage(
                        "Trip Saved Successfully! 🚀",
                        "success"
                    );


                    resetForm();

                } else {

                    showMessage(
                        result.message ||
                        "Unable to save trip.",
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
                    "Confirm & Save All";

            }

        }
    );


    // =========================================================
    // RESET FORM
    // =========================================================

    function resetForm() {

        setTodayDate();

        vehicleNumber.value = "";
        driverName.value = "";

        doa.value = "";

        helper1.value = "";
        helper2.value = "";
        helper3.value = "";

        outTime.value = "";
        inTime.value = "";

        outAmPm.value = "PM";
        inAmPm.value = "PM";

        totalTripTime.value =
            "00:00:00";

        batchContainer.innerHTML = "";

        batchCounter = 0;

        addBatchRow();

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


        tripDate.value =
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

        saveMessage.classList.add(
            type
        );

    }


    function clearMessage() {

        saveMessage.textContent =
            "";

        saveMessage.classList.remove(
            "success",
            "error"
        );

    }


    // =========================================================
    // HTML SAFETY
    // =========================================================

    function escapeHtml(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }


        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

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