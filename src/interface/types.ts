import type { PhysicalProperties, Units } from "../constants/constants";

export type CSVDataRowUnit = {
  CharacteristicName: typeof PhysicalProperties.WATER_TEMPERATURE;
  MonitoringLocationID: string;
  ResultUnit: typeof Units.DEGREES_CELSIUS;
  ResultValue: string;
};

export type ResultTableProps = {
  heading: string;
  data: CSVDataRowUnit[];
};

export type RowParsingError = {
  message: string;
  row?: Papa.ParseStepResult<CSVDataRowUnit>;
  originalError?: unknown;
};
