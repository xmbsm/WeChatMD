declare module 'mp-darkmode' {
  interface DarkmodeOptions {
    begin?: (isSwitch: boolean) => void;
    showFirstPage?: () => void;
    error?: (err: Error) => void;
    mode?: 'dark' | 'light';
    whitelist?: {
      tagName?: string[];
      attribute?: string[];
    };
    needJudgeFirstPage?: boolean;
    delayBgJudge?: boolean;
    container?: HTMLElement | null;
    cssSelectorsPrefix?: string;
    defaultLightTextColor?: string;
    defaultLightBgColor?: string;
    defaultDarkTextColor?: string;
    defaultDarkBgColor?: string;
  }

  interface DarkmodeStatic {
    run(nodes: NodeListOf<Element> | Element[], options?: DarkmodeOptions): void;
    init(options: DarkmodeOptions): void;
    convertBg(nodes: NodeListOf<Element> | Element[]): void;
    updateStyle(node: HTMLElement, styles: Record<string, string>): void;
    getContrast(color1: string, color2: string): number;
    extend(pluginList: any[]): void;
  }

  const Darkmode: DarkmodeStatic;
  export default Darkmode;
}
