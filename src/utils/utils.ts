import { PhysicalProperties } from "../constants/constants";
import { ROW_ERROR_MESSAGE } from "../constants/copy";
import type {
  AggregatedTabularData,
  CSVDataRowUnit,
  ResultTableProps,
  RowParsingError,
} from "../interface/types";

export function filterNonWaterTempRows(
  row: Papa.ParseStepResult<CSVDataRowUnit>,
  result: CSVDataRowUnit[],
  errors: RowParsingError[]
) {
  try {
    const {
      MonitoringLocationID,
      CharacteristicName,
      ResultValue,
      ResultUnit,
    } = row.data;

    if (CharacteristicName === PhysicalProperties.WATER_TEMPERATURE) {
      result.push({
        MonitoringLocationID,
        CharacteristicName,
        ResultValue,
        ResultUnit,
      });
    }
  } catch (error) {
    errors.push({
      message: ROW_ERROR_MESSAGE,
      row,
      originalError: error,
    });
  }
}

function calculateAvg(values: string[]) {
  if (values.length === 0) return 0;

  let numberOfValidTerms = values.length;
  const sum = values.reduce((acc, curr) => {
    const currentNumericValue = parseFloat(curr);
    let currentTerm = 0;

    if (isNaN(currentNumericValue)) {
      numberOfValidTerms--;
    } else {
      currentTerm = currentNumericValue;
    }

    return acc + currentTerm;
  }, 0);

  if (sum === 0) return sum;

  return sum / numberOfValidTerms;
}

export function calculateTabularData(
  parsedResults: CSVDataRowUnit[]
): AggregatedTabularData {
  const aggregatedByLocationId = {} as AggregatedTabularData;

  parsedResults.forEach(
    ({
      MonitoringLocationID,
      CharacteristicName,
      ResultValue,
      ResultUnit,
    }: CSVDataRowUnit) => {
      if (aggregatedByLocationId[MonitoringLocationID]) {
        aggregatedByLocationId[MonitoringLocationID].ResultValues.push(
          ResultValue
        );
      } else {
        aggregatedByLocationId[MonitoringLocationID] = {
          MonitoringLocationID,
          ResultValues: [ResultValue],
          CharacteristicName,
          ResultUnit,
          AverageResultValue: 0,
        };
      }
    }
  );

  for (const location in aggregatedByLocationId) {
    aggregatedByLocationId[location].AverageResultValue = calculateAvg(
      aggregatedByLocationId[location].ResultValues
    ).toFixed(2);
  }

  return aggregatedByLocationId;
}

export function formatTabularData(
  calculatedTabularData: AggregatedTabularData
): ResultTableProps {
  let header = [] as string[];
  const content = [] as (string | number)[][];

  Object.values(calculatedTabularData).map((tabularDataUnit) => {
    const { ResultValues, ...rest } = tabularDataUnit;
    if (!header.length) {
      header = [...Object.keys(rest)].map((el) => separateWords(el));
    }
    content.push(Object.values(rest));
  });

  return {
    header,
    content,
  };
}

function separateWords(inputString: string): string {
  if (!inputString || typeof inputString !== "string") {
    return inputString;
  }

  return inputString
    .replace(/([a-z])([A-Z][a-z])/g, "$1 $2")
    .replace(/(?!^)([A-Z]{2,})/g, " $1")
    .trim();
}
