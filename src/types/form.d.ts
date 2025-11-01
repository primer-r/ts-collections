export type FormItemAtrribute<T> = {
  name: string;
  value: T;
  type: "text" | "select" | "textarea" | "checkbox" | "radio" | "multi-select";
  required: boolean;
  disabled: boolean;
  placeholder: string;
  // input text, textarea
  min: number;
  max: number;
  maxLength: number;
  minLength: number;
  pattern: string;
  // input radio, input checkbox, select, multi-select
  checked: boolean;
  cancelable: boolean;
  options: Array<Option<T>>;
  filterable: boolean;
  cancelable: boolean;
  label: string;
  showTitle: boolean;
};

export type Option<T = string> = Pick<FormItemAtrribute, "label" | "value">;
