import {
  MIXED_UNITS,
  NO_DATA,
  NOT_AVAILABLE,
  PhysicalProperties,
} from "../constants/constants";
import { ROW_ERROR_MESSAGE } from "../constants/copy";
import type {
  CSVDataRowUnit,
  ParsedCsvDataResults,
  RowParsingError,
  TabularDataUnit,
  Unit,
} from "../interface/types";

export function filterNonWaterTempRows(
  row: Papa.ParseStepResult<CSVDataRowUnit>,
  result: ParsedCsvDataResults,
  errors: RowParsingError[]
) {
  try {
    if (!row || !row?.data) {
      throw new Error("missing or empty data row");
    }

    const {
      MonitoringLocationID,
      CharacteristicName,
      ResultValue,
      ResultUnit,
    } = row.data;

    if (!MonitoringLocationID) {
      throw new Error("missing location ID");
    }

    if (result[MonitoringLocationID] === undefined) {
      result[MonitoringLocationID] = [];
    }

    if (CharacteristicName !== PhysicalProperties.WATER_TEMPERATURE) return;

    if (!ResultValue || !ResultUnit) {
      throw new Error("missing necessary data properties");
    }

    result[MonitoringLocationID].push({
      MonitoringLocationID,
      CharacteristicName,
      ResultValue,
      ResultUnit,
    });
  } catch (error) {
    errors.push({
      message: error instanceof Error ? error.message : ROW_ERROR_MESSAGE,
      row,
      originalError: error,
    });
  }
}

export function calculateAvg(values: CSVDataRowUnit[]): string | null {
  if (!values || values.length === 0) return null;

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

  if (numberOfValidTerms === 0) return null;

  return (sum === 0 ? sum : sum / numberOfValidTerms).toFixed(2);
}

export function deduplicateUnits(values: CSVDataRowUnit[]): Unit[] {
  const unitSet = values.reduce((acc, curr) => {
    acc.add(curr.ResultUnit);
    return acc;
  }, new Set<Unit>());

  return [...unitSet].filter(Boolean);
}

export function calculateTabularData(
  aggregatedByLocationId: ParsedCsvDataResults
): TabularDataUnit[] {
  const tabularData = [] as TabularDataUnit[];

  for (const location in aggregatedByLocationId) {
    const tableRowInitData: TabularDataUnit = [
      location,
      PhysicalProperties.WATER_TEMPERATURE,
      NO_DATA,
      NOT_AVAILABLE,
    ];

    const uniqueUnits = deduplicateUnits(aggregatedByLocationId[location]);

    if (uniqueUnits.length > 1) {
      tableRowInitData[3] = MIXED_UNITS;

      tabularData.push(tableRowInitData);
      continue;
    }

    if (aggregatedByLocationId[location].length) {
      const averageResultValuePerLocation = calculateAvg(
        aggregatedByLocationId[location]
      );

      tableRowInitData[2] =
        averageResultValuePerLocation === null
          ? NOT_AVAILABLE
          : averageResultValuePerLocation;

      tableRowInitData[3] = uniqueUnits[0];
    }

    tabularData.push(tableRowInitData);
  }
  return tabularData;
}
