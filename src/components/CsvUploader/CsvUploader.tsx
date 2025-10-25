// import styles from "./CsvUploader.module.css";

import { useState, type ChangeEvent } from "react";
import Papa, { type ParseResult } from "papaparse";
import type { CSVDataRowUnit } from "./types";
import { filterNonWaterTempRows } from "../../utils/utils";

const CsvUploader = () => {
  const [csvData, setCsvData] = useState<CSVDataRowUnit[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    const parsedResults = [] as CSVDataRowUnit[];
    if (file) {
      Papa.parse(file, {
        header: true, // Assumes the first row is headers
        skipEmptyLines: true,
        step: function (row) {
          filterNonWaterTempRows(row, parsedResults);
        },

        complete: (results: ParseResult<CSVDataRowUnit>) => {
          if (results.errors.length > 0) {
            setError(results.errors[0].message);
            setCsvData(null);
          } else {
            setCsvData(parsedResults);
            setError(null);
          }
        },
        error: (err: Error) => {
          setError(err.message);
          setCsvData(null);
        },
      });
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {/* {csvData && (
        <div>
          <h3>Parsed CSV Data:</h3>
          <table>
            <thead>
              <tr>
                {Object.keys(csvData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div> 
      )} */}
    </div>
  );
};

export default CsvUploader;
