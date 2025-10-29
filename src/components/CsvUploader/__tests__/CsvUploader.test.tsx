import React from "react";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";

import CsvUploader from "../CsvUploader";
import type { CSVInputProps } from "../../../interface/types";

describe("CsvUploader Component", () => {
  let mockHandleParsing: jest.MockedFunction<CSVInputProps["handleParsing"]>;

  beforeEach(() => {
    mockHandleParsing = jest.fn();
  });

  it("should render the component", () => {
    render(<CsvUploader handleParsing={mockHandleParsing} />);

    const titleText = screen.getByText("Choose a dataset to parse");
    expect(titleText).toBeTruthy();
  });
});
