import {
  NOT_AVAILABLE,
  PhysicalProperties,
  Units,
} from "../constants/constants";
import { ROW_ERROR_MESSAGE } from "../constants/copy";
import type {
  CSVDataRowUnit,
  ParsedCsvDataResults,
  RowParsingError,
  TabularDataUnit,
} from "../interface/types";

export function filterNonWaterTempRows(
  row: Papa.ParseStepResult<CSVDataRowUnit>,
  result: ParsedCsvDataResults,
  errors: RowParsingError[]
) {
  try {
    const {
      MonitoringLocationID,
      CharacteristicName,
      ResultValue,
      ResultUnit,
    } = row.data;

    if (result[MonitoringLocationID] === undefined) {
      result[MonitoringLocationID] = [];
    }

    if (CharacteristicName !== PhysicalProperties.WATER_TEMPERATURE) return;

    result[MonitoringLocationID].push({
      MonitoringLocationID,
      CharacteristicName,
      ResultValue,
      ResultUnit,
    });
  } catch (error) {
    errors.push({
      message: ROW_ERROR_MESSAGE,
      row,
      originalError: error,
    });
  }
}

function calculateAvg(values: CSVDataRowUnit[]): string | null {
  if (values.length === 0) return null;

  let numberOfValidTerms = values.length;
  const sum = values.reduce((acc, curr) => {
    const currentNumericValue = parseFloat(curr.ResultValue);
    let currentTerm = 0;

    if (isNaN(currentNumericValue)) {
      numberOfValidTerms--;
    } else {
      currentTerm = currentNumericValue;
    }

    return acc + currentTerm;
  }, 0);

  return (sum === 0 ? sum : sum / numberOfValidTerms).toFixed(2);
}

export function calculateTabularData(
  aggregatedByLocationId: ParsedCsvDataResults
): TabularDataUnit[] {
  const tabularData = [] as TabularDataUnit[];

  for (const location in aggregatedByLocationId) {
    const tableRowInitData: TabularDataUnit = [
      location,
      PhysicalProperties.WATER_TEMPERATURE,
      NOT_AVAILABLE,
      Units.DEGREES_CELSIUS,
    ];

    if (aggregatedByLocationId[location].length) {
      const averageResultValuePerLocation = calculateAvg(
        aggregatedByLocationId[location]
      );

      tableRowInitData[2] =
        averageResultValuePerLocation === null
          ? NOT_AVAILABLE
          : averageResultValuePerLocation;
    }

    tabularData.push(tableRowInitData);
  }
  return tabularData;
}
