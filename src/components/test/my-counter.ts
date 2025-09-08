import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("my-counter")
export class MyCounter extends LitElement {
  @state() private count = 0;

  render() {
    return html`
      <h1>Count: ${this.count}</h1>
      <button @click=${() => this.count++}>increment</button>
    `;
  }

  static styles = css`
    button {
      padding: 0.5rem 1rem;
      font-size: 1rem;
    }
    h1 {
      margin: 0 0 0.5rem;
    }
  `;
}
