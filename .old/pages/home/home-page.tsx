import "./home-page.css";
import { Fragment, h } from "preact";
import { rx, useViewModel } from "../../platform/rx/index.ts";
import { Router } from "../../platform/router/router.ts";
import { useRouter } from "../../platform/router/preact.tsx";
import { useInject } from "../../platform/preact/provider.ts";
import { LMStudioService } from "../../services/lmstudio-service.ts";
import { Icon } from "../../components/icon/icon.tsx";
import { SideNav } from "../../sections/side-nav/side-nav.tsx";
import { SideNavService } from "../../services/side-nave-service.ts";
import { Button } from "../../components/button/button.tsx";
import { classNames } from "../../platform/preact/class-names.ts";

export class AppViewModel extends EventTarget {
  @rx accessor modelMenuOpen: boolean;
  @rx accessor lmStudioService: LMStudioService;
  router: Router;

  constructor(router: Router, lmStudioService: LMStudioService) {
    super();
    this.router = router;
    this.lmStudioService = lmStudioService;
    this.modelMenuOpen = false;
  }

  submit() {
    this.router.navigate("/chat/noid");
  }
}

export function HomePage() {
  const router = useRouter();
  const lmStudioService = useInject(LMStudioService);
  const sideNavService = useInject(SideNavService);
  const vm = useViewModel(AppViewModel, [router, lmStudioService]);

  return (
    <Fragment>
      <SideNav />
      <div className={classNames("models-menu", { open: vm.modelMenuOpen })}>
        {vm.lmStudioService.models.map((m) => (
          <div
            key={m.id}
            onClick={() => {
              console.log("hi");
              vm.lmStudioService.selectModel(m.id);
              vm.modelMenuOpen = false;
            }}
          >
            {m.id}
          </div>
        ))}
      </div>
      <nav className="navbar">
        <Button
          className="side-nav-button"
          onClick={() => sideNavService.open()}
        >
          <Icon icon="bars" height="16px" />
        </Button>
        <div className="status">
          {vm.lmStudioService.connected ? (
            <Fragment>{vm.lmStudioService.selectedModel.value}</Fragment>
          ) : (
            <Fragment>Not Connected</Fragment>
          )}
        </div>
        {vm.lmStudioService.connected && (
          <Icon
            className={classNames("model-menu-button", {
              open: vm.modelMenuOpen,
            })}
            icon="chevron-down"
            height="20px"
            onClick={() => (vm.modelMenuOpen = !vm.modelMenuOpen)}
          />
        )}
      </nav>
      <main className="chat-body"></main>
      <Button className="new-chat-button">
        <Icon
          onClick={() => vm.router.navigate("/chat/noid")}
          icon="pen-to-square"
          height="20px"
        />
      </Button>
    </Fragment>
  );
}
