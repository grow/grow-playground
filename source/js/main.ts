import angular from 'angular';
import 'angular-aria';
import {IInterpolateProvider} from 'angular';

// @ts-ignore
import uri from 'airkit/utils/uri';
// @ts-ignore
import {Registry} from 'airkit2';
// @ts-ignore
import {YTModalComponent} from 'airkit2/lib/ytmodal';
// @ts-ignore
import {ModalButtonComponent} from 'airkit2/lib/modal';

import addBrowserNameDirective from './ng/directives/add-browser-name';


class App {
  constructor() {
    this.init();
  }

  init() {
    const app = angular.module('starter', ['ngAria']);
    app.config(['$interpolateProvider', function($interpolateProvider: IInterpolateProvider) {
      $interpolateProvider.startSymbol('[[').endSymbol(']]');
    }]);
    app.directive('addBrowserName', addBrowserNameDirective);
    angular.bootstrap(document.body, ['starter']);

    // Propagate all utm_* and ak-now parameters to all <a> tags.
    uri.updateParamsFromUrl({
      selector: ['a[href]'],
    });

    const registry = new Registry();
    registry.register('button--ytmodal', YTModalComponent, {});
    registry.register('button--modal', ModalButtonComponent, {
      enableHashHistory: true
    });
    registry.run();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  new App();
});
