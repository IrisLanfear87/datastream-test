import styles from "./ResultTable.module.css";

import type { ResultTableProps, TabularDataUnit } from "../../interface/types";
import { NO_DATA, TABLE_HEADERS } from "../../constants/copy";

const ResultTable = ({ content }: ResultTableProps) => {
  if (content === null) return null;

  return (
    <div className={styles.tableContainer}>
      {content && content?.length > 0 ? (
        <table>
          <thead>
            <tr>
              {TABLE_HEADERS.map((key) => (
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
      ) : (
        <p>{NO_DATA}</p>
      )}
    </div>
  );
};

export default ResultTable;
