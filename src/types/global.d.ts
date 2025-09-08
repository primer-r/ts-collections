import type { MyCounter } from "@/components";
import type { MyApp } from "@/MyApp";

declare global {
  interface HTMLElementTagNameMap {
    "my-app": MyApp;
    "my-counter": MyCounter;
  }
}
