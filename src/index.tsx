import "./styles.css";
import { h } from "preact";
import { PreactRouter } from "./platform/router/preact.tsx";
import { AUTO_BASE_HREF } from "./platform/router/router.ts";
import { HomePage } from "./pages/home/home-page.tsx";
import { ChatPage } from "./pages/chat/chat-page.tsx";
import { NotFoundPage } from "./pages/not-found/not-found-page.tsx";
import { Provider } from "./platform/preact/provider.ts";
import { LMStudioService } from "./services/lmstudio-service.ts";
import { SideNavService } from "./services/side-nave-service.ts";

// Services
const provider = new Provider();

const lmStudioService = new LMStudioService();
provider.provide(LMStudioService, lmStudioService);

const sideNavService = new SideNavService();
provider.provide(SideNavService, sideNavService);

// ClientSide SPA Router
const app = new PreactRouter({
  root: document.body,
  baseHref: AUTO_BASE_HREF,
  providers: [<Provider.Provider value={provider} />],
});

app.mount("/", () => <HomePage />);
app.mount("/chat/:id", () => <ChatPage />);
app.mount("/**", () => <NotFoundPage />);

app.start();

// DEBUG
//@ts-expect-error
globalThis.lm = lmStudioService;
//@ts-expect-error
globalThis.router = app;
