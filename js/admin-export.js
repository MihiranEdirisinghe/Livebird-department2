document.addEventListener("DOMContentLoaded", () => {

    const tables =
        document.querySelectorAll(
            ".analytics-table, .exportable-table"
        );

    if (!tables.length) {
        return;
    }


    tables.forEach((table, index) => {

        const wrapper =
            table.closest(
                ".analytics-card"
            );

        if (!wrapper) {
            return;
        }


        const heading =
            wrapper.querySelector(
                ".analytics-section-heading"
            );


        const titleElement =
            heading?.querySelector(
                "h2, h3"
            );


        const reportTitle =
            titleElement
                ? titleElement.textContent.trim()
                : `Report ${index + 1}`;


        const toolbar =
            document.createElement("div");


        toolbar.className =
            "export-toolbar";


        toolbar.innerHTML = `

            <button
                type="button"
                class="export-btn export-csv-btn"
            >
                CSV
            </button>

            <button
                type="button"
                class="export-btn export-pdf-btn"
            >
                PDF
            </button>

        `;


        if (heading) {

            heading.appendChild(
                toolbar
            );

        } else {

            wrapper.insertBefore(
                toolbar,
                table.parentElement
            );

        }


        const csvBtn =
            toolbar.querySelector(
                ".export-csv-btn"
            );


        const pdfBtn =
            toolbar.querySelector(
                ".export-pdf-btn"
            );


        csvBtn.addEventListener(
            "click",
            () => exportTableToCSV(
                table,
                reportTitle
            )
        );


        pdfBtn.addEventListener(
            "click",
            () => exportTableToPDF(
                table,
                reportTitle
            )
        );

    });


    function exportTableToCSV(
        table,
        title
    ) {

        const rows =
            Array.from(
                table.querySelectorAll(
                    "tr"
                )
            );


        const csv =
            rows
                .map(row => {

                    const cells =
                        Array.from(
                            row.querySelectorAll(
                                "th, td"
                            )
                        );


                    return cells
                        .map(cell => {

                            let text =
                                cell.innerText
                                    .replace(/\s+/g, " ")
                                    .trim();


                            text =
                                text.replace(
                                    /"/g,
                                    '""'
                                );


                            return `"${text}"`;

                        })
                        .join(",");

                })
                .join("\n");


        const blob =
            new Blob(
                ["\ufeff" + csv],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            `${cleanFileName(title)}.csv`;


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );

    }


function exportTableToPDF(
    table,
    tableTitle
) {

    if (
        !window.jspdf ||
        !window.jspdf.jsPDF
    ) {
        alert("PDF library is not loaded.");
        return;
    }


    const { jsPDF } =
        window.jspdf;


    const doc =
        new jsPDF({
            orientation: "landscape",
            unit: "pt",
            format: "a4"
        });


    // MAIN PAGE TITLE
    const mainHeading =
        document.querySelector(
            ".admin-header h1, .dashboard-header h1, h1"
        );


    const mainTitle =
        mainHeading
            ? mainHeading.textContent.trim()
            : "Report";


    // MAIN HEADING
    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(17);

    doc.text(
        mainTitle,
        40,
        50
    );


    // SUB HEADING - TABLE TITLE
    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(11);

    doc.text(
        tableTitle,
        40,
        68
    );


    // OPTIONAL FILTER PERIOD
    let filterText = "";


    const monthFilter =
        document.getElementById(
            "monthFilter"
        );


    const fromDate =
        document.getElementById(
            "fromDate"
        );


    const toDate =
        document.getElementById(
            "toDate"
        );


    if (
    monthFilter &&
    monthFilter.value
) {

    const [year, month] =
        monthFilter.value.split("-");

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    const monthName =
        monthNames[
            Number(month) - 1
        ];

    filterText =
        `Period: ${year} ${monthName}`;


    } else if (
        fromDate?.value ||
        toDate?.value
    ) {

        filterText =
            `Period: ${fromDate?.value || "Start"} to ${toDate?.value || "End"}`;

    }


    if (filterText) {

        doc.setFontSize(9);

        doc.setTextColor(
            100,
            116,
            139
        );

        doc.text(
            filterText,
            40,
            80
        );

        doc.setTextColor(
            0,
            0,
            0
        );

    }


    doc.autoTable({

        html: table,

        startY:
            filterText
                ? 92
                : 78,

        theme: "grid",

        styles: {
            fontSize: 7,
            cellPadding: 3,
            overflow: "linebreak",
            valign: "middle"
        },

        headStyles: {
            fillColor: [1, 8, 83],
            textColor: 255,
            fontStyle: "bold"
        },

        footStyles: {
            fillColor: [241, 245, 249],
            textColor: [15, 23, 42],
            fontStyle: "bold"
        },

        margin: {
            top: 70,
            bottom: 42,
            left: 30,
            right: 30
        },


        // =====================================================
        // HEADER + FOOTER ON EVERY PDF PAGE
        // =====================================================

        didDrawPage: function () {

            const pageWidth =
                doc.internal.pageSize.getWidth();

            const pageHeight =
                doc.internal.pageSize.getHeight();


            // -------------------------------------------------
            // HEADER
            // -------------------------------------------------

            doc.setDrawColor(
                226,
                232,
                240
            );

            doc.setLineWidth(0.5);

            doc.line(
                30,
                28,
                pageWidth - 30,
                28
            );


            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.setFontSize(9);

            doc.setTextColor(
                1,
                8,
                83
            );


            // LEFT HEADER
            doc.text(
                "Imo Chicken & Agro (Pvt) Ltd",
                30,
                20
            );


            // RIGHT HEADER
            doc.text(
                "Live Bird Department",
                pageWidth - 30,
                20,
                {
                    align: "right"
                }
            );


            // -------------------------------------------------
            // FOOTER
            // -------------------------------------------------

            doc.setDrawColor(
                226,
                232,
                240
            );

            doc.line(
                30,
                pageHeight - 28,
                pageWidth - 30,
                pageHeight - 28
            );


            doc.setFont(
                "helvetica",
                "normal"
            );

            doc.setFontSize(8);

            doc.setTextColor(
                100,
                116,
                139
            );


            doc.text(
                "Copyright © 2026 | MIS Department | All Rights Reserved",
                pageWidth / 2,
                pageHeight - 16,
                {
                    align: "center"
                }
            );


            // Reset text colour
            doc.setTextColor(
                0,
                0,
                0
            );

        }

    });


    doc.save(
        `${cleanFileName(
            mainTitle
        )}-${cleanFileName(
            tableTitle
        )}.pdf`
    );

}


    function cleanFileName(
        value
    ) {

        return String(
            value || "report"
        )

            .trim()

            .replace(
                /[\\/:*?"<>|]/g,
                ""
            )

            .replace(
                /\s+/g,
                "-"
            );

    }

});