import type { Option } from "@/types/form";
import { CustomFormElement } from "@/utils/CustomFormElement";
import { concatBy } from "@/utils/formatter";
import { html, unsafeCSS, type PropertyValueMap } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { dispatchCustomEvent } from "@/utils/event";
import indexCss from "@/components/CustomSingleSelection/index.css?inline";

const defaultOption: Option = { label: "", value: "" };

@customElement("custom-single-selection")
export class CustomSingleSelection extends CustomFormElement {
  @query("input") $input?: HTMLInputElement;

  @state() expanded: boolean = false;
  @state() keyword: string = "";
  @state() highlightedIndex: number = -1;
  @state() targetOption: Option = defaultOption;

  get filteredOptions() {
    if (!this.options?.length) return [];
    if (this.disableFilter || !this.keyword) return this.options;
    const regExp = new RegExp(
      this.keyword.replace(/[.*+?^${}()|\]\\]/g, "\\$&"), // NOTE: convert regular expression meta character to literal text
      "i"
    ); // NOTE: case insensitive fuzzy search by name
    return this.options.filter(({ label }) => regExp.test(label));
  }

  get noOptions() {
    return !Array.isArray(this.options) || !this.options.length;
  }

  get disableFilter() {
    return this.opt?.disabled || !this.opt?.filterable || this.noOptions;
  }

  get required(): boolean {
    return !!this.opt?.required && !this.opt?.disabled && !this.noOptions;
  }

  connectedCallback() {
    super.connectedCallback();
    document.body.addEventListener("click", this.#handleOutsideClick);
  }

  willUpdate(_changedProperties: PropertyValueMap<CustomSingleSelection>) {
    super.willUpdate(_changedProperties);
    if (_changedProperties.has("value") || _changedProperties.has("options")) {
      if (this.targetOption.value === this.value) return;
      this.targetOption =
        this.options?.find(({ value }) => value === this.value) ||
        defaultOption;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.body.removeEventListener("click", this.#handleOutsideClick);
  }

  render = () => {
    if (!Array.isArray(this.opt?.options) && !this.value) return "";

    return html`<div name=${this.name}>
      <div
        part="up"
        class="up${concatBy("error border color", this.error)}${concatBy(
          "disabled",
          this.opt?.disabled
        )}"
        @click=${this.disableFilter ? this.toggle : undefined}
      >
        <slot name="pre"></slot>
        ${this.disableFilter
          ? html`<output
              part="content single-line"
              class="content flex-1"
              name=${this.name}
              title=${this.opt.showTitle
                ? this.noOptions
                  ? this.value
                  : this.targetOption.label
                : ""}
            >
              ${this.noOptions ? this.value : this.targetOption.label}
            </output>`
          : html`<input
              class="content flex-1"
              part="content"
              name=${this.name}
              placeholder=${this.opt?.placeholder || ""}
              type="text"
              .value=${this.targetOption.label}
              @focus=${this.open}
              @input=${this.filter}
              @keydown=${this.#handleKeyDown}
            />`}
        <slot name="post">
          <span
            class="icon"
            @click=${this.disableFilter ? undefined : this.toggle}
            >${unsafeSVG(this.expanded ? "▲" : "▼")}</span
          >
        </slot>
      </div>
      <div
        part="down"
        class="down${concatBy("none", !this.expanded)}${concatBy(
          "disabled",
          this.opt.disabled
        )}"
      >
        <slot name="top"></slot>
        <ul part="ul">
          ${(() => {
            if (this.noOptions) return html`<li part="li">No options</li>`;
            if (!this.filteredOptions.length) {
              return html`<li part="li">No results found</li>`;
            }
            return this.filteredOptions.map(
              (option, index) =>
                html`<li
                  part="li"
                  class="${concatBy(
                    "active",
                    this.targetOption.value == option.value
                  )}${concatBy(
                    "highlighted",
                    this.highlightedIndex === index
                  )}${concatBy("disabled", this.opt.disabled)}"
                  title=${this.opt.showTitle ? option.label : ""}
                  @click=${() => this.select(option)}
                >
                  ${option.label}
                </li>`
            );
          })()}
        </ul>
        <slot name="bottom"></slot>
      </div>
      ${this.renderError()}
    </div>`;
  };

  select = (option?: Option) => {
    if (this.opt.disabled) return;
    if (!(option && "value" in option)) return;
    const isSame = this.value === option.value;
    if (!this.opt.required && this.opt.cancelable) {
      return this.dispatch(isSame ? defaultOption : option);
    }
    return !isSame && this.dispatch(option);
  };

  dispatch = (target: Option) => {
    this.value = target.value;
    this.targetOption = target;
    dispatchCustomEvent(this, "change", target);
    this.close();
  };

  filter = ({ target }: Event) => {
    if (this.disableFilter) return;
    this.keyword = (target as HTMLInputElement)?.value?.trim();
  };

  close = () => {
    if (!this.expanded) return;
    this.expanded = false;
    this.highlightedIndex = -1;
    if (this.disableFilter) return;
    this.keyword = "";
    if (this.$input) {
      this.$input.value = this.targetOption.label;
      this.$input.blur();
    }
  };

  open = () => {
    if (this.expanded) return;
    this.expanded = true;
    this.scrollToTarget(["li.active", "li"], this.filteredOptions.length);
  };

  toggle = () => (this.expanded ? this.close() : this.open());

  #handleKeyDown = (e: KeyboardEvent) => {
    if (!e.key || !this.expanded || this.disableFilter) return;
    switch (e.key.toUpperCase()) {
      case "ARROWDOWN":
        return e.preventDefault(), this.goTo();
      case "ARROWUP":
        return e.preventDefault(), this.goTo(-1);
      case "ENTER":
        return e.preventDefault(), this.handleEnter();
      case "ESCAPE":
        return e.preventDefault(), this.close();
    }
  };

  goTo = (step: -1 | 1 = 1) => {
    if (!this.filteredOptions.length) return;
    if (
      step === 1 &&
      this.highlightedIndex === this.filteredOptions.length - 1
    ) {
      this.highlightedIndex = -1;
    }
    if (step === -1 && this.highlightedIndex === 0) {
      this.highlightedIndex = this.filteredOptions.length;
    }
    this.highlightedIndex += step;
    this.scrollToTarget("li.highlighted");
  };

  handleEnter = () => {
    if (
      !this.filteredOptions.length ||
      this.filteredOptions.length < (this.opt.minLength || 0)
    ) {
      return this.close();
    }
    if (this.filteredOptions.length === 1) {
      return this.select(this.filteredOptions[0]);
    }
    if (this.highlightedIndex >= 0) {
      return this.select(this.filteredOptions[this.highlightedIndex]);
    }
  };

  #handleOutsideClick = (e: Event) => {
    this.expanded && !e.composedPath().includes(this) && this.close();
  };

  static readonly styles = [unsafeCSS(indexCss)];
}
