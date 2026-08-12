document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // ELEMENTS
    // =========================================================

    const fromDateInput =
        document.getElementById("fromDate");

    const toDateInput =
        document.getElementById("toDate");

    const filterBtn =
        document.getElementById("filterBtn");

    const clearBtn =
        document.getElementById("clearBtn");

    const refreshBtn =
        document.getElementById("refreshBtn");

    const reportTableBody =
        document.getElementById("reportTableBody");

    const reportLoading =
        document.getElementById("reportLoading");

    const reportMessage =
        document.getElementById("reportMessage");

    const totalTea =
        document.getElementById("totalTea");

    const totalMeal =
        document.getElementById("totalMeal");

    const totalAmount =
        document.getElementById("totalAmount");

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
        user.username.toLowerCase() !== "user2"
    ) {
        sessionStorage.removeItem("livebirdUser");
        window.location.href = "../index.html";
        return;
    }

    loggedUser.textContent =
        `Logged in as: ${user.name || user.username}`;


    // =========================================================
    // REPORT DATA
    // =========================================================

    let allReportData = [];


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    loadReport();


    // =========================================================
    // LOAD REPORT
    // =========================================================

    async function loadReport() {

        showLoading(true);
        clearMessage();

        try {

            const result =
                await getVehicleExpensesReportData();

            if (!result.success) {

                allReportData = [];

                renderTable([]);
                updateTotals([]);

                showMessage(
                    result.message ||
                    "Unable to load vehicle expenses report.",
                    "error"
                );

                return;
            }


            allReportData =
                Array.isArray(result.data)
                    ? result.data
                    : [];


            applyFilter(false);


        } catch (error) {

            console.error(
                "Vehicle Expenses Report Error:",
                error
            );

            allReportData = [];

            renderTable([]);
            updateTotals([]);

            showMessage(
                "Unable to connect to the server.",
                "error"
            );

        } finally {

            showLoading(false);
        }

    }


    // =========================================================
    // FILTER
    // =========================================================

    function applyFilter(showNotice = true) {

        const fromDate =
            fromDateInput.value;

        const toDate =
            toDateInput.value;


        let filteredData;


        if (!fromDate && !toDate) {

            filteredData =
                [...allReportData];

        } else {

            filteredData =
                allReportData.filter(row => {

                    const rowDate =
                        normalizeDate(row.date);

                    if (!rowDate) {
                        return false;
                    }

                    if (
                        fromDate &&
                        rowDate < fromDate
                    ) {
                        return false;
                    }

                    if (
                        toDate &&
                        rowDate > toDate
                    ) {
                        return false;
                    }

                    return true;

                });

        }


        renderTable(filteredData);

        updateTotals(filteredData);


        if (showNotice) {

            showMessage(
                `Filtered ${filteredData.length} records found.`,
                "success"
            );

        }

    }


    // =========================================================
    // CLEAR FILTER
    // =========================================================

    function clearFilter() {

        fromDateInput.value = "";
        toDateInput.value = "";

        renderTable(allReportData);

        updateTotals(allReportData);

        showMessage(
            "Filters cleared.",
            "success"
        );

    }


    // =========================================================
    // REFRESH
    // =========================================================

    async function refreshReport() {

        refreshBtn.disabled = true;

        refreshBtn.textContent =
            "Refreshing...";


        try {

            await loadReport();

            showMessage(
                "Report refreshed successfully.",
                "success"
            );

        } finally {

            refreshBtn.disabled = false;

            refreshBtn.textContent =
                "Refresh";
        }

    }


    // =========================================================
    // TABLE RENDER
    // =========================================================

    function renderTable(data) {

        reportTableBody.innerHTML = "";


        if (!data || data.length === 0) {

            const row =
                document.createElement("tr");

            row.className =
                "report-empty-row";

            row.innerHTML = `
                <td colspan="5">
                    No vehicle expense records found.
                </td>
            `;

            reportTableBody.appendChild(row);

            return;
        }


        data.forEach(record => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHtml(record.date)}
                </td>

                <td>
                    ${escapeHtml(record.vehicle)}
                </td>

                <td>
                    ${formatNumber(record.tea, 2)}
                </td>

                <td>
                    ${formatNumber(record.meal, 2)}
                </td>

                <td>
                    ${formatNumber(record.total, 2)}
                </td>

            `;


            reportTableBody.appendChild(row);

        });

    }


    // =========================================================
    // TOTALS
    // =========================================================

    function updateTotals(data) {

        let tea = 0;
        let meal = 0;
        let total = 0;


        data.forEach(row => {

            tea +=
                safeNumber(row.tea);

            meal +=
                safeNumber(row.meal);

            total +=
                safeNumber(row.total);

        });


        totalTea.textContent =
            tea.toLocaleString(
                "en-US",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );


        totalMeal.textContent =
            meal.toLocaleString(
                "en-US",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );


        totalAmount.textContent =
            total.toLocaleString(
                "en-US",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

    }


    // =========================================================
    // DATE
    // =========================================================

    function normalizeDate(value) {

        if (!value) {
            return "";
        }

        const text =
            String(value).trim();


        if (
            /^\d{4}-\d{2}-\d{2}/.test(text)
        ) {

            return text.substring(0, 10);

        }


        const date =
            new Date(text);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "";
        }


        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");


        return `${year}-${month}-${day}`;

    }


    // =========================================================
    // NUMBER HELPERS
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


    function formatNumber(
        value,
        decimals
    ) {

        return safeNumber(value)
            .toLocaleString(
                "en-US",
                {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals
                }
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
    // UI HELPERS
    // =========================================================

    function showLoading(show) {

        if (show) {

            reportLoading.classList.remove(
                "hidden"
            );

        } else {

            reportLoading.classList.add(
                "hidden"
            );

        }

    }


    function showMessage(
        message,
        type
    ) {

        reportMessage.textContent =
            message;

        reportMessage.classList.remove(
            "success",
            "error"
        );

        reportMessage.classList.add(type);

    }


    function clearMessage() {

        reportMessage.textContent = "";

        reportMessage.classList.remove(
            "success",
            "error"
        );

    }


    // =========================================================
    // EVENTS
    // =========================================================

    filterBtn.addEventListener(
        "click",
        () => applyFilter(true)
    );

    clearBtn.addEventListener(
        "click",
        clearFilter
    );

    refreshBtn.addEventListener(
        "click",
        refreshReport
    );


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