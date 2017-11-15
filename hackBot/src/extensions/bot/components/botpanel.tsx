import * as React from 'react';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { Panel, DefaultButton } from 'office-ui-fabric-react';
import { SPComponentLoader } from '@microsoft/sp-loader';

export class BotPanel extends React.Component<any, any> {

  constructor() {
    super();

    this.state = { showPanel: false };
    SPComponentLoader.loadCss('https://static2.sharepointonline.com/files/fabric/office-ui-fabric-core/7.3.0/css/fabric.min.css');
  }
 div:HTMLDivElement;
 
 componentDidMount(){
//    this.div.innerHTML = '<iframe src="https://x.sharepoint.com/_catalogs/masterpage/bot.html" width="100%" height="500px"></iframe>';

 }

 iframe() {
  return {
    __html: this.props.iframe
  }
}

  public render() {
    const iframe = {
      __html: '<iframe frameborder=0 src="https://webchat.botframework.com/embed/ESPCHack2017?s=KAuFixnnozg.cwA.qIE.VZnCiAbOeoyK0JSFjfwS7tB-DZ8NCRccECYr_xlaYcY" width="100%" height="300px"></iframe>'}
    
    return (
      <div style={{float:'right'}}>
        <DefaultButton
          text='Help'
          onClick={ this._showPanel }
        />
        <Panel
          isOpen={ this.state.showPanel }
          isLightDismiss={ true }
          headerText='Light Dismiss Panel'
          onDismiss={ this._hidePanel }
        >
        <img style={{height: "64px", width: "64px"}} src="https://x.sharepoint.com/SiteAssets/bot.png" alt="Cool Bot"/>
    <h1>SharePoint Assistant</h1>
    <p>I do things.</p>
        <div dangerouslySetInnerHTML={ iframe } />
        
        </Panel>
      </div>
    );
  }

  @autobind
  private _showPanel(): void {
    this.setState({ showPanel: true });
  }

  @autobind
  private _hidePanel(): void {
    this.setState({ showPanel: false });
  }
}