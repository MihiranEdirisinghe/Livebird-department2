document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // CONSTANTS
    // =========================================================

    const LOCATIONS = [
        "Pannala",
        "Kotadeniyawa",
        "Weerapokuna",
        "Epaladeniya"
    ];

    const SIZES = [
        "S",
        "M",
        "L",
        "XL"
    ];


    // =========================================================
    // ELEMENTS
    // =========================================================

    const entryDate =
        document.getElementById("entryDate");

    const buybackInput =
        document.getElementById("buyback");

    const imoPlantInput =
        document.getElementById("imoPlant");

    const totalQtyInput =
        document.getElementById("totalQty");

    const liveSaleInput =
        document.getElementById("liveSale");

    const remarkInput =
        document.getElementById("remark");


    const totalBuybackInput =
        document.getElementById("totalBuyback");

    const dayCountInput =
        document.getElementById("dayCount");

    const perDayValue =
        document.getElementById("perDayValue");

    const useBuybackBtn =
        document.getElementById("useBuybackBtn");


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
        user.username.toLowerCase() !== "user3"
    ) {
        sessionStorage.removeItem("livebirdUser");
        window.location.href = "../index.html";
        return;
    }


    loggedUser.textContent =
        `Logged in as: ${user.name || user.username}`;


    // =========================================================
    // LOCATION MAP
    // =========================================================

    const locationMap = {

        Pannala: {
            container:
                document.getElementById("pannalaCages"),
            total:
                document.getElementById("pannalaTotal")
        },

        Kotadeniyawa: {
            container:
                document.getElementById("kotadeniyawaCages"),
            total:
                document.getElementById("kotadeniyawaTotal")
        },

        Weerapokuna: {
            container:
                document.getElementById("weerapokunaCages"),
            total:
                document.getElementById("weerapokunaTotal")
        },

        Epaladeniya: {
            container:
                document.getElementById("epaladeniyaCages"),
            total:
                document.getElementById("epaladeniyaTotal")
        }

    };


    // =========================================================
    // INITIAL SETUP
    // =========================================================

    setTodayDate();

    calculateTotals();


    // =========================================================
    // ADD CAGE BUTTONS
    // =========================================================

    document
        .querySelectorAll(".add-cage-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const location =
                        button.dataset.location;

                    addCageRow(location);

                }
            );

        });


    // =========================================================
    // ADD CAGE ROW
    // =========================================================

    function addCageRow(location) {

        if (!locationMap[location]) {
            return;
        }


        const row =
            document.createElement("div");

        row.className =
            "cage-row";


        row.innerHTML = `

            <input
                type="text"
                class="cage-no"
                placeholder="Cage No"
            >

            <input
                type="number"
                class="cage-qty"
                placeholder="Qty"
                min="0"
            >

            <select class="cage-size">

                <option value="">
                    Size
                </option>

                ${SIZES.map(size => `
                    <option value="${size}">
                        ${size}
                    </option>
                `).join("")}

            </select>

            <button
                type="button"
                class="delete-cage-btn"
                title="Delete Cage"
            >
                ×
            </button>

        `;


        locationMap[location]
            .container
            .appendChild(row);


        const qtyInput =
            row.querySelector(".cage-qty");

        const deleteBtn =
            row.querySelector(".delete-cage-btn");


        qtyInput.addEventListener(
            "input",
            calculateTotals
        );


        deleteBtn.addEventListener(
            "click",
            () => {

                row.remove();

                calculateTotals();

            }
        );

    }


    // =========================================================
    // TOTAL CALCULATION
    // =========================================================

    buybackInput.addEventListener(
        "input",
        calculateTotals
    );

    imoPlantInput.addEventListener(
        "input",
        calculateLiveSale
    );


    function calculateTotals() {

        const buyback =
            safeNumber(
                buybackInput.value
            );


        let cageGrandTotal = 0;


        LOCATIONS.forEach(location => {

            const rows =
                locationMap[location]
                    .container
                    .querySelectorAll(".cage-row");


            let locationTotal = 0;


            rows.forEach(row => {

                const qty =
                    safeNumber(
                        row.querySelector(
                            ".cage-qty"
                        ).value
                    );

                locationTotal += qty;

            });


            locationMap[location]
                .total
                .textContent =
                formatWhole(locationTotal);


            cageGrandTotal += locationTotal;

        });


        const grandTotal =
            buyback + cageGrandTotal;


        totalQtyInput.value =
            formatWhole(grandTotal);


        calculateLiveSale();

    }


    // =========================================================
    // LIVE SALE
    // =========================================================

    function calculateLiveSale() {

        const total =
            safeNumber(
                totalQtyInput.value
            );

        const imoPlant =
            safeNumber(
                imoPlantInput.value
            );


        const liveSale =
            Math.max(
                0,
                total - imoPlant
            );


        liveSaleInput.value =
            formatWhole(liveSale);

    }


    // =========================================================
    // BUYBACK CALCULATOR
    // =========================================================

    totalBuybackInput.addEventListener(
        "input",
        calculatePerDay
    );

    dayCountInput.addEventListener(
        "input",
        calculatePerDay
    );


    function calculatePerDay() {

        const total =
            safeNumber(
                totalBuybackInput.value
            );

        const days =
            parseInt(
                dayCountInput.value,
                10
            ) || 0;


        if (days > 0) {

            const value =
                Math.round(
                    total / days
                );


            perDayValue.textContent =
                value.toLocaleString(
                    "en-US"
                );

        } else {

            perDayValue.textContent =
                "0";

        }

    }


    useBuybackBtn.addEventListener(
        "click",
        () => {

            const total =
                safeNumber(
                    totalBuybackInput.value
                );

            const days =
                parseInt(
                    dayCountInput.value,
                    10
                ) || 0;


            if (days <= 0) {

                showMessage(
                    "Please enter a valid Day Count.",
                    "error"
                );

                return;
            }


            const value =
                Math.round(
                    total / days
                );


            buybackInput.value =
                value;


            calculateTotals();


            showMessage(
                "Buy Back field updated.",
                "success"
            );

        }
    );


    // =========================================================
    // BUILD ALL ROWS
    // =========================================================

    function buildAllRows() {

        const rows = [];


        LOCATIONS.forEach(location => {

            const cageRows =
                locationMap[location]
                    .container
                    .querySelectorAll(".cage-row");


            cageRows.forEach(row => {

                const cageNo =
                    row.querySelector(
                        ".cage-no"
                    ).value.trim();

                const qty =
                    row.querySelector(
                        ".cage-qty"
                    ).value;

                const size =
                    row.querySelector(
                        ".cage-size"
                    ).value;


                // Match Python behavior:
                // if Cage No + Qty both empty, skip row

                if (
                    !cageNo &&
                    !qty
                ) {
                    return;
                }


                rows.push({

                    date:
                        entryDate.value || "",

                    buyback:
                        buybackInput.value || "0",

                    location:
                        location,

                    cageNo:
                        cageNo,

                    qty:
                        qty || "0",

                    size:
                        size || "",

                    imoPlant:
                        imoPlantInput.value || "0",

                    remark:
                        remarkInput.value.trim(),

                    addedBy:
                        user.name || user.username

                });

            });

        });


        // Same fallback behavior as Python:
        // if no cage rows exist, save one general row

        if (rows.length === 0) {

            rows.push({

                date:
                    entryDate.value || "",

                buyback:
                    buybackInput.value || "0",

                location:
                    "-",

                cageNo:
                    "",

                qty:
                    "0",

                size:
                    "",

                imoPlant:
                    imoPlantInput.value || "0",

                remark:
                    remarkInput.value.trim(),

                addedBy:
                    user.name || user.username

            });

        }


        return rows;

    }


    // =========================================================
    // SAVE BUTTON -> PREVIEW
    // =========================================================

    saveAllBtn.addEventListener(
        "click",
        () => {

            clearMessage();

            const rows =
                buildAllRows();

            showPreview(rows);

        }
    );


    // =========================================================
    // PREVIEW
    // =========================================================

    function showPreview(rows) {

        previewContent.innerHTML = "";


        const summary =
            document.createElement("div");

        summary.className =
            "preview-summary";


        summary.innerHTML = `

            <p>
                <strong>Date:</strong>
                ${escapeHtml(entryDate.value || "-")}
            </p>

            <p>
                <strong>Buy Back:</strong>
                ${escapeHtml(buybackInput.value || "0")}
            </p>

            <p>
                <strong>IMO Plant:</strong>
                ${escapeHtml(imoPlantInput.value || "0")}
            </p>

            <p>
                <strong>Total Qty:</strong>
                ${escapeHtml(totalQtyInput.value || "0")}
            </p>

            <p>
                <strong>Live Sale:</strong>
                ${escapeHtml(liveSaleInput.value || "0")}
            </p>

            <p>
                <strong>Remark:</strong>
                ${escapeHtml(remarkInput.value || "-")}
            </p>

        `;


        previewContent.appendChild(
            summary
        );


        rows.forEach(row => {

            const item =
                document.createElement("div");

            item.className =
                "preview-cage-row";


            item.innerHTML = `

                <span>
                    ${escapeHtml(row.location)}
                    -
                    Cage
                    ${escapeHtml(row.cageNo || "-")}
                </span>

                <strong>
                    Qty:
                    ${escapeHtml(row.qty)}
                    (${escapeHtml(row.size || "-")})
                </strong>

            `;


            previewContent.appendChild(
                item
            );

        });


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

            const rows =
                buildAllRows();


            confirmSaveBtn.disabled =
                true;

            confirmSaveBtn.textContent =
                "Saving...";


            try {

                const result =
                    await saveUser3CatchingPlan(
                        rows
                    );


                if (result.success) {

                    closePreview();


                    showMessage(
                        "Buyback Catching Data Saved Successfully! 🎉",
                        "success"
                    );


                    resetForm();

                } else {

                    showMessage(
                        result.message ||
                        "Unable to save catching plan.",
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
    // RESET FORM
    // =========================================================

    function resetForm() {

        setTodayDate();


        buybackInput.value = "";

        imoPlantInput.value = "";

        remarkInput.value = "";

        totalQtyInput.value = "0";

        liveSaleInput.value = "0";


        totalBuybackInput.value = "";

        dayCountInput.value = "";

        perDayValue.textContent = "0";


        LOCATIONS.forEach(location => {

            locationMap[location]
                .container
                .innerHTML = "";

            locationMap[location]
                .total
                .textContent = "0";

        });

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


        entryDate.value =
            `${year}-${month}-${day}`;

    }


    // =========================================================
    // HELPERS
    // =========================================================

    function safeNumber(value) {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return 0;
        }


        const number =
            parseFloat(
                String(value)
                    .replace(/,/g, "")
                    .trim()
            );


        return Number.isFinite(number)
            ? number
            : 0;

    }


    function formatWhole(value) {

        return Math.round(value)
            .toLocaleString(
                "en-US"
            );

    }


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