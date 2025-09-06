import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("my-app")
export class MyApp extends LitElement {
  render() {
    return html`MyApp`;
  }

  static readonly styles = [
    css`
      :host {
        display: inline-block;
        box-sizing: border-box;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "my-app": MyApp;
  }
}
