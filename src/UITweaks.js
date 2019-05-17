// This is mostly random stuff I copied from the internets

export default class UITweaks {

  // Toggle full screen.  MUST be triggered by a user action or the browser will
  // block it! (attach it to a button as a click handler)
  static toggleFullScreen() {
    if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement) {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    } else {
      const _element = document.documentElement;
      if (_element.requestFullscreen) {
        _element.requestFullscreen();
      } else if (_element.mozRequestFullScreen) {
        _element.mozRequestFullScreen();
      } else if (_element.webkitRequestFullscreen) {
        _element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    }
  }
}
