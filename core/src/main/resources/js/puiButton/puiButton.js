/*globals angular */

(function (window, document, undefined) {
    "use strict";

    angular.module('angular.widgets').factory('widgetButton', ['$interpolate', 'widgetBase', function ($interpolate, widgetBase) {


        var widgetButton = {};

        widgetButton.determineOptions = function (scope, element, attrs) {

            var options = scope.$eval(attrs.binding) || attrs.binding || {};

            options.text = attrs.value || options.value;
            if (options.text) {

                options.textDynamic = widgetBase.getExpression(element, 'value');
            }
            options.icon = attrs.icon || options.icon;
            options.iconPosition = attrs.iconposition || options.iconPosition;
            return options;

        };

        widgetButton.buildWidget = function (element, attrs, options) {
            var buttonData = {};

            element.append('<span class="pui-button-text">' + options.text + '</span>');

            if (options.icon) {
                options.iconPosition = options.iconPosition || 'left';
                var styleClass = (options.text ) ? 'pui-button-text-icon-' + options.iconPosition : 'pui-button-icon-only';
                element.addClass(styleClass);
                element.append('<span class="pui-button-icon-' + options.iconPosition + ' ui-icon ' + options.icon + '" />');

            } else {
                element.addClass('pui-button-text-only');
            }

            buttonData.options = options;
            buttonData.element = element;
            buttonData.attrs = attrs;

            return buttonData;
        };

        widgetButton.enableDisable = function (buttonData, value) {
            if (value === true) {
                widgetBase.resetHoverAndFocus(buttonData.element);

                buttonData.element.addClass('ui-state-disabled');
                widgetButton.aria(buttonData.element, false);
            } else {
                buttonData.element.removeClass('ui-state-disabled');
                widgetBase.hoverAndFocus(buttonData.element);
                widgetButton.aria(buttonData.element, true);
            }
        };

        widgetButton.showHide = function (buttonData, value) {
            if (value === true) {
                buttonData.element.removeClass("pui-hidden");
                widgetBase.showWithAnimation(buttonData.element);
            } else {
                widgetBase.hideWithAnimation(buttonData.element, function() {
                    buttonData.element.addClass("pui-hidden");
                });
            }
        };

        widgetButton.addBehaviour = function (scope, buttonData) {
            if (scope.actionListener) {
                buttonData.element.clickWhenActive(scope.actionListener);
            }
            widgetBase.hoverAndFocus(buttonData.element);

            if (scope.puiDisabled !== undefined) {
                widgetBase.watchPuiDisabled(scope, buttonData, widgetButton.enableDisable);
            }
            if (scope.rendered !== undefined) {
                widgetBase.watchRendered(scope, buttonData, widgetButton.showHide);
            }
        };

        widgetButton.aria = function (button, disabled) {
            button.attr('role', 'button').attr('aria-disabled', disabled);
        };

        var TitleSetter = function (button) {
            this.element = button;
        };

        TitleSetter.prototype.changedValue = function (newValue) {

            var children = this.element.children();
            if (children.length === 0) {
                this.element.text(newValue);
            } else {
                var child = this.element.childrenSelector('.pui-button-text');
                child.text(newValue);
            }

        };

        widgetButton.supportDynamicTitle = function (scope, buttonData) {
            if (buttonData.options.textDynamic && buttonData.options.textDynamic.indexOf('{{') > -1) {
                var titleObject = new TitleSetter(buttonData.element);
                widgetBase.watchExpression(scope.$parent, $interpolate, widgetBase.getExpression(buttonData.element, 'value'), titleObject);
            }
        };

        return widgetButton;

    }]);


    angular.module('angular.widgets').directive('puiButton', ['widgetButton', function (widgetButton) {
        var linkFn = function (scope, element, attrs) {
            var options = widgetButton.determineOptions(scope, element, attrs),
                buttonData = widgetButton.buildWidget(element, attrs, options);

            widgetButton.addBehaviour(scope, buttonData);
            widgetButton.supportDynamicTitle(scope, buttonData);

        };
        return {
            restrict: 'E',
            scope: {
                actionListener: '&actionlistener',
                puiDisabled: '=puiDisabled',
                rendered: '=rendered'
            },
            replace: true,
            template: '<button type="button" class="pui-button ui-widget ui-state-default ui-corner-all"> </button>',
            link: linkFn
        };

    }]);
}(window, document));