import { LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { CustomFormElement } from "./CustomFormElement";

export abstract class BaseForm<
  T extends Record<string, number | string | boolean | undefined>
> extends LitElement {
  formElementSeletor: string = FORM_ELEMENTS;

  @property() initialForm?: T;

  @state() formData: Partial<T> = this.initialForm || {};

  get formElements(): Array<CustomFormElement | HTMLInputElement> {
    return Array.from(
      this.renderRoot?.querySelectorAll?.(this.formElementSeletor)
    );
  }

  get validFormData() {
    let result = {};
    this.formElements.forEach((element) => {
      if (element.name) {
        Object.assign(result, { [element.name]: element.value });
        element instanceof CustomFormElement
          ? element.validate()
          : element.checkValidity();
      }
    });
    return result;
  }

  validateAll = () =>
    this.formElements
      .filter((it) =>
        it.checkVisibility()
          ? it.checkVisibility()
          : it.scrollHeight * it.scrollWidth > 0
      )
      .every((it) =>
        it instanceof CustomFormElement ? it.validate() : it.checkValidity()
      );
}

// NOTE: append custom defined form element component name to ensure BaseForm scan form data
export const FORM_ELEMENTS = "input,select,textarea,custom-test-input";
