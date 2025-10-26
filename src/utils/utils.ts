import { PhysicalProperties } from "../constants/constants";
import { ROW_ERROR_MESSAGE } from "../constants/copy";
import type {
  AggregatedTabularData,
  CSVDataRowUnit,
  ResultTableProps,
  RowParsingError,
  TabularDataUnit,
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
    );
  }

  return aggregatedByLocationId;
}

export function formatTabularData(
  calculatedTabularData: AggregatedTabularData
): ResultTableProps {
  const header = [] as string[];
  const content = [] as TabularDataUnit[];

  Object.entries(calculatedTabularData).map(([key, value]) => {
    header.push(key);
    content.push(value);
  });

  return {
    header,
    content,
  };
}
