// NOTE: by button name or by what its intention
export type EventName =
  | "form.change"
  | "form.input"
  | "form.update"
  | "sort"
  | "filter"
  | "cell.click"
  | "change";

export const dispatchCustomEvent = <T = string>(
  target: EventTarget,
  name: EventName,
  detail: T,
  options?: CustomEventInit
) => {
  if (!(target && name)) return;
  target.dispatchEvent(
    new CustomEvent<T>(name, {
      detail,
      bubbles: true,
      composed: true,
      cancelable: true,
      ...(options || {}),
    })
  );
};
