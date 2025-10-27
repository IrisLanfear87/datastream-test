import styles from "./ErrorDisplay.module.css";
import {
  GENERIC_ERROR_MESSAGE,
  COUNT_ERROR_MESSAGE,
  COUNT_PLACEHOLDER,
} from "../../constants/copy";

interface ErrorDisplayProps {
  errorCount: number;
}

const ErrorDisplay = ({ errorCount }: ErrorDisplayProps) => {
  const { errorContainer, errorMessage } = styles;

  return (
    <div className={errorContainer}>
      <p className={errorMessage}>{GENERIC_ERROR_MESSAGE}</p>
      <p className={errorMessage}>
        {COUNT_ERROR_MESSAGE.replace(COUNT_PLACEHOLDER, `${errorCount}`)}
      </p>
    </div>
  );
};

export default ErrorDisplay;
