import React from "react";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CsvUploader from "../CsvUploader";
import type { CSVInputProps } from "../../../interface/types";

describe("CsvUploader Component", () => {
  let mockHandleParsing: jest.MockedFunction<CSVInputProps["onUpload"]>;

  beforeEach(() => {
    mockHandleParsing = jest.fn();
  });

  it("should render the component with correct copy", () => {
    render(<CsvUploader onUpload={mockHandleParsing} />);

    const titleText = screen.getByText("Choose a dataset to parse");
    expect(titleText).toBeTruthy();
  });

  it("should have accept='.csv' attribute on input", () => {
    render(<CsvUploader onUpload={mockHandleParsing} />);

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    expect(fileInput).toBeTruthy();
    expect(fileInput.getAttribute("accept")).toBe(".csv");
  });

  it("should call handleParsing when a valid CSV file is selected", async () => {
    const user = userEvent.setup();
    render(<CsvUploader onUpload={mockHandleParsing} />);

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    const csvFile = new File(["name,age\nJohn,30\nJane,25"], "test.csv", {
      type: "text/csv",
    });

    await user.upload(fileInput, csvFile);

    expect(mockHandleParsing).toHaveBeenCalledTimes(1);
  });
});
