import type { CSVDataRowUnit, ResultTableProps } from "../../interface/types";

const ResultTable = ({ heading, data }: ResultTableProps) => {
  return (
    <div>
      <h3>{heading}</h3>
      <table>
        <thead>
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: CSVDataRowUnit, index) => (
            <tr key={index}>
              {Object.values(row).map((value, i) => (
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
