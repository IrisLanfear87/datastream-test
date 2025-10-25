// import styles from "./CsvUploader.module.css";
//@ts-nocheck

import { useState, type ChangeEvent } from "react";
import Papa, { type ParseResult } from "papaparse";
import type { CSVDataRow } from "./types";

function waterData(row, result) {
  const { MonitoringLocationID, CharacteristicName, ResultValue, ResultUnit } =
    row.data;

  if (CharacteristicName === "Temperature, water") {
    result.push({
      MonitoringLocationID,
      CharacteristicName,
      ResultValue,
      ResultUnit,
    });
  }
}

const CsvUploader = () => {
  const [csvData, setCsvData] = useState<CSVDataRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    const res = [];
    if (file) {
      Papa.parse(file, {
        header: true, // Assumes the first row is headers
        skipEmptyLines: true,
        // transformHeader: function (header) {
        //   // Example: Replace spaces with underscores in headers
        //     if (header === "monitoringlocationid") {
        //       return "Monitoring Location ID";
        //   }

        // },
        step: function (row) {
          waterData(row, res);
        },

        complete: (results: ParseResult<CSVDataRow>) => {
          if (results.errors.length > 0) {
            setError(results.errors[0].message);
            setCsvData(null);
          } else {
            console.log("resssss", res);
            setCsvData(res);
            console.log("their results", results.data);
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
      {csvData && (
        <div>
          <h3>Parsed CSV Data:</h3>
          {/* <table>
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
          </table> */}
        </div>
      )}
    </div>
  );
};

export default CsvUploader;
