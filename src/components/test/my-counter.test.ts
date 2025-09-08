import { fixture, html, expect } from "@open-wc/testing";
import "./my-counter.ts";

let $main: HTMLElement, $el: ShadowRoot | null;

describe("my-counter", () => {
  before(async () => {
    $main = await fixture<HTMLDivElement>(html`</my-counter></my-counter>`);
    $el = $main.shadowRoot;
    Object.assign(window, { $main, $el });
  });

  it("renders initial count", () => {
    expect($el?.querySelector("h1")?.textContent).to.include("Count: 0");
  });
});
