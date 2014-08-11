/*globals angular */

(function (window, document, undefined) {
    "use strict";

    angular.module('angular.widgets').factory('datatablePaginator',  ['widgetBase', 'puiPaginatorTemplate', function (widgetBase, puiPaginatorTemplate) {
        var datatablePaginator = {};

        datatablePaginator.buildWidget = function (scope, element, attrs, _options) {
            var paginatorData = {},
                template = _options.template || '{FirstPageLink} {PreviousPageLink} {PageLinks} {NextPageLink} {LastPageLink}';

            paginatorData.rows = _options.rows;
            paginatorData.elementKeys = template.split(/[ ]+/);

            paginatorData.totalRecords = 0;
            paginatorData.paginatorContainer = angular.element("<div></div>");
            paginatorData.pageLinks = _options.pageLinks || 10;
            paginatorData.page = 0;

            if (_options.onPage) {

                paginatorData.onPage = _options.onPage;
            }

            paginatorData.getPageCount = function() {
                return Math.ceil(this.totalRecords / this.rows)||1;
            };

            return paginatorData;
        };

        datatablePaginator.initialize = function(paginatorData, data, updateCallback) {
            paginatorData.totalRecords = data.length;
            paginatorData.updateCallback = updateCallback;
            this.renderPaginator(paginatorData);
        };

        datatablePaginator.updateUI = function (paginatorData) {
            for (var elementKey in paginatorData.paginatorElements) {
                puiPaginatorTemplate.getTemplate(elementKey).update(paginatorData.paginatorElements[elementKey], paginatorData);
            }
            paginatorData.updateCallback();
        };

        datatablePaginator.setPage = function(paginatorData, page) {
            paginatorData.page = parseInt(page, 10);

            datatablePaginator.updateUI(paginatorData);
            if (paginatorData.onPage) {
                paginatorData.onPage('pageSelection', page);
            }
        };

        datatablePaginator.renderPaginator = function(paginatorData) {
            paginatorData.paginatorContainer.addClass('pui-paginator ui-widget-header');
            paginatorData.paginatorElements = [];
            for (var i = 0; i < paginatorData.elementKeys.length; i++) {
                var elementKey = paginatorData.elementKeys[i],
                    handler = puiPaginatorTemplate.getTemplate(elementKey);

                if (handler) {
                    var paginatorElement = handler.create(paginatorData, this.setPage);
                    paginatorData.paginatorElements[elementKey] = paginatorElement;
                    paginatorData.paginatorContainer.append(paginatorElement);
                }
            }
        };

        return datatablePaginator;
    }]);

    angular.module('angular.widgets').factory('puiPaginatorTemplate', function () {
        var elementHandlers = {},
            puiPaginatorTemplate = {};

        puiPaginatorTemplate.addTemplate = function (name, handler) {
            elementHandlers[name] = handler;
        };

        puiPaginatorTemplate.getTemplate = function(key) {
            return elementHandlers[key];
        };

        return puiPaginatorTemplate;
    });

    angular.module('angular.widgets').run(['puiPaginatorTemplate', 'widgetBase', function (puiPaginatorTemplate, widgetBase) {

        puiPaginatorTemplate.addTemplate('{FirstPageLink}',
            {
                markup: '<span class="pui-paginator-first pui-paginator-element ui-state-default ui-corner-all"><span class="ui-icon ui-icon-seek-first">p</span></span>',

                create: function (paginatorData, callback) {
                    var element = angular.element(this.markup);

                    if (paginatorData.page === 0) {
                        element.addClass('ui-state-disabled');
                    }

                    widgetBase.hoverAndFocus(element);

                    element.clickWhenActive(function(e) {
                        callback(paginatorData, 0);
                    });


                    return element;
                },

                update: function (element, state) {
                    if (state.page === 0)
                        element.addClass('ui-state-disabled').removeClass('ui-state-hover ui-state-active');
                    else
                        element.removeClass('ui-state-disabled');
                }
            });

        puiPaginatorTemplate.addTemplate('{PreviousPageLink}',
            {
                markup: '<span class="pui-paginator-prev pui-paginator-element ui-state-default ui-corner-all"><span class="ui-icon ui-icon-seek-prev">p</span></span>',

                create: function (paginatorData, callback) {
                    var element = angular.element(this.markup);

                    if (paginatorData.page === 0) {
                        element.addClass('ui-state-disabled');
                    }

                    widgetBase.hoverAndFocus(element);

                    element.clickWhenActive(function(e) {
                        callback(paginatorData, paginatorData.page - 1);
                    });

                    return element;
                },

                update: function (element, state) {
                    if (state.page === 0)
                        element.addClass('ui-state-disabled').removeClass('ui-state-hover ui-state-active');
                    else
                        element.removeClass('ui-state-disabled');
                }
            });

        puiPaginatorTemplate.addTemplate('{NextPageLink}',
            {
                markup: '<span class="pui-paginator-next pui-paginator-element ui-state-default ui-corner-all"><span class="ui-icon ui-icon-seek-next">p</span></span>',

                create: function (paginatorData, callback) {
                    var element = angular.element(this.markup);

                    if (paginatorData.page === (paginatorData.getPageCount() - 1)) {
                        element.addClass('ui-state-disabled').removeClass('ui-state-hover ui-state-active');
                    }

                    widgetBase.hoverAndFocus(element);

                    element.clickWhenActive(function(e) {
                        callback(paginatorData, paginatorData.page + 1);
                    });

                    return element;
                },

                update: function (element, state) {
                    if (state.page === (state.pageCount - 1)) {
                        element.addClass('ui-state-disabled').removeClass('ui-state-hover ui-state-active');
                    }
                    else {
                        element.removeClass('ui-state-disabled');
                    }
                }
            });

        puiPaginatorTemplate.addTemplate('{LastPageLink}',
            {
                markup: '<span class="pui-paginator-last pui-paginator-element ui-state-default ui-corner-all"><span class="ui-icon ui-icon-seek-end">p</span></span>',

                create: function (paginatorData, callback) {
                    var element = angular.element(this.markup);

                    if (paginatorData.page === (paginatorData.getPageCount() - 1)) {
                        element.addClass('ui-state-disabled').removeClass('ui-state-hover ui-state-active');
                    }

                    widgetBase.hoverAndFocus(element);

                    element.clickWhenActive(function(e) {
                        callback(paginatorData, paginatorData.getPageCount() - 1);
                    });


                    return element;
                },

                update: function (element, state) {
                    if (state.page === (state.pageCount - 1)) {
                        element.addClass('ui-state-disabled').removeClass('ui-state-hover ui-state-active');
                    }
                    else {
                        element.removeClass('ui-state-disabled');
                    }
                }
            });

        puiPaginatorTemplate.addTemplate('{PageLinks}',
            {
                markup: '<span class="pui-paginator-pages"></span>',

                create: function (paginatorData, callback) {
                    var element = angular.element(this.markup),
                        boundaries = this.calculateBoundaries({
                            page: paginatorData.page,
                            pageLinks: paginatorData.pageLinks,
                            pageCount: paginatorData.getPageCount()
                        }),
                        start = boundaries[0],
                        end = boundaries[1];

                    for (var i = start; i <= end; i++) {
                        var pageLinkNumber = (i + 1),
                            pageLinkElement = angular.element('<span class="pui-paginator-page pui-paginator-element ui-state-default ui-corner-all">' + pageLinkNumber + "</span>");

                        if (i === paginatorData.page) {
                            pageLinkElement.addClass('ui-state-active');
                        }

                        element.append(pageLinkElement);
                    }

                    var pageLinks = angular.element(element.children());

                    widgetBase.hoverAndFocus(pageLinks);
                    pageLinks.click(function (e) {
                        var link = angular.element(e.target);
                        if (!link.hasClass('ui-state-disabled') && !link.hasClass('ui-state-active')) {
                            link.removeClass('ui-state-hover');
                            callback(paginatorData, parseInt(link.text(), 10) - 1);
                        }

                    });

                    return element;
                },

                update: function (element, state) {
                    var pageLinks = element.children(),
                        start = 0,
                        end = pageLinks.length - 1,
                        p = 0;

                    for (var i = start; i <= end; i++) {
                        var pageLinkNumber = (i + 1),
                            pageLink = pageLinks.eq(p);

                        pageLink.removeClass('ui-state-active');

                        if (i === state.page) {
                            pageLink.addClass('ui-state-active');
                        }

                        pageLink.text(pageLinkNumber);

                        p++;
                    }
                },

                calculateBoundaries: function (config) {
                    var page = config.page,
                        pageLinks = config.pageLinks,
                        pageCount = config.pageCount,
                        visiblePages = Math.min(pageLinks, pageCount);

                    //calculate range, keep current in middle if necessary
                    var start = Math.max(0, parseInt(Math.ceil(page - ((visiblePages) / 2)), 10)), // Changed for AngularWidgets
                        end = Math.min(pageCount - 1, start + visiblePages - 1);

                    //check when approaching to last page
                    var delta = pageLinks - (end - start + 1);
                    start = Math.max(0, start - delta);

                    return [start, end];
                }
            });

    }]);

}(window, document));
