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
  pattern: string;
  // input radio, input checkbox, select, multi-select
  checked: boolean;
  cancelable: boolean;
  options: Array<T>;
  filterablea: boolean;
};
