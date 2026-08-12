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


    const totalBuyback =
        document.getElementById("totalBuyback");

    const totalQty =
        document.getElementById("totalQty");

    const totalImo =
        document.getElementById("totalImo");

    const totalLive =
        document.getElementById("totalLive");


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

        window.location.href =
            "../index.html";

        return;
    }


    const user =
        JSON.parse(sessionUser);


    if (
        !user.username ||
        user.username.toLowerCase() !== "user3"
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
    // DATA
    // =========================================================

    let allRawData = [];


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
                await getUser3ReportData();


            if (!result.success) {

                allRawData = [];

                renderTable([]);

                updateTotals([]);


                showMessage(
                    result.message ||
                    "Unable to load Buyback Report.",
                    "error"
                );

                return;
            }


            allRawData =
                Array.isArray(result.data)
                    ? result.data
                    : [];


            applyFilter(false);


        } catch (error) {

            console.error(
                "User3 Report Error:",
                error
            );


            allRawData = [];

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

    function applyFilter(
        showNotice = true
    ) {

        const fromDate =
            fromDateInput.value;

        const toDate =
            toDateInput.value;


        let filteredRaw;


        if (
            !fromDate &&
            !toDate
        ) {

            filteredRaw =
                [...allRawData];

        } else {

            filteredRaw =
                allRawData.filter(row => {

                    const rowDate =
                        normalizeDate(
                            row.date
                        );


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


        const groupedData =
            groupByDate(filteredRaw);


        renderTable(groupedData);

        updateTotals(groupedData);


        if (showNotice) {

            showMessage(
                `Filtered ${groupedData.length} days found.`,
                "success"
            );

        }

    }


    // =========================================================
    // GROUP RAW ROWS BY DATE
    // =========================================================

    function groupByDate(rawRows) {

        const grouped = {};


        rawRows.forEach(row => {

            const date =
                normalizeDate(row.date);


            if (!date) {
                return;
            }


            if (!grouped[date]) {

                grouped[date] = {

                    date: date,

                    buyback:
                        safeNumber(
                            row.buyback
                        ),

                    imoPlant:
                        safeNumber(
                            row.imo_plant
                        ),

                    remark:
                        row.remark || "",

                    locations: {

                        Pannala: [],

                        Kotadeniyawa: [],

                        Weerapokuna: [],

                        Epaladeniya: []

                    },

                    qtySum: 0

                };

            }


            const location =
                String(
                    row.location || ""
                ).trim();


            if (
                LOCATIONS.includes(location) &&
                (
                    row.cage_no ||
                    safeNumber(row.qty) !== 0
                )
            ) {

                const cageNo =
                    String(
                        row.cage_no || ""
                    ).trim();

                const qty =
                    safeNumber(
                        row.qty
                    );

                const size =
                    String(
                        row.size || ""
                    ).trim();


                let cageText;


                if (cageNo) {

                    cageText =
                        `C${cageNo}:${formatWhole(qty)}`;


                    if (size) {

                        cageText +=
                            `(${size})`;

                    }

                } else {

                    cageText =
                        formatWhole(qty);

                }


                grouped[date]
                    .locations[location]
                    .push(cageText);


                grouped[date]
                    .qtySum += qty;

            }

        });


        const result =
            Object.values(grouped)
                .map(data => {

                    const total =
                        data.buyback +
                        data.qtySum;


                    const liveSale =
                        Math.max(
                            0,
                            total - data.imoPlant
                        );


                    return {

                        date:
                            data.date,

                        buyback:
                            data.buyback,

                        pannala:
                            data.locations
                                .Pannala,

                        kotadeniyawa:
                            data.locations
                                .Kotadeniyawa,

                        weerapokuna:
                            data.locations
                                .Weerapokuna,

                        epaladeniya:
                            data.locations
                                .Epaladeniya,

                        total_qty:
                            total,

                        imo_plant:
                            data.imoPlant,

                        live_sale:
                            liveSale,

                        remark:
                            data.remark || "-"

                    };

                });


        result.sort(
            (a, b) =>
                a.date.localeCompare(
                    b.date
                )
        );


        return result;

    }


    // =========================================================
    // TABLE
    // =========================================================

    function renderTable(data) {

        reportTableBody.innerHTML = "";


        if (
            !data ||
            data.length === 0
        ) {

            const row =
                document.createElement("tr");


            row.className =
                "report-empty-row";


            row.innerHTML = `

                <td colspan="10">
                    No Buyback Catching records found.
                </td>

            `;


            reportTableBody.appendChild(
                row
            );


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
                    ${formatWhole(record.buyback)}
                </td>

                <td class="location-detail-cell">
                    ${formatLocation(record.pannala)}
                </td>

                <td class="location-detail-cell">
                    ${formatLocation(record.kotadeniyawa)}
                </td>

                <td class="location-detail-cell">
                    ${formatLocation(record.weerapokuna)}
                </td>

                <td class="location-detail-cell">
                    ${formatLocation(record.epaladeniya)}
                </td>

                <td>
                    ${formatWhole(record.total_qty)}
                </td>

                <td>
                    ${formatWhole(record.imo_plant)}
                </td>

                <td>
                    ${formatWhole(record.live_sale)}
                </td>

                <td>
                    ${escapeHtml(record.remark || "-")}
                </td>

            `;


            reportTableBody.appendChild(
                row
            );

        });

    }


    // =========================================================
    // LOCATION DISPLAY
    // =========================================================

    function formatLocation(items) {

        if (
            !Array.isArray(items) ||
            items.length === 0
        ) {

            return "-";

        }


        return items
            .map(item =>
                escapeHtml(item)
            )
            .join("<br>");

    }


    // =========================================================
    // GRAND TOTALS
    // =========================================================

    function updateTotals(data) {

        let buyback = 0;

        let qty = 0;

        let imo = 0;

        let live = 0;


        data.forEach(row => {

            buyback +=
                safeNumber(
                    row.buyback
                );

            qty +=
                safeNumber(
                    row.total_qty
                );

            imo +=
                safeNumber(
                    row.imo_plant
                );

            live +=
                safeNumber(
                    row.live_sale
                );

        });


        totalBuyback.textContent =
            formatWhole(buyback);

        totalQty.textContent =
            formatWhole(qty);

        totalImo.textContent =
            formatWhole(imo);

        totalLive.textContent =
            formatWhole(live);

    }


    // =========================================================
    // CLEAR FILTER
    // =========================================================

    function clearFilter() {

        fromDateInput.value = "";

        toDateInput.value = "";


        const grouped =
            groupByDate(
                allRawData
            );


        renderTable(grouped);

        updateTotals(grouped);


        showMessage(
            "Filters cleared.",
            "success"
        );

    }


    // =========================================================
    // REFRESH
    // =========================================================

    async function refreshReport() {

        refreshBtn.disabled =
            true;

        refreshBtn.textContent =
            "Refreshing...";


        try {

            await loadReport();


            showMessage(
                "Report refreshed successfully.",
                "success"
            );


        } finally {

            refreshBtn.disabled =
                false;

            refreshBtn.textContent =
                "Refresh";

        }

    }


    // =========================================================
    // DATE NORMALIZATION
    // =========================================================

    function normalizeDate(value) {

        if (!value) {
            return "";
        }


        const text =
            String(value).trim();


        if (
            /^\d{4}-\d{2}-\d{2}/
                .test(text)
        ) {

            return text.substring(
                0,
                10
            );

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


    function formatWhole(value) {

        return Math.round(
            safeNumber(value)
        ).toLocaleString("en-US");

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

            reportLoading
                .classList
                .remove("hidden");

        } else {

            reportLoading
                .classList
                .add("hidden");

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


        reportMessage.classList.add(
            type
        );

    }


    function clearMessage() {

        reportMessage.textContent =
            "";


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