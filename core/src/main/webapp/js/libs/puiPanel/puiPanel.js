/*globals angular */

(function (window, document, undefined) {
    "use strict";

    angular.module('angular.widgets').factory('widgetPanel', ['$interpolate', 'widgetBase', function ($interpolate, widgetBase) {

        var widgetPanel = {};

        var determineOptions = function (scope, element, attrs) {

            var options = scope.$eval(attrs.binding) || attrs.binding || {};

            options.header = attrs.header || options.header;

            return options;

        };

        var isContentVisible = function (content) {
            return !content.hasClass('pui-hide');
        };


        var expandPanel = function (panelData) {
            if (!isContentVisible(panelData.content)) {
                if (panelData.options.toggleOrientation === 'horizontal') {
                    panelData.element.removeClass('pui-panel-collapsed-h');
                    panelData.element.css('width', panelData.orignalWidth);
                }
                widgetBase.showWithAnimation(panelData.content, function()  {
                    if (panelData.options.onStateChanged) {
                        panelData.options.onStateChanged();
                    }
                });
                if (panelData.toggler) {

                    panelData.toggler.children().toggleClass('ui-icon-plusthick').toggleClass('ui-icon-minusthick');
                }
            }

        };

        var collapsePanel = function (panelData) {
            if (isContentVisible(panelData.content)) {

                widgetBase.hideWithAnimation(panelData.content, function () {
                    if (panelData.options.toggleOrientation === 'horizontal') {
                        panelData.orignalWidth = panelData.element.css('width');
                        panelData.element.addClass('pui-panel-collapsed-h');

                    }
                    if (panelData.options.onStateChanged) {
                        panelData.options.onStateChanged();
                    }
                    panelData.toggler.children().toggleClass('ui-icon-plusthick').toggleClass('ui-icon-minusthick');
                });
            }
        };

        var programmaticCollapseSupport = function (scope, attrs, panelData) {
            if (panelData.options.collapsed !== undefined && attrs.binding.trim().charAt(0) !== '{') {
                scope.$watch(attrs.binding + '.collapsed', function (value) {
                    if (value === false) {
                        expandPanel(panelData);
                    }
                    if (value === true) {
                        collapsePanel(panelData);
                    }
                });
            }
        };

        var TitleSetter = function (panelElements) {
            this.titleSpan = panelElements.titleSpan;
        };

        TitleSetter.prototype.changedValue = function (newValue) {

            this.titleSpan.text(newValue);

        };

        var buildWidget = function (element, options) {
            var panelData = {};

            panelData.element = element;
            panelData.options = options;

            if (options.header) {
                element.prepend('<div class="pui-panel-titlebar ui-widget-header ui-helper-clearfix ui-corner-all"><span class="ui-panel-title">' +
                    options.header + "</span></div>").removeAttr('title');
            }

            panelData.header = element.childrenSelector('.pui-panel-titlebar');
            panelData.titleSpan = panelData.header.childrenSelector('.ui-panel-title');
            panelData.content = element.childrenSelector('.pui-panel-content');

            if (options.toggleable) {
                var icon = options.collapsed ? 'ui-icon-plusthick' : 'ui-icon-minusthick';

                panelData.toggler = angular.element('<a class="pui-panel-titlebar-icon ui-corner-all ui-state-default" href="#"><span class="ui-icon ' + icon + '"></span></a>');
                panelData.titleSpan.after(panelData.toggler);
                panelData.toggler.click(function (e) {
                    if (isContentVisible(panelData.content)) {
                        collapsePanel(panelData);

                    } else {
                        expandPanel(panelData);
                    }
                    e.preventDefault();
                });

                widgetBase.hoverAndFocus(panelData.toggler);
                if (options.collapsed) {
                    panelData.content.hide();
                }
            }

            if (options.closable) {
                var closer = angular.element('<a class="pui-panel-titlebar-icon ui-corner-all ui-state-default" href="#"><span class="ui-icon ui-icon-closethick"></span></a>');
                panelData.titleSpan.after(closer);
                closer.click(function (e) {
                    element.remove();
                    if (panelData.options.onClose) {
                        panelData.options.onClose();
                    }
                    e.preventDefault();
                });
                widgetBase.hoverAndFocus(closer);
            }

            return panelData;

        };

        widgetPanel.panelInStandaloneUsage = function (scope, element, attrs) {
            var options = determineOptions(scope, element, attrs),
                panelData = buildWidget(element, options);

            programmaticCollapseSupport(scope, attrs, panelData);
            if (panelData.options.header) {
                var titleObject = new TitleSetter(panelData);
                widgetBase.watchExpression(scope, $interpolate, widgetBase.getExpression(element, 'header'), titleObject);
            }

        };

        widgetPanel.panelInTabview = function (scope, element, attrs) {
            element.data('title', widgetBase.getExpression(element, 'header'));
        };
        return widgetPanel;
    }]);

    angular.module('angular.widgets').directive('puiPanel', ['widgetPanel', function (widgetPanel) {
        var linkFn = function (scope, element, attrs) {
            var withinPuiAccordion = element.parent().attr('pui-accordion') !== undefined,
                withinPuiTabview = element.parent().hasClass('pui-tabview-panels');

            if (withinPuiAccordion) {
                widgetPanel.panelInAccordion(scope, element, attrs);
            } else {
                if (withinPuiTabview) {
                    widgetPanel.panelInTabview(scope, element, attrs);
                } else {
                    widgetPanel.panelInStandaloneUsage(scope, element, attrs);
                }
            }

        };
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<div class="pui-panel ui-widget ui-widget-content ui-corner-all"> ' +
                ' <div ng-transclude class="pui-panel-content ui-widget-content"></div> </div>',
            link: linkFn
        };

    }]);
}(window, document));