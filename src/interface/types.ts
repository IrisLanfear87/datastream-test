import type { PhysicalProperties, Units } from "../constants/constants";

export type CharacteristicName = typeof PhysicalProperties.WATER_TEMPERATURE;
export type Unit = typeof Units.DEGREES_CELSIUS;

export type ParsedCsvDataResults = {
  [MonitoringLocationID: string]: CSVDataRowUnit[];
};

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

type MonitoringLocationID = string;
type AverageResultValue = string;

export type TabularDataUnit = [
  MonitoringLocationID,
  CharacteristicName,
  AverageResultValue,
  Unit
];

export type ResultTableProps = {
  content: TabularDataUnit[] | null;
};

export type CSVInputProps = {
  onUpload: (file: File) => void;
};
