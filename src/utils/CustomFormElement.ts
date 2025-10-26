import type { FormItemAtrribute } from "@/types/form";
import { LitElement, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";

export abstract class CustomFormElement<T = string> extends LitElement {
  @property({ type: Object }) opt: Partial<FormItemAtrribute<T>> = {};
  @property({ type: String }) direction: "vertical" | "horizontal" =
    "horizontal";

  @state() value?: T = this.opt.value;
  @state() error?: string;

  get name(): string {
    return this.opt?.name ?? "";
  }

  get options(): Array<T> {
    return Array.isArray(this.opt?.options) ? this.opt?.options : [];
  }

  firstUpdated(_changedProperties: PropertyValues<CustomFormElement<T>>) {
    super.firstUpdated(_changedProperties);
    this.validate();
  }

  willUpdate(_changedProperties: PropertyValues<CustomFormElement<T>>) {
    super.willUpdate(_changedProperties);
    if (_changedProperties.has("opt")) {
      this.value = this.opt?.value;
    }
    // TODO: maybe validate inside of each component whenever value changed instead of detect value change here
    if (_changedProperties.has("value")) {
      this.validate();
    }
  }

  clear = (value: T, callback: () => void) => {
    this.value = value;
    typeof callback === "function" && callback();
  };

  validate = (validator?: (value?: T) => boolean) => {
    this.error = "";
    const { disabled, required } = this.opt || {};
    if (disabled) return true;
    if (
      required &&
      !(Array.isArray(this.value) ? this.value.length : this.value)
    ) {
      this.error = "Please fill this mandatory field";
      return false;
    }
    return typeof validator !== "function" || validator(this.value);
  };
}
