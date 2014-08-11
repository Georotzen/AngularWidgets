/*globals angular AngularWidgets*/

(function (window, document, undefined) {
    "use strict";

    angular.module('angular.widgets').factory('widgetTabview', ['$interpolate', '$compile', 'widgetBase', 'contentLoadingService',
                          function($interpolate, $compile, widgetBase, contentLoadingService) {
        var widgetTabview = {};

        widgetTabview.dynamicData = function(scope, attrs) {
            return scope.$eval(attrs.dynamic);
        };

        widgetTabview.determineOptions = function (scope, element, attrs) {

            var options = scope.$eval(attrs.binding) || attrs.binding || {};

            options.activeIndex = options.activeIndex || 0;
            options.closeable = options.closeable || attrs.closeable;
            options.orientation = options.orientation || attrs.orientation;
            if (attrs.ontabchange) {

                options.onTabChange = scope.$eval(attrs.ontabchange);
            }

            return options;

        };

        widgetTabview.activeTabChanged = function (tabviewData) {
            var tabs = tabviewData.navContainer.children(),
                panels = tabviewData.panels;

            for (var i = 0; i < tabs.length; i++) {

                if (i == tabviewData.options.activeIndex) {
                    angular.element(panels[i]).removeClass('ui-helper-hidden');
                    angular.element(tabs[i]).addClass('pui-tabview-selected ui-state-active');
                } else {
                    angular.element(panels[i]).addClass('ui-helper-hidden');
                    angular.element(tabs[i]).removeClass('pui-tabview-selected ui-state-active ui-state-hover');
                }

            }
        };

        widgetTabview.bindEvents = function(tabviewData) {
            var tabs = tabviewData.navContainer.children();
            for (var i = 0; i < tabs.length; i++) {
                var tab = angular.element(tabs[i]);
                // TODO Function declaration outside loop?
                tab.data('index', i).click(function (e) {
                    e.preventDefault();
                    var target = e.target,
                        linkTarget = target.nodeName === 'A',
                        dataElement = linkTarget ? e.target.parentElement : e.target,
                        newIndex = angular.element(dataElement).data('index');

                    if (tabviewData.options.activeIndex !== newIndex) {
                        tabviewData.options.activeIndex = newIndex;
                        widgetTabview.activeTabChanged(tabviewData);
                        if (tabviewData.options.onTabChange) {
                            tabviewData.options.onTabChange(newIndex);
                        }
                    }
                });

                widgetBase.hoverAndFocus(tab);
            }

        };

        var panelTitle = function(panel) {
            var _panel = angular.element(panel);
            return _panel.data('title');
        };

        widgetTabview.buildTabControlHtml = function(panel) {
            var _panel = angular.element(panel);

            return '<li class="ui-state-default ui-corner-top"><a href="#d_'+_panel.attr('id')+'">'+panelTitle(panel)+'</a></li>';

        };

        widgetTabview.removeTab = function(tabviewData, index) {
            tabviewData.navContainer.children()[index].remove();
            tabviewData.panels[index].remove();

            if (tabviewData.options.activeIndex > tabviewData.navContainer.children().length - 1) {
                tabviewData.options.activeIndex = tabviewData.navContainer.children().length - 1;
            }
            widgetTabview.activeTabChanged(tabviewData);
            widgetTabview.resetIndexData(tabviewData, index);
        };

        widgetTabview.resetIndexData = function(tabviewData, index) {
            var tabs = tabviewData.navContainer.children();

            if (index > tabs.length) {
                // Last tab removed, no reset needed.
                return;
            }
            for (var i = index; i < tabs.length; i++) {
                var tab = angular.element(tabs[i]),
                    closer = angular.element(tab.childrenSelector('.ui-icon-close'));

                tab.data('index', i);
                closer.data('index', i);
            }
        };

        widgetTabview.supportForCloseableTabs = function (tabviewData) {
                var tabs = tabviewData.navContainer.children();
                for (var i = 0; i < tabs.length; i++) {
                    var tab = angular.element(tabs[i]);
                    tab.children().after('<span class="ui-icon ui-icon-close"></span>');
                    var closer = angular.element(tab.childrenSelector('.ui-icon-close'));

                    closer.data('index', i).click(function (e) {
                        var index = angular.element(e.target).data('index');
                        widgetTabview.removeTab(tabviewData, index);
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    });
                }

        };

        var TitleSetter = function(tabHeader) {
            this.titleLink = angular.element(tabHeader).childrenSelector('a');
        };

        TitleSetter.prototype.changedValue = function(newValue) {

            this.titleLink.text(newValue);

        };

        widgetTabview.supportDynamicTitle = function (scope, tabviewData) {
            var idx = 0,
                tabs = tabviewData.navContainer.children();

            angular.forEach(tabviewData.panels, function(panel) {

                var titleObject = new TitleSetter(tabs[idx++]);
                widgetBase.watchExpression(scope, $interpolate, panelTitle(panel), titleObject);

            });

        };

        widgetTabview.supportForDynamicTabChange = function (scope, tabviewData) {
            tabviewData.options.setActiveTab = function (value) {
                tabviewData.options.activeIndex = value;
                widgetTabview.activeTabChanged(tabviewData);
            };

        };

        widgetTabview.dynamicTabsData = function (scope, element, attrs, options, urls) {
            var content = [];

            return {
                loadHtmlContents: function () {
                    var remaining = urls.length,
                        $this = this;
                    content = [];
                    for (var i = 0; i < urls.length; i++) {
                        (function() {
                            var idx = i;
                            contentLoadingService.loadHtmlContents(urls[i], function (panelHtml) {
                                //content.push(panelHtml);
                                content[idx] = panelHtml;
                                remaining--;
                                if (remaining === 0) {
                                    $this.renderTabPanels();
                                }
                            });
                        })();
                    }

                },

                renderTabPanels: function() {
                    var htmlContent = '';
                    angular.forEach(content, function(panelContent) {
                        htmlContent = htmlContent + panelContent;
                    });

                    var tmp = angular.element(htmlContent),
                        children = AngularWidgets.filter(tmp, function(elem) {
                            return elem.nodeName === 'PUI-PANEL' ;
                        }),
                        panels = angular.element(element.childrenSelector('.pui-tabview-panels'));

                    angular.forEach(panels.children(), function(elem) {
                        elem.remove();
                    });

                    angular.forEach(children, function(elem) {
                        panels[0].appendChild(elem);
                        $compile(elem)(scope);
                    });

                    widgetTabview.handleNonDynamicSituation(scope, element, attrs);
                }

            };
        };

        widgetTabview.loadAndRenderTabPanels = function(data) {
            data.loadHtmlContents();
        };

        widgetTabview.buildWidget = function(scope, element, options, panels) {
            var tabviewData = {};

            tabviewData.navContainer = element.childrenSelector('.pui-tabview-nav');
            tabviewData.panels = panels;
            tabviewData.options = options;

            var links = '';
            angular.forEach(panels, function(panel) {

                links += widgetTabview.buildTabControlHtml(panel);
            });
            tabviewData.navContainer.html(links);
            if (options.orientation === 'left') {
                element.addClass('pui-tabview-left');
            }

            return tabviewData;
        };

        widgetTabview.handleNonDynamicSituation = function(scope, element, attrs) {
            var panels = element.findAllSelector('.pui-panel'),
                options = widgetTabview.determineOptions(scope, element, attrs),
                tabviewData = widgetTabview.buildWidget(scope, element, options, panels);

            tabviewData.attrs = attrs;
            widgetTabview.activeTabChanged(tabviewData);
            widgetTabview.bindEvents(tabviewData);

            if (tabviewData.options.closeable === "true") {
                widgetTabview.supportForCloseableTabs(tabviewData);
            }
            widgetTabview.supportDynamicTitle(scope, tabviewData);
            widgetTabview.supportForDynamicTabChange(scope, tabviewData);
        };

        widgetTabview.handleDynamicSituation = function(scope,element, attrs, dynamicData) {
            var options = widgetTabview.determineOptions(scope, element, attrs);

            scope.$watch(attrs.dynamic, function(x) {
                var data = new widgetTabview.dynamicTabsData(scope, element, attrs, options, x);
                widgetTabview.loadAndRenderTabPanels(data);
            }, true);


        };

        return widgetTabview;
    }]);

    angular.module('angular.widgets').directive('puiTabview', ['widgetTabview', function (widgetTabview) {

        var linkFn = function (scope, element, attrs) {
            var dynamicData = widgetTabview.dynamicData(scope, attrs);

            if (dynamicData) {
                widgetTabview.handleDynamicSituation(scope, element, attrs, dynamicData);
            } else {
                widgetTabview.handleNonDynamicSituation(scope, element, attrs);
            }


        };

        return {
            restrict: 'E',
            replace : true,
            transclude: true,

            template : '<div class="pui-tabview ui-widget ui-widget-content ui-corner-all ui-hidden-container"> ' +
                ' <ul class="pui-tabview-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" ></ul>' +
                ' <div ng-transclude class="pui-tabview-panels"></div> </div>',
            link : linkFn
        };
    }]);

    angular.module('angular.widgets').factory('contentLoadingService', ['$http', '$templateCache', '$log', function ($http, $templateCache, $log) {
        return {
            loadHtmlContents: function (url, callback) {
                $http.get(url, {cache: $templateCache}).success(function (response) {
                    callback(response);
                }).error(function () {
                        $log.error('Error loading file ' + url);
                    });

            }

        };
    }]);

}(window, document));