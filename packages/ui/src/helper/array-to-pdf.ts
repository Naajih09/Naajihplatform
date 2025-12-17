/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-explicit-any */

export const arrayToPDF = <T extends Record<string, any>>(dataArray: T[]) => {
  const dataPer = (11 * 100) / Object.keys(dataArray[0] as any).length;
  const dataPercentage =
    Object.keys(dataArray[0] as any).length > 10 ? dataPer : 100;

  const html = `
      <html>
        <head>
          <style>
            /* to work on pdf CSS styles here */
            body {
              font-family: Arial, sans-serif;

            
          
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #dddddd;
              text-align: left;
              padding: 8px;
            }
            th {
              background-color: #f2f2f2;
            }
            .header_row {
                text-transform: uppercase;
            }

            /* Styles for printing */
    @media print {
      body {
        font-size: 12px;
        transform: scale(${dataPercentage / 100}); /* Set the scale factor to 0.9 or any desired value */
        transform-origin: top left;
      }
      table {
        font-size: 12px;
        page-break-inside: auto;
      }
      thead {
        display: table-header-group;
      }
      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      th {
        background-color: #f2f2f2;
        white-space: nowrap; 
      }
      td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
      }
      .no-print {
        display: none;
      }
    }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr class="header_row">
                ${Object.keys(dataArray[0] as any)
                  .map((key) => `<th>${key}</th>`)
                  .join('')}
              </tr>
            </thead>
            <tbody>
              ${dataArray
                .map(
                  (item) => `
                <tr>
                  ${Object.values(item)

                    .map((value) => `<td>${value}</td>`)
                    .join('')}
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

  return html;
};
