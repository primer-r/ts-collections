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
        width: 100%;
        box-sizing: border-box;
      }
    `,
  ];
}
