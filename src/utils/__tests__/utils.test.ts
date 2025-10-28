import { describe, it, expect, beforeEach } from "@jest/globals";
import {
  filterNonWaterTempRows,
  calculateAvg,
  deduplicateUnits,
  calculateTabularData,
} from "../utils";
import {
  mockWaterTempRow1,
  mockWaterTempRow2,
  mockNonWaterTempRow,
  mockWaterTempRowDifferentLocation,
  mockInvalidRow,
  mockRowWithMissingResultFields,
  mockRowWithMissingLocation,
  mockValidTemperatureValues,
  mockMixedValues,
  mockAllInvalidValues,
  mockZeroTemperatureValues,
  mockDecimalPrecisionValues,
  mockNegativeTemperatureValues,
  mockDecimalTemperatureValues,
  mockZeroSumTempValues,
  mockSingleUnitValue,
  mockMultipleUnitsValues,
  mockDuplicateUnitsValues,
  mockSingleUnitValues,
  mockInvalidUnitsValues,
} from "../mockData";
import type {
  CSVDataRowUnit,
  ParsedCsvDataResults,
  RowParsingError,
} from "../../interface/types";
import type { ParseStepResult } from "papaparse";

// This file will contain tests for utils.ts functions:
// - filterNonWaterTempRows
// - calculateAvg
// - deduplicateUnits
// - calculateTabularData

describe("Utils Functions", () => {
  describe("filterNonWaterTempRows", () => {
    let result: ParsedCsvDataResults;
    let errors: RowParsingError[];

    beforeEach(() => {
      result = {};
      errors = [];
    });

    it("should filter and add water temperature rows to result", () => {
      filterNonWaterTempRows(mockWaterTempRow1, result, errors);

      expect(result["RivTemp-Qc-16-75"]).toHaveLength(1);
      expect(result["RivTemp-Qc-16-75"][0]).toEqual({
        MonitoringLocationID: "RivTemp-Qc-16-75",
        CharacteristicName: "Temperature, water",
        ResultValue: "14.6",
        ResultUnit: "deg C",
      });
      expect(errors).toHaveLength(0);
    });

    it("should ignore rows that are not 'Temperature, water', but create a location key if there was none", () => {
      filterNonWaterTempRows(mockNonWaterTempRow, result, errors);

      expect(Object.keys(result)).toHaveLength(1);
      expect(Array.isArray(result["WS"])).toBe(true);
      expect(result["WS"]).toHaveLength(0);
      expect(errors).toHaveLength(0);
    });

    it("should handle multiple rows for the same monitoring location", () => {
      filterNonWaterTempRows(mockWaterTempRow1, result, errors);
      filterNonWaterTempRows(mockWaterTempRow2, result, errors);

      expect(result["RivTemp-Qc-16-75"]).toHaveLength(2);
      expect(result["RivTemp-Qc-16-75"][0].ResultValue).toBe("14.6");
      expect(result["RivTemp-Qc-16-75"][1].ResultValue).toBe("16.2");
      expect(errors).toHaveLength(0);
    });

    it("should handle multiple monitoring locations", () => {
      // Test that rows from multiple locations are stored separately
      filterNonWaterTempRows(mockWaterTempRow1, result, errors);
      filterNonWaterTempRows(mockWaterTempRowDifferentLocation, result, errors);

      expect(Object.keys(result)).toHaveLength(2);
      expect(result["RivTemp-Qc-16-75"]).toHaveLength(1);
      expect(result["RivTemp-Qc-17-80"]).toHaveLength(1);
      expect(result["RivTemp-Qc-16-75"][0].ResultValue).toBe("14.6");
      expect(result["RivTemp-Qc-17-80"][0].ResultValue).toBe("18.5");
      expect(errors).toHaveLength(0);
    });

    it("should initialize location array if it does not exist", () => {
      // Test whether new monitoring locations get properly initialized in the result object
      expect(result["RivTemp-Qc-16-75"]).toBeUndefined();

      filterNonWaterTempRows(mockWaterTempRow1, result, errors);

      expect(result["RivTemp-Qc-16-75"]).toBeDefined();
      expect(Array.isArray(result["RivTemp-Qc-16-75"])).toBe(true);
      expect(result["RivTemp-Qc-16-75"]).toHaveLength(1);
    });

    it("should handle parsing errors gracefully", () => {
      filterNonWaterTempRows(
        mockInvalidRow as unknown as ParseStepResult<CSVDataRowUnit>,
        result,
        errors
      );

      expect(Object.keys(result)).toHaveLength(0);
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe("missing or empty data row");
      expect(errors[0].originalError).toBeDefined();
    });

    it("should add error to the errors array when location id is missing", () => {
      filterNonWaterTempRows(
        mockRowWithMissingLocation as unknown as ParseStepResult<CSVDataRowUnit>,
        result,
        errors
      );

      expect(Object.keys(result)).toHaveLength(0);
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe("missing location ID");
    });

    it("should add error to the errors array when result fields are missing, but create a location key", () => {
      filterNonWaterTempRows(
        mockRowWithMissingResultFields as unknown as ParseStepResult<CSVDataRowUnit>,
        result,
        errors
      );

      expect(Object.keys(result)).toHaveLength(1);
      expect(result["TEST-LOC-001"]).toBeDefined();
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe("missing necessary data properties");
    });
  });

  describe("calculateAvg", () => {
    it("should return null for empty array", () => {
      const result = calculateAvg([]);
      expect(result).toBeNull();
    });

    it("should return null for no array", () => {
      const result = calculateAvg(null as unknown as CSVDataRowUnit[]);
      expect(result).toBeNull();
    });

    it("should calculate correct average for valid numeric values", () => {
      const result = calculateAvg(mockValidTemperatureValues);
      expect(result).toBe("25.00");
    });

    it("should ignore invalid numeric values and calculate average from valid ones", () => {
      const result = calculateAvg(mockMixedValues);
      expect(result).toBe("25.00");
    });

    it("should return null when all values are invalid", () => {
      const result = calculateAvg(mockAllInvalidValues);
      expect(result).toBe(null);
    });

    it("should return 0.00 if all temperature values are 0", () => {
      const result = calculateAvg(mockZeroTemperatureValues);
      expect(result).toBe("0.00");
    });

    it("should return 0.00 if temperature values sum up to 0", () => {
      const result = calculateAvg(mockZeroSumTempValues);
      expect(result).toBe("0.00");
    });

    it("should format result to 2 decimal places", () => {
      const result = calculateAvg(mockDecimalPrecisionValues);
      expect(result).toBe("26.00"); // Average of 25.333333 and 26.666667 rounded to 2 decimal places
    });

    it("should handle negative temperature values", () => {
      const result = calculateAvg(mockNegativeTemperatureValues);
      expect(result).toBe("-10.00"); // Average of -5.0 and -15.0
    });

    it("should handle decimal temperature values", () => {
      const result = calculateAvg(mockDecimalTemperatureValues);
      expect(result).toBe("16.67"); // Average of 12.5, 17.3, and 20.2
    });
  });

  describe("deduplicateUnits", () => {
    it("should return empty array for empty input", () => {
      const result = deduplicateUnits([]);
      expect(result).toEqual([]);
    });

    it("should return single unit when all values have the same unit", () => {
      const result = deduplicateUnits(mockSingleUnitValues);
      expect(result).toEqual(["deg C"]);
    });

    it("should return multiple unique units when values have different units", () => {
      const result = deduplicateUnits(mockMultipleUnitsValues);
      expect(result).toHaveLength(3);
      expect(result).toContain("deg C");
      expect(result).toContain("deg F");
      expect(result).toContain("deg K");
    });

    it("should deduplicate units when there are duplicates", () => {
      const result = deduplicateUnits(mockDuplicateUnitsValues);
      expect(result).toHaveLength(2);
      expect(result).toContain("deg C");
      expect(result).toContain("deg F");
    });

    it("should return a single unit when passed an array with a single elment", () => {
      const result = deduplicateUnits(mockSingleUnitValue);
      expect(result).toEqual(["deg C"]);
    });

    it("should return an empty array if no valid unit values are provided", () => {
      const result = deduplicateUnits(
        mockInvalidUnitsValues as CSVDataRowUnit[]
      );
      expect(result).toEqual([]);
    });
  });

  describe("calculateTabularData", () => {
    it("should return empty array for empty input object", () => {
      const result = calculateTabularData({});
      expect(result).toEqual([]);
    });

    it("should handle single location with single unit", () => {
      // Test: calculateTabularData({ LOC001: mockSingleUnitValues }) should return correct tabular row
      const result = calculateTabularData({ LOC001: mockSingleUnitValues });
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual([
        "LOC001",
        "Temperature, water",
        "25.00",
        "deg C",
      ]);
    });
  });
});
