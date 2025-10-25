import { PhysicalProperties } from "../constants/constants";
import type { CSVDataRowUnit } from "../interface/types";

export function filterNonWaterTempRows(
  row: Papa.ParseStepResult<CSVDataRowUnit>,
  result: CSVDataRowUnit[]
) {
  const { MonitoringLocationID, CharacteristicName, ResultValue, ResultUnit } =
    row.data;

  if (CharacteristicName === PhysicalProperties.WATER_TEMPERATURE) {
    result.push({
      MonitoringLocationID,
      CharacteristicName,
      ResultValue,
      ResultUnit,
    });
  }
}
