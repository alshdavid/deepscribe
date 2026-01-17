import { notifyChange } from "../platform/rx/index.ts";

export type SideNavState = (typeof SideNavState)[keyof typeof SideNavState];
export const SideNavState = {
  Closed: "closed",
  Opening: "opening",
  Open: "open",
  Closing: "closing",
} as const;

export class SideNavService extends EventTarget {
  state: SideNavState;

  constructor() {
    super();
    this.state = SideNavState.Closed;
  }

  async open() {
    if (
      this.state === SideNavState.Open ||
      this.state === SideNavState.Opening ||
      this.state === SideNavState.Closing
    ) {
      return;
    }
    this.state = SideNavState.Opening;
    notifyChange(this);
    await new Promise((res) => setTimeout(res, 300));
    this.state = SideNavState.Open;
    notifyChange(this);
  }

  async close() {
    if (
      this.state === SideNavState.Closed ||
      this.state === SideNavState.Closing ||
      this.state == SideNavState.Opening
    ) {
      return;
    }
    this.state = SideNavState.Closing;
    notifyChange(this);
    await new Promise((res) => setTimeout(res, 300));
    this.state = SideNavState.Closed;
    notifyChange(this);
  }

  async toggle() {
    if (
      this.state === SideNavState.Closed ||
      this.state === SideNavState.Closing
    ) {
      await this.open();
    } else {
      await this.close();
    }
  }
}
