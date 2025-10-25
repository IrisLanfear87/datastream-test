import { PhysicalProperties } from "../constants/constants";
import { ROW_ERROR_MESSAGE } from "../constants/copy";
import type { CSVDataRowUnit, RowParsingError } from "../interface/types";

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
