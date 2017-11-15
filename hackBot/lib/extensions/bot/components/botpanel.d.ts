/// <reference types="react" />
import * as React from 'react';
export declare class BotPanel extends React.Component<any, any> {
    constructor();
    div: HTMLDivElement;
    componentDidMount(): void;
    iframe(): {
        __html: any;
    };
    render(): JSX.Element;
    private _showPanel();
    private _hidePanel();
}
