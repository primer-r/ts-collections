import type { CustomTable } from "@/components";
import type { MyApp } from "@/MyApp";

declare global {
  interface HTMLElementTagNameMap {
    "my-app": MyApp;
    "custom-table": CustomTable;
  }
}
