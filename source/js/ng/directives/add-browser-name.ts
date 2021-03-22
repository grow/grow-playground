import {IScope, IAttributes} from 'angular';

// @ts-ignore
import uaDetection from 'airkit/utils/useragent';


/**
 * Adds a useragent to an element.
 *
 * <div add-browser-name="myclassName"></div>
 *
 * Results in:
 *
 * <div class="myclassName--isChrome"></div>
 */

const addBrowserNameDirective = function() {
  return {
    restrict: 'A',
    link: function(scope: IScope, elem: any, attrs: IAttributes) {
      const className = attrs.addBrowserName;
      const el = elem[0];
      const browserTests = [
        'isAndroid', 'isChrome', 'isFirefox', 'isIOS', 'isIE', 'isIEorEdge',
        'isMobile', 'isSafari',
      ];
      browserTests.forEach(function(browserTest) {
        uaDetection[browserTest]() &&
          el.classList.add(className + '--' + browserTest);
        // Apply a class for legacy iOS devices.
        if (browserTest === 'isIOS' &&
            /iP(hone|od|ad)/.test(navigator.platform)) {
          const v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
          const majorVersion = parseInt(v[1], 10);
          if (majorVersion <= 10) {
            el.classList.add(`${className}--${browserTest}-legacy`);
            el.setAttribute(`${className}--${browserTest}-legacy`, '');
          }
          if (majorVersion === 11) {
            el.classList.add(`${className}--${browserTest}-11`);
            el.setAttribute(`${className}--${browserTest}-11`, '');
          }
        }
      });
    },
  };
};

export default addBrowserNameDirective;
