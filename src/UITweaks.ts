// This is mostly random stuff I copied from the internets

export default class UITweaks {

  // Toggle full screen.  MUST be triggered by a user action or the browser will
  // block it! (attach it to a button as a click handler)
  static toggleFullScreen(): void {
    const doc = document as Document & {
      mozFullScreenElement?: Element;
      webkitFullscreenElement?: Element;
      cancelFullScreen?: () => void;
      mozCancelFullScreen?: () => void;
      webkitCancelFullScreen?: () => void;
    };

    const docEl = document.documentElement as HTMLElement & {
      mozRequestFullScreen?: () => void;
      webkitRequestFullscreen?: (keyboardInput?: number) => void;
    };

    if (document.fullscreenElement || doc.mozFullScreenElement || doc.webkitFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (doc.cancelFullScreen) {
        doc.cancelFullScreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.webkitCancelFullScreen) {
        doc.webkitCancelFullScreen();
      }
    } else {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen();
      } else if (docEl.webkitRequestFullscreen) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        docEl.webkitRequestFullscreen((Element as any).ALLOW_KEYBOARD_INPUT);
      }
    }
  }
}
