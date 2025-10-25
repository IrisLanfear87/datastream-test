import { PhysicalProperties, Units } from "../../constants/constants";

export type CSVDataRowUnit = {
  CharacteristicName: typeof PhysicalProperties.WATER_TEMPERATURE;
  MonitoringLocationID: string;
  ResultUnit: typeof Units.DEGREES_CELSIUS;
  ResultValue: string;
};
