import { describe, it, expect, beforeEach } from "@jest/globals";
import { filterNonWaterTempRows } from "../utils";
import {
  mockWaterTempRow1,
  mockWaterTempRow2,
  mockNonWaterTempRow,
  mockWaterTempRowDifferentLocation,
  mockInvalidRow,
  mockRowWithMissingFields,
} from "./mockData";
import type {
  CSVDataRowUnit,
  ParsedCsvDataResults,
  RowParsingError,
} from "../../interface/types";
import type { ParseStepResult } from "papaparse";

// Test file for utils.ts functions
// This file will contain tests for:
// - filterNonWaterTempRows
// - calculateTabularData
// - calculateAvg (if made public)

describe("Utils Functions", () => {
  describe("filterNonWaterTempRows", () => {
    let result: ParsedCsvDataResults;
    let errors: RowParsingError[];

    beforeEach(() => {
      result = {};
      errors = [];
    });

    it("should filter and add water temperature rows to result", () => {
      // Test that valid water temperature rows are added to the result object
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

    it("should ignore non-water temperature rows", () => {
      // Test that rows with different CharacteristicName are ignored
      filterNonWaterTempRows(mockNonWaterTempRow, result, errors);

      expect(Object.keys(result)).toHaveLength(0);
      expect(result["WS"]).toBeUndefined();
      expect(errors).toHaveLength(0);
    });

    it("should handle multiple rows for the same monitoring location", () => {
      // Test that multiple water temp readings for same location are properly accumulated
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
      // Test that new monitoring locations get properly initialized in result object
      expect(result["RivTemp-Qc-16-75"]).toBeUndefined();

      filterNonWaterTempRows(mockWaterTempRow1, result, errors);

      expect(result["RivTemp-Qc-16-75"]).toBeDefined();
      expect(Array.isArray(result["RivTemp-Qc-16-75"])).toBe(true);
      expect(result["RivTemp-Qc-16-75"]).toHaveLength(1);
    });

    it("should handle parsing errors gracefully", () => {
      // Test error handling when row data is malformed or missing
      filterNonWaterTempRows(
        mockInvalidRow as unknown as ParseStepResult<CSVDataRowUnit>,
        result,
        errors
      );

      expect(Object.keys(result)).toHaveLength(0);
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe("missing necessary data");
      expect(errors[0]).toBe(mockInvalidRow);
      expect(errors[0].originalError).toBeDefined();
    });

    it("should add errors to the errors array when exceptions occur", () => {
      // Test that parsing errors are properly captured and stored
      filterNonWaterTempRows(
        mockRowWithMissingFields as unknown as ParseStepResult<CSVDataRowUnit>,
        result,
        errors
      );

      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe(mockInvalidRow);
      expect(errors[0].message).toBe("missing necessary data");
    });
  });
});
