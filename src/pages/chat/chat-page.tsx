import "./chat-page.css";
import { Fragment, h } from "preact";
import { Markdown } from "../../components/markdown/markdown.tsx";
import { rx, notifyChange, useViewModel } from "../../platform/rx/index.ts";
import { TextField } from "../../platform/forms/index.ts";
import { useInject } from "../../platform/preact/provider.ts";
import { LMStudioService } from "../../services/lmstudio-service.ts";
import { Router } from "../../platform/router/router.ts";
import { useRouter } from "../../platform/router/preact.tsx";
import { ScrollContainer } from "../../components/scroll-container/scroll-container.tsx";
import type { HTMLContentEditable } from "../../custom-elements/app-contenteditable/app-contenteditable.ts";
import { useEffect, useRef } from "preact/hooks";
import { ChatInput } from "../../components/chat-input/chat-input.tsx";

type ChatMessage = {
  sender: "self" | "peer";
  content: string;
};

export class ChatPageVm extends EventTarget {
  @rx accessor draftText: TextField;
  @rx accessor connectionAddress: TextField;
  @rx accessor selectedModel: TextField;
  @rx accessor conversation: Array<ChatMessage>;
  @rx accessor assistantTyping: boolean;
  @rx accessor lmStudioService: LMStudioService;
  mainEl: HTMLElement | null;
  isBottom: boolean;
  router: Router;

  constructor(router: Router, lmStudioService: LMStudioService) {
    super();
    this.conversation = [];
    this.connectionAddress = new TextField();
    this.draftText = new TextField();
    this.selectedModel = new TextField();
    this.assistantTyping = false;
    this.mainEl = null;
    this.isBottom = false;
    this.lmStudioService = lmStudioService;
    this.router = router;
  }

  onInit() {
    if (!this.lmStudioService.isConnected()) {
      this.router.navigate("/");
    }
  }

  async submit() {
    if (this.assistantTyping) return;
    if (!this.draftText.value) return;

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

    this.draftText.update("");
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
      notifyChange(this);
    }

    this.assistantTyping = false;
  }
}

export function ChatPage() {
  const router = useRouter();
  const lmStudioService = useInject(LMStudioService);
  const vm = useViewModel(ChatPageVm, [router, lmStudioService]);
  const elmRef = useRef<HTMLContentEditable>(null);

  useEffect(() => elmRef.current?.focus(), [elmRef]);

  return (
    <Fragment>
      <nav className="navbar">
        {/* <Icon icon="bars" height="16px" /> */}
        <div className="chat-title">Chat Title</div>
      </nav>
      <main className="chat-body">
        <ScrollContainer>
          {vm.conversation.map((message) => (
            <div className={`chat-bubble ${message.sender}`}>
              <Markdown contents={message.content} className="article" />
            </div>
          ))}
        </ScrollContainer>
      </main>
      <footer className="chat-entry">
        <ChatInput
          placeholder="Aa"
          onSubmit={() => vm.submit()}
          onInput={vm.draftText.fromEvent}
          value={vm.draftText.value}
        />
      </footer>
    </Fragment>
  );
}
