import styles from "./CsvUploader.module.css";

import React, { type ChangeEvent } from "react";

import type { CSVInputProps } from "../../interface/types";
import { CSV_FILE_TITLE } from "../../constants/copy";

const CsvUploader = ({ onUpload }: CSVInputProps) => {
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];

    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.info}>{CSV_FILE_TITLE}</p>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
    </div>
  );
};

export default CsvUploader;
