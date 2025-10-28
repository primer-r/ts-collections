import type { CustomTable } from "@/components/CustomTable";
import type { TemplateResult } from "lit";
import type { DirectiveResult } from "lit/async-directive.js";
import type { StyleInfo } from "lit/directives/style-map.js";
import type { UnsafeHTMLDirective } from "lit/directives/unsafe-html.js";
import type { UnsafeSVGDirective } from "lit/directives/unsafe-svg.js";

export type TableColumn<T> = {
  id: keyof T;
  header: CellTypes<T>;
  cell: (rowData: T, meta: TableMeta<T>) => CellType;
  subHdeader?: CellTypes<T> | Array<CellTypes<T>>;
  footer?: CellType | CellTypeFn<T>;
  cellStyle?: (_: TableMeta<T>) => StyleInfo | undefined;
  sortFn?: (_: TableMeta<T>) => Array<T>;
};

export type TableMeta<T = string> = {
  id: keyof T;
  row: {
    index: number;
    length: number;
  };
  column: TableMeta<T>["row"];
  data?: T;
  cell?: CellType;
  $table?: CustomTable<T>;
  tag: CellTag = "td";
};

export type CellTypeFn<T> = (_: TableMeta<T>) => CellType;

export type CellType =
  | string
  | number
  | boolean
  | undefined
  | null
  | TemplateResult // html``
  | DirectiveResult<typeof UnsafeSVGDirective | typeof UnsafeHTMLDirective>; // unsafeSVG() || unsafeHTML()

export type CellTag = "td" | "th";

export type Direction = "ASC" | "DESC" | undefined;

export type CellTypes<T> = CellType | CellTypeFn<T>;
