// Global Logs Schema
import moment from "moment";

// Fixed Lengths
export const MAX_LABEL_LEN = 22;
export const MIN_LABEL_LEN = 4;
export const MAX_DESC_LEN = 60;
export const MIN_DESC_LEN = 12;

export const parseLogEntry = (
  label: string,
  description: string,
): Error | object => {
  // gets current time of log entry
  const timestamp = moment().format("MMMM Do YYYY, h:mm:ss a");

  // validate input length
  if (label.length > MAX_LABEL_LEN) {
    return new Error("Label is longer than required length!");
  }

  if (label.length < MIN_LABEL_LEN) {
    return new Error("Label is shorter than required length!");
  }

  if (description.length > MAX_DESC_LEN) {
    return new Error("Description is longer than required length!");
  }

  if (description.length < MIN_DESC_LEN) {
    return new Error("Description is shorter than required length!");
  }

  // parsing params in object
  const logObject = {
    label: label,
    description: description,
    timestamp: timestamp,
  };

  return logObject;
};
