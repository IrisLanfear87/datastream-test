import type { PhysicalProperties, Units } from "../constants/constants";

export type CharacteristicName = typeof PhysicalProperties.WATER_TEMPERATURE;
export type Unit = typeof Units.DEGREES_CELSIUS;

export type CSVDataRowUnit = {
  CharacteristicName: CharacteristicName;
  MonitoringLocationID: string;
  ResultUnit: Unit;
  ResultValue: string;
};

export type RowParsingError = {
  message: string;
  row?: Papa.ParseStepResult<CSVDataRowUnit>;
  originalError?: unknown;
};

export type TabularDataUnit = {
  MonitoringLocationID: string;
  ResultValues: string[];
  CharacteristicName: CharacteristicName;
  ResultUnit: Unit;
  AverageResultValue: string | number;
};

export type AggregatedTabularData = {
  [MonitoringLocationID: string]: TabularDataUnit;
};

export type ResultTableProps = {
  header: string[];
  content: (string | number)[][];
};
