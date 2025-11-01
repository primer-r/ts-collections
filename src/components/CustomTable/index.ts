import type {
  CellType,
  CellTypes,
  Direction,
  TableColumn,
  TableMeta,
} from "@/types/table";
import { css, type CSSResult, html, LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";
import { dispatchCustomEvent } from "@/utils/event";

/**
 * style: 1.custom-table::part(partName){} 2.columns[index].cellStyle 3.externalStyle
 * sorting feature:
 *    feilds: 1.enableSorting=true -> sort all 2.enableSorting=[key1,key2,key3,...] -> sort certain fields
 *    handler: 1.columns[index].sortFn() 2.this.sortBy()
 */
@customElement("custom-table")
export class CustomTable<T> extends LitElement {
  externalStyle?: string | CSSResult = "";
  enableSorting: boolean | Array<keyof T> = false;
  @property({ type: Array }) list: Array<T> = [];
  @property({ type: Array }) columns: Array<TableColumn<T>> = [];
  @property() subRowFn?: TableColumn<T>["cell"];

  @state() sortProp?: keyof T;
  @state() processedList: Array<T> = this.list || [];

  get subHeaders(): Array<Array<CellTypes<T>>> {
    const raw = this.columns.map(({ subHdeader }) => subHdeader);
    if (!raw.some(Boolean)) return [];
    if (raw.some(Array.isArray)) {
      const maxLength = Math.max(
        ...raw.map((subHdeader) =>
          Array.isArray(subHdeader) ? subHdeader.length : 1
        )
      );
      return Array.from({ length: maxLength }, (_, index) =>
        raw.map((subHeader) =>
          Array.isArray(subHeader)
            ? subHeader[index] || null
            : index === 0
            ? subHeader
            : null
        )
      );
    }
    return [raw];
  }

  render = () => {
    if (!this.columns.length) return "";
    return html`<style>
        ${unsafeCSS(this.externalStyle)}
      </style>
      <div part="wrapper" class="wrapper">
        <table part="table">
          <thead part="thead">
            <tr part="theadTr">
              ${repeat(
                this.columns,
                ({ id }) => id,
                ({ header, id, cellStyle, sortFn }, index) => {
                  const detail = this.metaOf(id, index, header);
                  return html`<th
                    part="th"
                    style=${styleMap(this.toStyle(cellStyle, detail))}
                    @click=${() => this.clickHeaderCell(detail, sortFn)}
                  >
                    ${this.toCell(header, detail)}
                  </th>`;
                }
              )}
            </tr>
            ${repeat(
              this.subHeaders,
              (_, rowIndex) => rowIndex,
              (row, rowIndex) => {
                if (!(Array.isArray(row) && row.length)) return "";
                return html`<tr part="theadTr">
                  ${repeat(
                    row,
                    (_, index) => this.columns[index].id,
                    (subHeader, index) => {
                      const detail = this.metaOf(
                        this.columns[index].id,
                        index,
                        subHeader,
                        rowIndex + 1
                      );
                      return html`<th part="th">
                        ${this.toCell(subHeader, detail)}
                      </th>`;
                    }
                  )}
                </tr>`;
              }
            )}
          </thead>
          <tbody part="tbody">
            ${repeat(
              this.list,
              (_, rowIndex) => rowIndex,
              (row, rowIndex) => {
                return html`<tr part="tbodyTr">
                    ${repeat(
                      this.columns,
                      ({ id }) => id,
                      ({ cell, id, cellStyle }, index) => {
                        const detail = this.metaOf(
                          id,
                          index,
                          cell,
                          rowIndex,
                          row
                        );
                        return html`<td
                          part="td"
                          style=${styleMap(this.toStyle(cellStyle, detail))}
                          @click=${() => this.handleClick(detail)}
                        >
                          ${cell(row, detail)}
                        </td>`;
                      }
                    )}
                  </tr>
                  ${(() => {
                    const cell = this.toCell(
                      this.subRowFn,
                      this.metaOf(
                        this.columns[0].id,
                        0,
                        undefined,
                        rowIndex,
                        row
                      )
                    );
                    cell &&
                      html`<tr part="subRow">
                        <td colspan=${this.columns.length} part="subRowTd">
                          ${cell}
                        </td>
                      </tr>`;
                  })()} `;
              }
            )}
          </tbody>
        </table>
      </div>`;
  };

  clickHeaderCell = (
    detail: TableMeta<T>,
    sortFn?: TableColumn<T>["sortFn"]
  ) => {
    if (this.sortable(detail.id)) {
      this.sortProp = detail.id;
      this.processedList =
        typeof sortFn === "function"
          ? sortFn(detail)
          : this.sortBy(this.list, detail.id);
    }
    this.handleClick(detail);
  };

  sortable = (id: keyof T) =>
    Array.isArray(this.list) &&
    this.list.length &&
    (!Array.isArray(this.enableSorting)
      ? this.enableSorting
      : this.enableSorting?.includes(id));

  sortBy = (raw: Array<T>, prop: keyof T, direction?: Direction) => {
    if (!(Array.isArray(raw) && raw.length && direction)) return [];
    const lt = direction !== "ASC" ? 1 : -1;
    return raw.sort((a, b) => {
      if (a[prop] < b[prop]) return lt;
      if (a[prop] === b[prop]) return 0;
      return -1 * lt;
    });
  };

  handleClick = (detail: TableMeta<T>) =>
    dispatchCustomEvent(this, "cell.click", { detail });

  toStyle = (styleFn?: TableColumn<T>["cellStyle"], meta?: TableMeta<T>) => {
    if (typeof styleFn !== "function" || !meta?.tag) return {};
    return styleFn(meta) || {};
  };

  toCell = (cell: CellTypes<T>, meta: TableMeta<T>): CellType => {
    return typeof cell === "function" ? cell(meta) : cell;
  };

  metaOf = (
    id: TableMeta<T>["id"],
    columnIndex: TableMeta<T>["column"]["index"],
    cell: TableMeta<T>["cell"],
    rowIndex: TableMeta<T>["row"]["index"] = 0,
    data?: TableMeta<T>["data"]
  ): TableMeta<T> => ({
    id,
    cell,
    row: {
      index: rowIndex,
      length: !data ? this.subHeaders.length + 1 : this.list.length,
    },
    column: { index: columnIndex, length: this.columns.length },
    $table: this,
    tag: data ? "td" : "th",
    ...(data ? { data } : {}),
  });

  static readonly styles = [
    css`
      :host {
        --border-color: #ccc;

        position: relative;
        display: inline-block;
        min-width: 0;
        min-height: 0;
      }
      :host * {
        box-sizing: border-box;
      }
      .wrapper {
        max-width: 100%;
        max-height: 100%;
        overflow: auto;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      thead tr:last-child,
      tbody tr {
        border-bottom: 1px solid var(--border-color);
      }
      th,
      td {
        padding: 0.25rem;
        vertical-align: top;
        text-align: left;
      }
    `,
  ];
}
