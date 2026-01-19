import "./side-nav.css";
import { Fragment, h } from "preact";
import { classNames } from "../../platform/preact/class-names.ts";
import { useInject } from "../../platform/preact/provider.ts";
import { SideNavService } from "../../services/side-nave-service.ts";
import { useViewModel } from "../../platform/rx/use-view-model.ts";
import { Input } from "../../components/input/input.tsx";
import { Icon } from "../../components/icon/icon.tsx";
import { Button } from "../../components/button/button.tsx";
import { LMStudioService } from "../../services/lmstudio-service.ts";
import { rx } from "../../platform/rx/rx.ts";

export class SideNavViewModel extends EventTarget {
  @rx accessor lmStudioService: LMStudioService;
  @rx accessor sideNavService: SideNavService;

  constructor(
    sideNavService: SideNavService,
    lmStudioService: LMStudioService,
  ) {
    super();
    this.lmStudioService = lmStudioService;
    this.sideNavService = sideNavService;
  }

  async connect() {
    try {
      await this.lmStudioService.connect();
      await this.sideNavService.close();
    } catch (error) {
      console.error(error);
    }
  }
}

export function SideNav() {
  const vm = useViewModel(SideNavViewModel, [
    useInject(SideNavService),
    useInject(LMStudioService),
  ]);

  return (
    <Fragment>
      <div
        className={classNames(
          "component-side-nav-shade",
          vm.sideNavService.state,
        )}
        onClick={() => vm.sideNavService.close()}
      />

      <nav
        className={classNames("component-side-nav", vm.sideNavService.state)}
      >
        <div className="top-bar">
          <Icon icon="brand" height="36px" />
          <h1>OpenChatLite</h1>
        </div>
        <div className="main-section">
          <label>
            <p>OpenAI API Address</p>
            <Input
              onInput={vm.lmStudioService.apiAddress.fromEvent}
              value={vm.lmStudioService.apiAddress.value}
              type="text"
              placeholder="Connection Address"
            />
          </label>

          <label>
            <p>Custom Headers</p>
          </label>
        </div>
        <div className="footer">
          <Button
            disabled={
              vm.lmStudioService.apiAddress.value === "" ||
              vm.lmStudioService.connecting
            }
            onClick={() => vm.connect()}
          >
            Connect
          </Button>
        </div>
      </nav>
    </Fragment>
  );
}
