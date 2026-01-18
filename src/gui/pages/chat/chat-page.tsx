import "./chat-page.css";
import { Fragment, h } from "preact";
import { IconEllipsis } from "../../components/icon/ellipsis.tsx";
import { IconSend } from "../../components/icon/icon-send.tsx";
import { Textarea } from "../../components/textarea/textarea.tsx";
import {
  LMStudioConnection,
  Model,
} from "../../../platform/lmstudio/lmstudio.ts";
import { Markdown } from "../../components/markdown/markdown.tsx";
import {
  rx,
  notifyChange,
  useViewModel,
  ViewModelLifecycle,
} from "../../../platform/rx/index.ts";
import { TextField } from "../../../platform/forms/index.ts";
import { Intersector } from "../../components/intersector/intersector.tsx";
import { useInject } from "../../provider.ts";
import { LMStudioService } from "../../services/lmstudio-service.ts";
import { Icon } from "../../components/icon/icon.tsx";
import { Router } from "../../../platform/router/router.ts";
import { useRouter } from "../../../platform/router/preact.tsx";

type ChatMessage = {
  sender: "self" | "peer";
  content: string;
};

export class ChatPageVm extends EventTarget {
  @rx accessor conversation: Array<ChatMessage>;
  @rx accessor draftText: TextField;
  @rx accessor connectionAddress: TextField;
  @rx accessor client: LMStudioConnection | null;
  @rx accessor selectedModel: TextField;
  @rx accessor assistantTyping: boolean;
  @rx accessor models: Array<Model>;
  @rx accessor lmStudioService: LMStudioService;
  mainEl: HTMLElement | null;
  observer: ResizeObserver | null;
  isBottom: boolean;
  router: Router;

  constructor(router: Router, lmStudioService: LMStudioService) {
    super();
    this.client = null;
    this.conversation = [];
    this.connectionAddress = new TextField();
    this.draftText = new TextField();
    this.selectedModel = new TextField();
    this.assistantTyping = false;
    this.models = [];
    this.mainEl = null;
    this.observer = null;
    this.isBottom = false;
    this.lmStudioService = lmStudioService;
    this.router = router;
  }

  onInit() {
    if (!this.lmStudioService.isConnected()) {
      console.log("yo");
      this.router.navigate("/");
    }
  }

  onDestroy() {
    if (this.observer) this.observer.disconnect();
  }

  async scrollToBottom() {
    if (!this.isBottom) return;
    if (!this.mainEl) return;
    this.mainEl.scrollTop = this.mainEl.scrollHeight;
    await new Promise((res) => requestAnimationFrame(res));
  }

  async submit() {
    if (this.assistantTyping) return;
    if (!this.draftText) return;

    this.conversation.push(
      {
        sender: "self",
        content: this.draftText.value,
      },
      {
        sender: "peer",
        content: "",
      },
    );

    this.draftText.value = "";
    this.assistantTyping = true;

    const response = this.lmStudioService.streamChatCompletion({
      model: this.selectedModel.value,
      messages: this.conversation.map((msg) => ({
        role: msg.sender === "self" ? "user" : "assistant",
        content: msg.content,
      })),
      temperature: 0.7,
    });

    for await (const chunk of response) {
      this.conversation[this.conversation.length - 1].content += chunk;
      if (this.mainEl) {
        this.mainEl.scrollTop = this.mainEl.scrollHeight;
        await new Promise((res) => requestAnimationFrame(res));
      }
      notifyChange(this);
    }

    this.assistantTyping = false;
  }

  // This can be replaced with an IntersectionObserver
  initScrollToBottomListener = (elem: HTMLElement | null) => {
    if (!elem) return;
    elem.scrollTop = elem.scrollHeight;
    this.mainEl = elem;
    this.isBottom = true;
    const resizeObserver = new ResizeObserver(this.scrollToBottom);
    resizeObserver.observe(document.body);
    this.observer = resizeObserver;
  };
}

export function ChatPage() {
  const router = useRouter();
  const lmStudioService = useInject(LMStudioService);
  const vm = useViewModel(ChatPageVm, [router, lmStudioService]);

  return (
    <Fragment>
      <nav className="navbar">
        <div>Basic Chat</div>
        <Icon icon="ellipsis" height="24px" />
      </nav>
      <main ref={vm.initScrollToBottomListener} className="chat-body">
        <div className="inner">
          {vm.conversation.map((message) => (
            <div className={`chat-bubble ${message.sender}`}>
              <Markdown contents={message.content} className="article" />
            </div>
          ))}
        </div>
        <Intersector
          className="chat-bottom-intersector"
          threshold={0}
          onEnter={() => (vm.isBottom = true)}
          onExit={() => (vm.isBottom = false)}
        />
      </main>
      <footer className="chat-entry">
        <Textarea
          // disabled={vm.assistantTyping}
          onSubmit={() => vm.submit()}
          onChange={(value) => {
            vm.draftText.value = value;
            vm.scrollToBottom();
          }}
          value={vm.draftText.value}
          placeholder="Aa"
        />
        <button onClick={() => vm.submit()}>
          <Icon icon="send" height="24px" />
        </button>
      </footer>
    </Fragment>
  );
}
