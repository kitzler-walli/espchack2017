"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var decorators_1 = require("@microsoft/decorators");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var React = require("react");
var ReactDom = require("react-dom");
var strings = require("BotApplicationCustomizerStrings");
var sp_application_base_1 = require("@microsoft/sp-application-base");
var botpanel_1 = require("./components/botpanel");
var LOG_SOURCE = "BotApplicationCustomizer";
/** A Custom Action which can be run during execution of a Client Side Application */
var BotApplicationCustomizer = (function (_super) {
    __extends(BotApplicationCustomizer, _super);
    function BotApplicationCustomizer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BotApplicationCustomizer.prototype.onInit = function () {
        sp_core_library_1.Log.info(LOG_SOURCE, "Initialized " + strings.Title);
        this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
        this._renderPlaceHolders();
        return Promise.resolve();
    };
    BotApplicationCustomizer.prototype._renderPlaceHolders = function () {
        this.context.placeholderProvider.placeholderNames.map(function (name) { return sp_application_base_1.PlaceholderName[name]; }).join(", ");
        if (!this._topPlaceholder) {
            this._topPlaceholder =
                this.context.placeholderProvider.tryCreateContent(sp_application_base_1.PlaceholderName.Top, { onDispose: this._onDispose });
            // the extension should not assume that the expected placeholder is available.
            if (!this._topPlaceholder) {
                console.error("The expected placeholder (Top) was not found.");
                return;
            }
            if (this.properties) {
                if (this._topPlaceholder.domElement) {
                    ReactDom.render(React.createElement("div", null,
                        React.createElement(botpanel_1.BotPanel, null)), this._topPlaceholder.domElement);
                }
            }
        }
    };
    BotApplicationCustomizer.prototype._onDispose = function () {
        sp_core_library_1.Log.info(LOG_SOURCE, "gone " + strings.Title);
    };
    __decorate([
        decorators_1.override
    ], BotApplicationCustomizer.prototype, "onInit", null);
    return BotApplicationCustomizer;
}(sp_application_base_1.BaseApplicationCustomizer));
exports.default = BotApplicationCustomizer;

//# sourceMappingURL=BotApplicationCustomizer.js.map
