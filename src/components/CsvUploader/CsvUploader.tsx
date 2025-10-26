// import styles from "./CsvUploader.module.css";

import { useState, type ChangeEvent } from "react";
import Papa, { type ParseError, type ParseResult } from "papaparse";
import {
  calculateTabularData,
  filterNonWaterTempRows,
  formatTabularData,
} from "../../utils/utils";
import type {
  CSVDataRowUnit,
  ResultTableProps,
  RowParsingError,
} from "../../interface/types";
import ResultTable from "../ResultTable/ResultTable";
import { GENERIC_ERROR_MESSAGE } from "../../constants/copy";

const CsvUploader = () => {
  const [tabularData, setTabularData] = useState<ResultTableProps | null>(null);
  const [errors, setErrors] = useState<ParseError[] | RowParsingError[] | null>(
    null
  );

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    const parsedResults = [] as CSVDataRowUnit[];
    const parsingErrors = [] as RowParsingError[];

    if (file) {
      Papa.parse(file, {
        header: true, // Assumes the first row is headers
        skipEmptyLines: true,
        step: function (row) {
          filterNonWaterTempRows(row, parsedResults, parsingErrors);
        },
        complete: (results: ParseResult<CSVDataRowUnit>) => {
          if (results.errors.length > 0) {
            setErrors(results.errors);
            setTabularData(null);
          } else {
            if (parsingErrors.length) {
              setErrors(parsingErrors);
              setTabularData(null);
              return;
            }
            //ovde izracunaj proseke
            const calculatedTabularData = calculateTabularData(parsedResults);
            const formattedTabularData = formatTabularData(
              calculatedTabularData
            );
            setTabularData(formattedTabularData);
            setErrors(null);
          }
        },
        error: (err: Error) => {
          setErrors([
            {
              message: err.message || GENERIC_ERROR_MESSAGE,
              originalError: err,
            },
          ]);
          setTabularData(null);
        },
      });
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {errors?.length &&
        errors?.map((error, i) => (
          <div key={`${i}_${error}`}>
            <p style={{ color: "red" }}>{error.message}</p>
          </div>
        ))}
      {tabularData && <ResultTable {...tabularData} />}
    </div>
  );
};

export default CsvUploader;
