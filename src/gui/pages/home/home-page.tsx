import "./home-page.css";
import { Fragment, h } from "preact";
import { IconSend } from "../../components/icon/icon-send.tsx";
import {
  LMStudioConnection,
  Model,
} from "../../../platform/lmstudio/lmstudio.ts";
import {
  rx,
  useViewModel,
  ViewModelLifecycle,
} from "../../../platform/rx/index.ts";
import { TextField } from "../../../platform/forms/index.ts";
import { Router } from "../../../platform/router/router.ts";
import { useRouter } from "../../../platform/router/preact.tsx";
import { Input } from "../../components/input/input.tsx";
import { Select } from "../../components/select/select.tsx";
import { Button } from "../../components/button/button.tsx";
import { Icon } from "../../components/icon/icon.tsx";
import { classNames } from "../../../platform/preact/class-names.ts";
import { useInject } from "../../provider.ts";
import { LMStudioService } from "../../services/lmstudio-service.ts";

export class AppViewModel extends EventTarget implements ViewModelLifecycle {
  @rx accessor connectionAddress: TextField;
  @rx accessor connecting: boolean;
  @rx accessor connected: boolean;
  @rx accessor lmStudioService: LMStudioService;
  router: Router;

  constructor(router: Router, lmStudioService: LMStudioService) {
    super();
    this.connecting = false;
    this.connected = false;
    this.connectionAddress = new TextField();
    this.router = router;
    this.lmStudioService = lmStudioService;
  }

  async onInit() {
    this.connectionAddress.value = "http://192.168.10.3:1234";
  }

  async connect() {
    if (!this.connectionAddress.value) return;
    this.connecting = true;
    try {
      await this.lmStudioService.connect(this.connectionAddress.value);
      if (this.lmStudioService.models.length) {
        this.lmStudioService.selectModel(this.lmStudioService.models[0].id);
      }
      this.connected = true;
    } catch (error) {
      console.error(error);
    }
    this.connecting = false;
  }

  submit() {
    this.router.navigate("/chat/noid");
  }
}

export function HomePage() {
  const router = useRouter();
  const lmStudioService = useInject(LMStudioService);
  const vm = useViewModel(AppViewModel, [router, lmStudioService]);

  return (
    <Fragment>
      <label
        htmlFor="connection-input"
        className={classNames("connection-input", {
          connecting: vm.connecting,
        })}
      >
        <Input
          id="connection-input"
          type="text"
          value={vm.connectionAddress.value}
          onInput={vm.connectionAddress.fromEvent}
        />
        <Button onClick={() => vm.connect()}>Connect</Button>
      </label>
      {vm.connected && (
        <Fragment>
          <label htmlFor="models-input" className="connection-input">
            <Select
              id="models-input"
              name="models-input"
              value={vm.lmStudioService.selectedModel.value}
              onInput={vm.lmStudioService.selectedModel.fromEvent}
            >
              {vm.lmStudioService.models.map((model) => (
                <option value={model.id}>{model.id}</option>
              ))}
            </Select>
          </label>
          <Button onClick={() => vm.submit()}>Start Chat</Button>
        </Fragment>
      )}
    </Fragment>
  );
}
