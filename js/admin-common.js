// =========================================================
// USER 4 - COMMON ADMIN ANALYTICS HELPERS
// =========================================================

const AdminCommon = (() => {

    // ---------------------------------------------------------
    // SESSION
    // ---------------------------------------------------------

    function getSessionUser() {

        const sessionUser =
            sessionStorage.getItem("livebirdUser");

        if (!sessionUser) {

            window.location.href =
                "../index.html";

            return null;
        }

        let user;

        try {

            user =
                JSON.parse(sessionUser);

        } catch (error) {

            sessionStorage.removeItem(
                "livebirdUser"
            );

            window.location.href =
                "../index.html";

            return null;
        }


        if (
            !user.username ||
            user.username.toLowerCase() !== "user4"
        ) {

            sessionStorage.removeItem(
                "livebirdUser"
            );

            window.location.href =
                "../index.html";

            return null;
        }


        return user;

    }


    function setLoggedUser(
        element,
        user
    ) {

        if (!element || !user) {
            return;
        }


        element.textContent =
            `Logged in as: ${user.name || user.username}`;

    }


    function bindLogout(
        logoutButton
    ) {

        if (!logoutButton) {
            return;
        }


        logoutButton.addEventListener(
            "click",
            () => {

                sessionStorage.removeItem(
                    "livebirdUser"
                );

                window.location.href =
                    "../index.html";

            }
        );

    }


    // ---------------------------------------------------------
    // NUMBERS
    // ---------------------------------------------------------

    function safeNumber(value) {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return 0;
        }


        const cleaned =
            String(value)
                .replace(/,/g, "")
                .trim();


        const number =
            parseFloat(cleaned);


        return Number.isFinite(number)
            ? number
            : 0;

    }


    function formatWhole(value) {

        return Math.round(
            safeNumber(value)
        ).toLocaleString(
            "en-US"
        );

    }


    function formatDecimal(
        value,
        decimals = 2
    ) {

        return safeNumber(value)
            .toLocaleString(
                "en-US",
                {
                    minimumFractionDigits:
                        decimals,

                    maximumFractionDigits:
                        decimals
                }
            );

    }


    function formatAmount(value) {

        const number =
            safeNumber(value);


        if (number >= 100000) {

            return (
                number / 1000000
            ).toLocaleString(
                "en-US",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            ) + " M";

        }


        return number.toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    }


    function formatWeight(value) {

        const number =
            safeNumber(value);


        if (number >= 1000) {

            return (
                number / 1000
            ).toLocaleString(
                "en-US",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            ) + " t";

        }


        return number.toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        ) + " kg";

    }


    // ---------------------------------------------------------
    // DATE
    // ---------------------------------------------------------

    function normalizeDate(value) {

        if (!value) {
            return "";
        }


        const text =
            String(value).trim();


        if (
            /^\d{4}-\d{2}-\d{2}/.test(text)
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


    function getToday() {

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


        return `${year}-${month}-${day}`;

    }


    function getCurrentMonth() {

        const today =
            new Date();


        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");


        return `${year}-${month}`;

    }


    // ---------------------------------------------------------
    // FILTER HELPERS
    // ---------------------------------------------------------

    function filterByDateRange(
        data,
        fromDate,
        toDate
    ) {

        if (
            !Array.isArray(data)
        ) {

            return [];
        }


        if (
            !fromDate &&
            !toDate
        ) {

            return [...data];

        }


        return data.filter(row => {

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


    function filterByMonth(
        data,
        month
    ) {

        if (
            !Array.isArray(data)
        ) {

            return [];
        }


        if (!month) {

            return [...data];

        }


        return data.filter(row => {

            const date =
                normalizeDate(
                    row.date
                );


            return date.startsWith(
                month
            );

        });

    }


    function filterBySingleDate(
        data,
        selectedDate
    ) {

        if (
            !Array.isArray(data)
        ) {

            return [];
        }


        if (!selectedDate) {

            return [...data];

        }


        return data.filter(row => {

            const date =
                normalizeDate(
                    row.date
                );


            return date ===
                selectedDate;

        });

    }


    // ---------------------------------------------------------
    // MESSAGE
    // ---------------------------------------------------------

    function showMessage(
        element,
        message,
        type = "success"
    ) {

        if (!element) {
            return;
        }


        element.textContent =
            message;


        element.classList.remove(
            "success",
            "error"
        );


        element.classList.add(type);

    }


    function clearMessage(
        element
    ) {

        if (!element) {
            return;
        }


        element.textContent = "";


        element.classList.remove(
            "success",
            "error"
        );

    }


    // ---------------------------------------------------------
    // LOADER
    // ---------------------------------------------------------

    function setLoading(
        element,
        show
    ) {

        if (!element) {
            return;
        }


        if (show) {

            element.classList.add(
                "show"
            );

        } else {

            element.classList.remove(
                "show"
            );

        }

    }


    // ---------------------------------------------------------
    // HTML
    // ---------------------------------------------------------

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


    // ---------------------------------------------------------
    // TABLE EMPTY STATE
    // ---------------------------------------------------------

    function renderEmptyRow(
        tbody,
        columnCount,
        message = "No records found."
    ) {

        if (!tbody) {
            return;
        }


        tbody.innerHTML = `

            <tr class="analytics-empty-row">

                <td
                    colspan="${columnCount}"
                    class="analytics-empty-state"
                >
                    ${escapeHtml(message)}
                </td>

            </tr>

        `;

    }


    // ---------------------------------------------------------
    // CHART HELPERS
    // ---------------------------------------------------------

    function initializeChart(
        element
    ) {

        if (
            !element ||
            typeof echarts === "undefined"
        ) {

            return null;
        }


        return echarts.init(
            element
        );

    }


    function resizeCharts(
        charts
    ) {

        if (
            !Array.isArray(charts)
        ) {
            return;
        }


        charts.forEach(chart => {

            if (
                chart &&
                typeof chart.resize === "function"
            ) {

                chart.resize();

            }

        });

    }


    function bindChartResize(
        charts
    ) {

        window.addEventListener(
            "resize",
            () => {

                resizeCharts(charts);

            }
        );

    }


    function clearChart(
        chart
    ) {

        if (
            chart &&
            typeof chart.clear === "function"
        ) {

            chart.clear();

        }

    }


    // ---------------------------------------------------------
    // COMMON AGGREGATIONS
    // ---------------------------------------------------------

    function sumBy(
        data,
        key
    ) {

        if (
            !Array.isArray(data)
        ) {

            return 0;
        }


        return data.reduce(
            (total, row) => {

                return total +
                    safeNumber(
                        row[key]
                    );

            },
            0
        );

    }


    function uniqueCount(
        data,
        key
    ) {

        if (
            !Array.isArray(data)
        ) {

            return 0;
        }


        const values =
            new Set();


        data.forEach(row => {

            const value =
                String(
                    row[key] || ""
                ).trim();


            if (value) {

                values.add(value);

            }

        });


        return values.size;

    }


    function weightedAverage(
        numerator,
        denominator
    ) {

        const top =
            safeNumber(numerator);

        const bottom =
            safeNumber(denominator);


        return bottom > 0
            ? top / bottom
            : 0;

    }


    // ---------------------------------------------------------
    // PUBLIC API
    // ---------------------------------------------------------

    return {

        getSessionUser,

        setLoggedUser,

        bindLogout,

        safeNumber,

        formatWhole,

        formatDecimal,

        formatAmount,

        formatWeight,

        normalizeDate,

        getToday,

        getCurrentMonth,

        filterByDateRange,

        filterByMonth,

        filterBySingleDate,

        showMessage,

        clearMessage,

        setLoading,

        escapeHtml,

        renderEmptyRow,

        initializeChart,

        resizeCharts,

        bindChartResize,

        clearChart,

        sumBy,

        uniqueCount,

        weightedAverage

    };

})();
