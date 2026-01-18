import { options } from "preact";
import { TextField } from "../../platform/forms/text-field.ts";
import {
  ChatCompletionOptions,
  LMStudioConnection,
  Model,
} from "../../platform/lmstudio/lmstudio.ts";
import { rx } from "../../platform/rx/index.ts";

export class LMStudioService extends EventTarget {
  @rx accessor selectedModel: TextField;
  @rx accessor models: Array<Model>;
  client: LMStudioConnection | null;

  constructor() {
    super();
    this.client = null;
    this.selectedModel = new TextField();
    this.models = [];
  }

  isConnected(): boolean {
    return this.client !== null;
  }

  async connect(address: string): Promise<void> {
    try {
      this.client = new LMStudioConnection({
        address,
      });

      // await new Promise((res) => setTimeout(res, 1000));
      this.models = await this.client.getModels();
    } catch (error) {
      this.client = null;
      throw error;
    }
  }

  async refresh() {
    if (!this.client) {
      throw new Error("Not connected to server");
    }
    this.models = await this.getModels();
  }

  async selectModel(modelId: string): Promise<void> {
    if (!this.client) {
      throw new Error("Not connected to server");
    }
    if (!this.models.find((m) => m.id === modelId)) {
      throw new Error("Model does not exist");
    }
    this.selectedModel.value = modelId;
  }

  getModels(): Array<Model> {
    if (!this.client) {
      throw new Error("Not connected to server");
    }
    return structuredClone(this.models);
  }

  streamChatCompletion({
    model,
    ...options
  }: ChatCompletionOptions): AsyncIterable<string> {
    if (!this.client) {
      throw new Error("Not connected to server");
    }
    return this.client.streamChatCompletion({
      model: model ? model : this.selectedModel.value,
      ...options,
    });
  }
}
