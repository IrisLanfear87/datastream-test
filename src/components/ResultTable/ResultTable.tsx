import type { ResultTableProps } from "../../interface/types";

const ResultTable = ({ header, content }: ResultTableProps) => {
  console.log(content);
  return (
    <div>
      <h3>Table lalalalalal</h3>
      <table>
        <thead>
          <tr>
            {header.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {content.map((row: (string | number)[], index) => (
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
