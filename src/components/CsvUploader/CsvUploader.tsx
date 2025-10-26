// import styles from "./CsvUploader.module.css";

import { type ChangeEvent } from "react";

import type {
  CSVInputProps,
  ParsedCsvDataResults,
  RowParsingError,
} from "../../interface/types";

const CsvUploader = ({ handleParsing }: CSVInputProps) => {
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    const parsedResults = {} as ParsedCsvDataResults;
    const parsingErrors = [] as RowParsingError[];

    if (file) {
      handleParsing(file, parsedResults, parsingErrors);
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
    </div>
  );
};

export default CsvUploader;
