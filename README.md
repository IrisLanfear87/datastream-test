# Water Temperature Average Calculator

A React application that processes CSV datasets containing water temperature measurements and calculates average values grouped by monitoring location.

## Original Task Description

### Assignment Overview

Create an app using SvelteKit (preferred) or another JS framework with the functionality
listed below. Assume this code will be integrated into an existing application and will be
maintained and updated by others in the future.

### Requirements

- There should be a CSV file input
- The file should be processed client-side
- From the CSV file, calculate the average of “ResultValue” where “CharacteristicName" is equal to "Temperature, water” for any “MonitoringLocationID” input
- Display the result

## 📋 Overview

This application allows users to upload CSV files containing water temperature data and automatically:

- Filters for water temperature measurements only
- Groups data by monitoring location ID
- Calculates average temperature values per location
- Handles mixed units and data validation
- Displays results in a clean, tabular format

## 🛠 Technology Stack

- **React 19.1.1** with TypeScript
- **Vite** for build tooling and development server
- **PapaParse** for CSV file processing
- **CSS modules** for component styling
- **Jest** with React Testing Library for testing
- **ESLint** for code quality

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone and navigate to the project directory**

   ```bash
   cd react_datastream_test_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Running the Application in Development Mode

```bash
npm run dev
```

The application will start on [http://localhost:5173](http://localhost:5173)

## 🌐 Viewing the Application In the Browser

1. **Navigate to** [http://localhost:5173](http://localhost:5173)
2. **Upload a CSV file** using the file input (accepts .csv files only)
   Example files can be found here:
   https://doi.org/10.25976/vahx-dq27
   https://doi.org/10.25976/3vfm-jp51
3. **View results** in the table below, or error messages if processing fails

## Expected CSV Format

The application expects CSV files with the following columns:

- `MonitoringLocationID` - Identifier for monitoring location
- `CharacteristicName` - Type of measurement (filters for "Temperature, water")
- `ResultValue` - Temperature value
- `ResultUnit` - Unit of measurement (e.g., "deg C", "deg F")

## 🧪 Testing

### Run All Tests

```bash
npm test
```
