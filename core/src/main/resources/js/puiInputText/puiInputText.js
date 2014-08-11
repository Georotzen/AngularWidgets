/*globals window document angular */

(function (window, document, undefined) {
    "use strict";

    angular.module('angular.widgets').factory('widgetInputText', ['$interpolate', 'widgetBase', function ($interpolate, widgetBase) {


        var widgetInputText = {};

        widgetInputText.determineOptions = function (scope, element, attrs) {

            var options = scope.$eval(attrs.binding) || attrs.binding || {};
            return options;

        };

        widgetInputText.buildWidget = function (element, attrs, options) {
            var inputData = {};

            if (!attrs.type) {
                element.attr('type', 'text');
            }

            inputData.options = options;
            inputData.element = element;
            inputData.attrs = attrs;

            return inputData;
        };

        widgetInputText.enableDisable = function (inputData, value) {
            if (value === true) {
                widgetBase.resetHoverAndFocus(inputData.element);

                inputData.element.addClass('ui-state-disabled');
                inputData.element.attr('disabled','disabled');

            } else {
                inputData.element.removeClass('ui-state-disabled');
                widgetBase.hoverAndFocus(inputData.element);

                inputData.element.removeAttr('disabled');
            }


        };

        widgetInputText.showHide = function (inputData, value) {
            if (value === true) {
                inputData.element.removeClass("pui-hidden");
                widgetBase.showWithAnimation(inputData.element);
            } else {
                widgetBase.hideWithAnimation(inputData.element, function() {
                    inputData.element.addClass("pui-hidden");
                });
            }
        };

        widgetInputText.addBehaviour = function (scope, inputData) {

            widgetBase.hoverAndFocus(inputData.element);

            if (scope.puiDisabled !== undefined) {
                widgetBase.watchPuiDisabled(scope, inputData, widgetInputText.enableDisable);
            }
            if (scope.rendered !== undefined) {
                widgetBase.watchRendered(scope, inputData, widgetInputText.showHide);
            }
        };



        return widgetInputText;

    }]);


    angular.module('angular.widgets').directive('puiInputtext', ['widgetInputText', function (widgetInputText) {
        var linkFn = function (scope, element, attrs) {
            var options = widgetInputText.determineOptions(scope, element, attrs),
                inputData = widgetInputText.buildWidget(element, attrs, options);

            widgetInputText.addBehaviour(scope, inputData);

        };
        return {
            restrict: 'E',
            scope: {
                value: '=value',
                puiDisabled: '=puiDisabled',
                rendered: '=rendered'
            },
            replace: true,
            template: '<input ng-model="value" class="pui-inputtext ui-widget ui-state-default ui-corner-all" role="textbox" aria-disabled="false" aria-readonly="false" aria-multiline="false">',
            link: linkFn
        };

    }]);
}(window, document));