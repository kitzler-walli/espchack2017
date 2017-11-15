import { override } from "@microsoft/decorators";
import { Log } from "@microsoft/sp-core-library";
import { Dialog } from "@microsoft/sp-dialog";
import { escape } from "@microsoft/sp-lodash-subset";
import * as React from "react";
import * as ReactDom from "react-dom";
import * as strings from "BotApplicationCustomizerStrings";
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from "@microsoft/sp-application-base";
import { BotPanel } from "./components/botpanel";

const LOG_SOURCE: string = "BotApplicationCustomizer";

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IBotApplicationCustomizerProperties {
  // this is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class BotApplicationCustomizer
  extends BaseApplicationCustomizer<IBotApplicationCustomizerProperties> {
    private _topPlaceholder: PlaceholderContent | undefined;
  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
    this._renderPlaceHolders();
    return Promise.resolve();
  }
  private _renderPlaceHolders(): void {

      this.context.placeholderProvider.placeholderNames.map(name => PlaceholderName[name]).join(", ");

        if (!this._topPlaceholder) {
          this._topPlaceholder =
            this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top, { onDispose: this._onDispose });

          // the extension should not assume that the expected placeholder is available.
          if (!this._topPlaceholder) {
            console.error("The expected placeholder (Top) was not found.");
            return;
          }
          if (this.properties) {
            if (this._topPlaceholder.domElement) {
              ReactDom.render(<div>
                <BotPanel />
                </div>, this._topPlaceholder.domElement);
            }
          }
        }
      }

      private _onDispose(): void {
        Log.info(LOG_SOURCE, `gone ${strings.Title}`);
    }
}
