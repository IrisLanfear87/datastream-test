import "./App.css";
import CsvUploader from "./components/CsvUploader/CsvUploader";
import { useState } from "react";
import Papa, { type ParseError, type ParseResult } from "papaparse";
import { calculateTabularData, filterNonWaterTempRows } from "./utils/utils";
import type {
  CSVDataRowUnit,
  ParsedCsvDataResults,
  RowParsingError,
  TabularDataUnit,
} from "./interface/types";
import ResultTable from "./components/ResultTable/ResultTable";
import { TableColumnHeaders } from "./constants/constants";
import { GENERIC_ERROR_MESSAGE } from "./constants/copy";

function App() {
  const [tabularData, setTabularData] = useState<TabularDataUnit[] | null>(
    null
  );
  const [errors, setErrors] = useState<ParseError[] | RowParsingError[] | null>(
    null
  );

  const handleParsing = (
    file: File,
    parsedResults: ParsedCsvDataResults,
    parsingErrors: RowParsingError[]
  ) => {
    Papa.parse(file, {
      header: true,
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
          const calculatedTabularData = calculateTabularData(parsedResults);
          setTabularData(calculatedTabularData);
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
  };

  return (
    <div className="appContainer">
      <CsvUploader handleParsing={handleParsing} />
      {errors?.length &&
        errors?.map((error, i) => (
          <div key={`${i}_${error}`}>
            <p style={{ color: "red" }}>{error.message}</p>
          </div>
        ))}
      {!errors?.length && tabularData && (
        <ResultTable
          {...{ header: TableColumnHeaders, content: tabularData }}
        />
      )}
    </div>
  );
}

export default App;
