import "./App.css";
import CsvUploader from "./components/CsvUploader/CsvUploader";
import Header from "./components/Header/Header";
import ErrorDisplay from "./components/ErrorDisplay/ErrorDisplay";
import { useState } from "react";
import Papa, { type ParseResult } from "papaparse";
import { calculateTabularData, filterNonWaterTempRows } from "./utils/utils";
import type {
  CSVDataRowUnit,
  ParsedCsvDataResults,
  RowParsingError,
  TabularDataUnit,
} from "./interface/types";
import ResultTable from "./components/ResultTable/ResultTable";

function App() {
  const [tabularData, setTabularData] = useState<TabularDataUnit[] | null>(
    null
  );
  const [errorCount, setErrorCount] = useState<number>(0);

  const parsedResults: ParsedCsvDataResults = {};
  const parsingErrors: RowParsingError[] = [];

  const handleParsing = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      step: function (row) {
        filterNonWaterTempRows(row, parsedResults, parsingErrors);
      },
      complete: (results: ParseResult<CSVDataRowUnit>) => {
        if (results.errors.length > 0) {
          setErrorCount(results.errors.length);
          setTabularData(null);
        } else {
          if (parsingErrors.length) {
            setErrorCount(parsingErrors.length);
            setTabularData(null);
            return;
          }
          const calculatedTabularData = calculateTabularData(parsedResults);
          setTabularData(calculatedTabularData);
          setErrorCount(0);
        }
      },
      error: () => {
        setErrorCount(1);
        setTabularData(null);
      },
    });
  };

  return (
    <div className="appContainer">
      <Header />
      <CsvUploader onUpload={handleParsing} />
      {errorCount > 0 ? (
        <ErrorDisplay errorCount={errorCount} />
      ) : (
        <ResultTable content={tabularData} />
      )}
    </div>
  );
}

export default App;
