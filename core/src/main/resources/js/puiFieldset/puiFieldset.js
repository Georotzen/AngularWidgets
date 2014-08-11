/*globals angular */

(function(window, document, undefined) {
    "use strict";

    angular.module('angular.widgets').factory('widgetFieldset', ['$interpolate', 'widgetBase', function($interpolate,  widgetBase) {
        var widgetFieldset = {};

        widgetFieldset.determineOptions =  function(scope, element, attrs) {
            var options = scope.$eval(attrs.binding) || attrs.binding || {};

            options.legend = attrs.legend || options.legend;
            options.toggleable = attrs.toggleable || options.toggleable;

            return options;
        };

        widgetFieldset.buildWidget = function(element, options) {
            var fieldsetData = {};

            fieldsetData.element = element;
            fieldsetData.legend = element.childrenSelector('legend');
            fieldsetData.legendText = fieldsetData.legend.childrenSelector('.pui-fieldset-legend-text');
            fieldsetData.options = options;
            fieldsetData.content = element.childrenSelector('.pui-fieldset-content');

            if (options.legend) {
                fieldsetData.legend.addClass('pui-fieldset-legend ui-corner-all ui-state-default');

                fieldsetData.legendText.text(options.legend);
            }


            if (options.toggleable) {
                widgetFieldset.supportForToggle(fieldsetData);
            }

            return fieldsetData;


        };

        widgetFieldset.isContentNotDisplayed = function(fieldsetData) {
            return fieldsetData.content.css('display') === 'none';
        };

        widgetFieldset.supportForToggle = function (fieldsetData) {
            fieldsetData.element.addClass('pui-fieldset-toggleable');

            fieldsetData.toggler = angular.element('<span class="pui-fieldset-toggler ui-icon" />');
            fieldsetData.legend.prepend(fieldsetData.toggler);

            widgetFieldset.bindEvents(fieldsetData);

            if (fieldsetData.options.collapsed) {
                fieldsetData.content.hide();
                fieldsetData.toggler.addClass('ui-icon-plusthick');
            } else {
                fieldsetData.toggler.addClass('ui-icon-minusthick');
            }

        };

        widgetFieldset.bindEvents = function (fieldsetData) {

            widgetBase.hoverAndFocus(fieldsetData.legend);
            fieldsetData.toggler.click(function(e) {
                e.preventDefault();
                if (fieldsetData.options.collapsed) {
                   expand(fieldsetData);
                } else {
                    collapse(fieldsetData);
                }
            });

        };

        var collapse = function (fieldsetData) {
            fieldsetData.toggler.removeClass('ui-icon-minusthick').addClass('ui-icon-plusthick');
            widgetBase.hideWithAnimation(fieldsetData.content, function() {
                if (fieldsetData.options.onStateChanged) {
                    fieldsetData.options.onStateChanged();
                }
            });
            fieldsetData.options.collapsed = true;

        };

        var expand = function (fieldsetData) {
            if (widgetFieldset.isContentNotDisplayed(fieldsetData)) {
                // There is probably also the pui-hide active, so not yet visible
                fieldsetData.content.show();
            }
            fieldsetData.toggler.removeClass('ui-icon-plusthick').addClass('ui-icon-minusthick');
            widgetBase.showWithAnimation(fieldsetData.content, function() {
                if (fieldsetData.options.onStateChanged) {
                    fieldsetData.options.onStateChanged();
                }
            });
            fieldsetData.options.collapsed = false;

        };

        var programmaticCollapseSupport = function (scope, attrs, fieldsetData) {
            if (fieldsetData.options.collapsed !== undefined && attrs.binding.trim().charAt(0) !== '{') {
                scope.$watch(attrs.binding + '.collapsed', function (value) {
                    if (value === false) {
                        expand(fieldsetData);
                    }
                    if (value === true) {
                        collapse(fieldsetData);
                    }
                });
            }
        };

        var TitleSetter = function (fieldsetData) {
            this.legendText = fieldsetData.legendText;
        };

        TitleSetter.prototype.changedValue = function (newValue) {

            this.legendText.text(newValue);

        };

        widgetFieldset.dynamicSupport = function (scope, attrs, fieldsetData) {
            programmaticCollapseSupport(scope, attrs, fieldsetData);

            var titleObject = new TitleSetter(fieldsetData);
            widgetBase.watchExpression(scope, $interpolate, widgetBase.getExpression(fieldsetData.element, 'legend'), titleObject);

        };

        return widgetFieldset;
    }]);

    angular.module('angular.widgets').directive('puiFieldset', ['widgetFieldset', function (widgetFieldset) {
        var linkFn = function (scope, element, attrs) {
            var options = widgetFieldset.determineOptions(scope, element, attrs),
                fieldsetData = widgetFieldset.buildWidget(element, options);


            widgetFieldset.dynamicSupport(scope, attrs, fieldsetData);

        };
        return {
            restrict: 'E',
            replace : true,
            transclude : true,
            template : '<fieldset class="pui-fieldset ui-widget ui-widget-content ui-corner-all"> ' +
                '<legend><span class="pui-fieldset-legend-text" ></span></legend> <div ng-transclude class="pui-fieldset-content"></div> </fieldset>',
            link : linkFn
        };

    }]);
}(window, document));
