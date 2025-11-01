import type { FormItemAtrribute, Option } from "@/types/form";
import { html, LitElement, type PropertyValues } from "lit";
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

  get required(): boolean {
    return !!this.opt?.required && !this.opt?.disabled;
  }

  get options(): Array<Option<T>> {
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
      this.validate();
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
    if (this.opt?.disabled) return true;
    if (
      this.required &&
      !(Array.isArray(this.value) ? this.value.length : this.value)
    ) {
      this.error = "Please fill this mandatory field";
      return false;
    }
    return typeof validator !== "function" || validator(this.value);
  };

  scrollToTarget = (
    selector: Array<string> | string,
    length: number = this.options.length,
    options?: ScrollIntoViewOptions
  ) => {
    if (!selector || length < (this.opt?.minLength || 0)) return;
    this.updateComplete.then(() => {
      if (!this.shadowRoot || !selector) return;
      const selectorName = !Array.isArray(selector)
        ? selector
        : selector.find((it) => it && this.shadowRoot?.querySelector(it));
      selectorName &&
        this.shadowRoot.querySelector(selectorName)?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          ...options,
        });
    });
  };

  renderError = () => {
    if (!this.error) return "";
    return html`<span part="error" class="error color">${this.error}</span>`;
  };
}
