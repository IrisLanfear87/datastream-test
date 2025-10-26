import styles from "./ResultTable.module.css";

import type { ResultTableProps, TabularDataUnit } from "../../interface/types";

const ResultTable = ({ header, content }: ResultTableProps) => {
  return (
    <div className={styles.tableContainer}>
      <table>
        <thead>
          <tr>
            {header.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {content.map((row: TabularDataUnit, index) => (
            <tr key={index}>
              {row.map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;
