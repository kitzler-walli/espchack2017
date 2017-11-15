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
var React = require("react");
var Utilities_1 = require("office-ui-fabric-react/lib/Utilities");
var office_ui_fabric_react_1 = require("office-ui-fabric-react");
var sp_loader_1 = require("@microsoft/sp-loader");
var BotPanel = (function (_super) {
    __extends(BotPanel, _super);
    function BotPanel() {
        var _this = _super.call(this) || this;
        _this.state = { showPanel: false };
        sp_loader_1.SPComponentLoader.loadCss('https://static2.sharepointonline.com/files/fabric/office-ui-fabric-core/7.3.0/css/fabric.min.css');
        return _this;
    }
    BotPanel.prototype.componentDidMount = function () {
        //    this.div.innerHTML = '<iframe src="https://x.sharepoint.com/_catalogs/masterpage/bot.html" width="100%" height="500px"></iframe>';
    };
    BotPanel.prototype.iframe = function () {
        return {
            __html: this.props.iframe
        };
    };
    BotPanel.prototype.render = function () {
        var iframe = {
            __html: '<iframe frameborder=0 src="https://webchat.botframework.com/embed/ESPCHack2017?s=KAuFixnnozg.cwA.qIE.VZnCiAbOeoyK0JSFjfwS7tB-DZ8NCRccECYr_xlaYcY" width="100%" height="300px"></iframe>'
        };
        return (React.createElement("div", { style: { float: 'right' } },
            React.createElement(office_ui_fabric_react_1.DefaultButton, { text: 'Help', onClick: this._showPanel }),
            React.createElement(office_ui_fabric_react_1.Panel, { isOpen: this.state.showPanel, isLightDismiss: true, headerText: 'Light Dismiss Panel', onDismiss: this._hidePanel },
                React.createElement("img", { style: { height: "64px", width: "64px" }, src: "https://x.sharepoint.com/SiteAssets/bot.png", alt: "Cool Bot" }),
                React.createElement("h1", null, "SharePoint Assistant"),
                React.createElement("p", null, "I do things."),
                React.createElement("div", { dangerouslySetInnerHTML: iframe }))));
    };
    BotPanel.prototype._showPanel = function () {
        this.setState({ showPanel: true });
    };
    BotPanel.prototype._hidePanel = function () {
        this.setState({ showPanel: false });
    };
    __decorate([
        Utilities_1.autobind
    ], BotPanel.prototype, "_showPanel", null);
    __decorate([
        Utilities_1.autobind
    ], BotPanel.prototype, "_hidePanel", null);
    return BotPanel;
}(React.Component));
exports.BotPanel = BotPanel;

//# sourceMappingURL=botpanel.js.map
