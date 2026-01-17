
import { Router, AUTO_BASE_HREF } from '../platform/router/index.ts'

const app = new Router({ baseHref: AUTO_BASE_HREF })

app.route('/', () => {
  console.log('root')
})

app.route('/foo', () => {
  console.log('/foo')
})

app.start()

// import { PreactRouter } from '../platform/router/preact.tsx'
// import { AUTO_BASE_HREF } from '../platform/router/router.ts'

// const app = new PreactRouter({ 
//   root: document.body,
//   baseHref: AUTO_BASE_HREF 
// })

// app.route('/', () => {
//   console.log('root')
// })

// app.route('/foo', () => {
//   console.log('/foo')
// })

// app.start()

// import "./styles.css";
// import { IconEllipsis } from "./components/icon/ellipsis.tsx";
// import { IconSend } from "./components/icon/icon-send.tsx";
// import { Textarea } from "./components/textarea/textarea.tsx";
// import { Fragment, h, render } from "preact";
// import { LMStudioConnection, Model } from "../platform/lmstudio/lmstudio.ts";
// import { Markdown } from "./components/markdown/markdown.tsx";
// import {
//   rx,
//   notifyChange,
//   useViewModel,
//   ViewModelLifecycle,
// } from "../platform/rx/index.ts";
// import { TextField } from "../platform/forms/index.ts";
// import { Intersector } from "./components/intersector/intersector.tsx";

// type ChatMessage = {
//   sender: "self" | "peer";
//   content: string;
// };

// const demoMessages: Array<ChatMessage> = [
//   {
//     sender: "self",
//     content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
//   },
//   {
//     sender: "peer",
//     content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
//   },
// ];

// export class AppViewModel extends EventTarget implements ViewModelLifecycle {
//   @rx.push accessor conversation: Array<ChatMessage>;
//   @rx.push accessor draftText: TextField;
//   @rx.push accessor connectionAddress: TextField;
//   @rx.push accessor client: LMStudioConnection | null;
//   @rx.push accessor selectedModel: TextField;
//   @rx.push accessor assistantTyping: boolean;
//   @rx.push accessor models: Array<Model>;
//   mainEl: HTMLElement | null;
//   observer: ResizeObserver | null;
//   isBottom: boolean;

//   constructor() {
//     super();
//     this.client = null;
//     // this.conversation = demoMessages;
//     this.conversation = [];
//     this.connectionAddress = new TextField();
//     this.draftText = new TextField();
//     this.selectedModel = new TextField();
//     this.assistantTyping = false;
//     this.models = [];
//     this.mainEl = null;
//     this.observer = null;
//     this.isBottom = false;
//   }

//   async onInit() {
//     this.connectionAddress.value = "http://192.168.10.3:1234";
//     await this.connect();
//   }

//   onDestroy() {
//     if (this.observer) this.observer.disconnect();
//   }

//   async connect() {
//     if (!this.connectionAddress) return;
//     this.client = new LMStudioConnection({
//       address: this.connectionAddress.value,
//     });

//     this.models = await this.client.getModels();
//     if (this.models.length) {
//       this.selectedModel.value = this.models[0].id;
//     }
//   }

//   async scrollToBottom() {
//     if (!this.isBottom) return;
//     if (!this.mainEl) return;
//     this.mainEl.scrollTop = this.mainEl.scrollHeight;
//     await new Promise((res) => requestAnimationFrame(res));
//   }

//   async submit() {
//     if (this.assistantTyping) return;
//     if (!this.draftText) return;
//     if (!this.client) return;
//     if (!this.selectedModel) return;

//     this.conversation.push(
//       {
//         sender: "self",
//         content: this.draftText.value,
//       },
//       {
//         sender: "peer",
//         content: "",
//       },
//     );

//     this.draftText.value = "";
//     this.assistantTyping = true;

//     const response = this.client.streamChatCompletion({
//       model: this.selectedModel.value,
//       messages: this.conversation.map((msg) => ({
//         role: msg.sender === "self" ? "user" : "assistant",
//         content: msg.content,
//       })),
//       temperature: 0.7,
//     });

//     for await (const chunk of response) {
//       this.conversation[this.conversation.length - 1].content += chunk;
//       if (this.mainEl) {
//         this.mainEl.scrollTop = this.mainEl.scrollHeight;
//         await new Promise((res) => requestAnimationFrame(res));
//       }
//       notifyChange(this);
//     }

//     this.assistantTyping = false;
//   }

//   // This can be replaced with an IntersectionObserver
//   initScrollToBottomListener = (elem: HTMLElement | null) => {
//     if (!elem) return;
//     elem.scrollTop = elem.scrollHeight;
//     this.mainEl = elem;
//     this.isBottom = true;
//     const resizeObserver = new ResizeObserver(this.scrollToBottom);
//     resizeObserver.observe(document.body);
//     this.observer = resizeObserver;
//   };
// }

// function App() {
//   const vm = useViewModel(AppViewModel, [], { debugKey: "vm" });

//   return (
//     // TODO Add routing
//     <Fragment>
//       {vm.conversation.length ? (
//         <Fragment>
//           <nav className="navbar">
//             <div>Basic Chat</div>
//             <IconEllipsis />
//           </nav>
//           <main ref={vm.initScrollToBottomListener} className="chat-body">
//             <div className="inner">
//               {vm.conversation.map((message) => (
//                 <div className={`chat-bubble ${message.sender}`}>
//                   <Markdown contents={message.content} className="article" />
//                 </div>
//               ))}
//             </div>
//             <Intersector
//               className="chat-bottom-intersector"
//               threshold={0}
//               onEnter={() => (vm.isBottom = true)}
//               onExit={() => (vm.isBottom = false)}
//             />
//           </main>
//           <footer className="chat-entry">
//             <Textarea
//               disabled={vm.assistantTyping}
//               onSubmit={() => vm.submit()}
//               onChange={(value) => {
//                 vm.draftText.value = value;
//                 vm.scrollToBottom();
//               }}
//               value={vm.draftText.value}
//               placeholder="Aa"
//             />
//             <button onClick={() => vm.submit()}>
//               <IconSend />
//             </button>
//           </footer>
//         </Fragment>
//       ) : (
//         <main className="chat-body no-chat">
//           <div>
//             <label htmlFor="connection-input" className="connection-input">
//               <div>
//                 <input
//                   id="connection-input"
//                   type="text"
//                   value={vm.connectionAddress.value}
//                   onInput={vm.connectionAddress.fromEvent}
//                 />
//                 <IconSend onClick={() => vm.connect()} />
//               </div>
//             </label>
//             {vm.selectedModel && vm.client && (
//               <label htmlFor="models-input" className="connection-input">
//                 <select
//                   id="models-input"
//                   name="models-input"
//                   {...vm.selectedModel.asProps()}
//                 >
//                   {vm.models.map((model) => (
//                     <option value={model.id}>{model.id}</option>
//                   ))}
//                 </select>
//               </label>
//             )}
//           </div>
//           <footer className="chat-entry" style={{ width: "80vw" }}>
//             <Textarea
//               onSubmit={() => vm.submit()}
//               onChange={(value) => {
//                 vm.draftText.value = value;
//                 vm.scrollToBottom();
//               }}
//               value={vm.draftText.value}
//               placeholder="Start a new chat"
//             />
//             <button onClick={() => vm.submit()}>
//               <IconSend />
//             </button>
//           </footer>
//         </main>
//       )}
//     </Fragment>
//   );
// }

// render(<App />, document.body);
