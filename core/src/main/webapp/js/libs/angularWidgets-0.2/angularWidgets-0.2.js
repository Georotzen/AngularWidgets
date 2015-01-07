/*globals angular AngularWidgets */

(function(window, document, undefined) {
    "use strict";

    window.AngularWidgets = {};

    AngularWidgets.classSelectorSelection = function(elements, classSelector) {
        var result = [];
        angular.forEach(elements, function (child) {
            if (angular.element(child).hasClass(classSelector)) {
                result.push(child);
            }
        }, result);

        return result;
    };

    AngularWidgets.tagSelectorSelection = function(elements, tagSelector) {
        var result = [];
        angular.forEach(elements, function (child) {
            if (child.nodeName === tagSelector) {
                result.push(child);
            }
        }, result);

        return result;
    };

    AngularWidgets.idSelectorSelection = function(elements, idSelector) {
        var result = [];
        angular.forEach(elements, function (child) {
            if (child.id  === idSelector) {
                result.push(child);
            }
        }, result);

        return result;
    };

    AngularWidgets.wrapAll = function (children, wrapNodeHtml) {
        var parent = angular.element(children[0]).parent(),
            wrapNode = angular.element(wrapNodeHtml)[0];

        angular.forEach(children, function (child) {
            wrapNode.appendChild(child);

        });
        parent[0].appendChild(wrapNode);
        //Error: A Node was inserted somewhere it doesn't belong.
        //children[0].parentNode.appendChild(wrapNode);
    };

    AngularWidgets.filter = function (collection, predicate) {
        var result = [];
        angular.forEach(collection, function(element) {
            if (predicate(element)) {
                result.push(element);
            }
        });
        return result;
    };

    AngularWidgets.scrollInView = function (container, item) {
        if (item.offsetTop > (container.offsetHeight + container.scrollTop)) {
            container.scrollTop = item.offsetTop - container.offsetHeight + item.offsetHeight;
        }
        if (item.offsetTop < container.scrollTop) {
            container.scrollTop = item.offsetTop;
        }
    };

    AngularWidgets.inArray = function(arr, item) {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i] === item) {
                return true;
            }
        }

        return false;
    };

    angular.module('angular.widgets.config', []).value('angular.widgets.config', {
            labelPrefix: 'lbl'
        });

    var angularService = angular.module('angular.service', ['ngAnimate']);

    angularService.factory('widgetBase', ['$interpolate', '$animate', function ($interpolate, $animate) {
        var widgetBase = {};

        widgetBase.hoverAndFocus = function (element) {
            var items = angular.isArray(element) ? element : [].concat(element);
            angular.forEach(items, function (item) {

                item.hover(function () {
                    var $this = angular.element(this);
                    if (!$this.hasClass('ui-state-active') && !$this.hasClass('ui-state-disabled')) {
                        $this.addClass('ui-state-hover');
                    }
                }, function () {
                    var $this = angular.element(this);
                    if (!$this.hasClass('ui-state-active')) {
                        $this.removeClass('ui-state-hover');
                    }
                });


                item.focus(function () {
                    element.addClass('ui-state-focus');
                });

                item.blur(function () {
                    element.removeClass('ui-state-focus');
                });
            });

        };

        widgetBase.supportHighlight = function (element) {
            var items = angular.isArray(element) ? element : [].concat(element);
            angular.forEach(items, function (item) {

                item.hover(function () {
                    var $this = angular.element(this);
                    $this.toggleClass('ui-state-highlight');
                });

            });

        };

        widgetBase.resetHoverAndFocus = function (element) {
            element.unbind("mouseenter");
            element.unbind("mouseleave");
            element.unbind("focus");
            element.unbind("blur");
        };

        widgetBase.hideWithAnimation = function(element, doneCallback) {
            $animate.addClass(element, 'pui-hide', doneCallback);
        };

        widgetBase.showWithAnimation = function(element, doneCallback) {
            $animate.removeClass(element, 'pui-hide', doneCallback);
        };

        widgetBase.watchPuiDisabled = function(scope, widgetData, callback) {
            scope.$watch('puiDisabled', function (value) {

                callback(widgetData, value);
            });
        };
        widgetBase.watchRendered = function(scope, widgetData, callback) {
            scope.$watch('rendered', function (value) {

                callback(widgetData, value);
            });
        };

        widgetBase.watchExpression = function(scope, $interpolate, expression, feedbackObject) {
            var parsedExpression = $interpolate(expression),
                titleWatches = [];

            angular.forEach(parsedExpression.parts, function (part) {
                if (angular.isFunction(part)) {
                    titleWatches.push(part.exp);
                }
            }, titleWatches);

            angular.forEach(titleWatches, function(watchValue) {
                scope.$watch(watchValue, function (value) {
                    feedbackObject.changedValue(scope.$eval(parsedExpression));
                });
            });

            feedbackObject.changedValue(scope.$eval(parsedExpression));  // define initial value

        };

        widgetBase.getExpression = function(element, property) {
           return element[0].attributes[property].value;
        };

        widgetBase.keyCode = {
            BACKSPACE: 8,
            COMMA: 188,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            NUMPAD_ADD: 107,
            NUMPAD_DECIMAL: 110,
            NUMPAD_DIVIDE: 111,
            NUMPAD_ENTER: 108,
            NUMPAD_MULTIPLY: 106,
            NUMPAD_SUBTRACT: 109,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38
        };

        return widgetBase;
    }]);

    angular.module('angular.widgets', ['angular.widgets.config', 'angular.service']).run(['$rootScope', '$document', function ($rootScope, $document) {

        $rootScope.safeApply = function (fn) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };

        $rootScope.focus = function(selector) {
            var elements = $document.findAllSelector(selector);
            elements[0].focus();
        }

    }]);

    angular.module('angular.widgets').value('version', "v0.2");

    angular.forEach({
        hover: function hoverFn(element, fnEnter, fnLeave) {
            angular.element(element).bind('mouseenter', fnEnter).bind('mouseleave', fnLeave ||fnEnter);
        },
        focus: function focusFn(element, fn) {
            angular.element(element).bind('focus', fn);
        },
        blur: function blurFn(element, fn) {
            angular.element(element).bind('blur', fn);
        },
        mousedown: function mouseDownFn(element, fn) {
            angular.element(element).bind('mousedown', fn);
        },
        mouseup: function mouseUpFn(element, fn) {
            angular.element(element).bind('mouseup', fn);
        },
        click: function clickFn(element, fn) {
            angular.element(element).bind('click', fn);
        },
        clickWhenActive: function ClickActiveFn(element, fn) {
            angular.element(element).click(function(e) {
                var element = angular.element(e.target);
                if (!element.hasClass("ui-state-disabled") && !element.parent().hasClass("ui-state-disabled")) {
                    fn(e);
                }
            });
        },
        hide: function clickFn(element) {
            angular.element(element).css('display', 'none');
        },
        show: function clickFn(element) {
            angular.element(element).css('display', '');
        },
        showAsBlock: function clickFn(element) {
            // TODO animations
            angular.element(element).css('display', 'Block');
        },
        is: function isFn(element, tagName) {
            return element.nodeName.toLowerCase() === tagName;
        },
        childrenSelector: function childrenFn (element, selector) {
            var children = angular.element(element).children(),
                selectorType = selector.substring(0,1);

            if (children.length === 0) {
                return undefined;
            }

            if (selectorType === '.') {
                return AngularWidgets.classSelectorSelection(children, selector.substring(1));
            }
            return AngularWidgets.tagSelectorSelection(children, angular.uppercase(selector));
        },
        findAll: function findAllFn (element) {
            var result = [],
                children = angular.element(element).children();

            angular.forEach(children, function(child) {
                this.push(child);
                var items = angular.element(child).findAll();
                    angular.forEach(items, function(item) {
                        this.push(item);
                    }, this);
            }, result);
            return result;
        },
        findAllSelector: function(element, selector) {
            var allChildren = angular.element(element).findAll(),
                selectorType = selector.substring(0,1);

            if (allChildren.length === 0) {
                return allChildren;
            }

            if (selectorType === '.') {
                return AngularWidgets.classSelectorSelection(allChildren, selector.substring(1));
            }
            if (selectorType === '#') {
                return AngularWidgets.idSelectorSelection(allChildren, selector.substring(1));
            }
            return AngularWidgets.tagSelectorSelection(allChildren, angular.uppercase(selector));
        },
        wrapContents: function wrapFn(element, wrapNodeHtml ) {
            var parent = angular.element(element),
                wrapNode = angular.element(wrapNodeHtml)[0],
                contents = parent.contents();

            angular.forEach(contents, function (child) {
              wrapNode.appendChild(child);
            });
            while (element.lastChild) {
                element.removeChild(element.lastChild);
            }
            element.appendChild(wrapNode);
        },
        siblings: function siblingFn(element) {
            var n =  element.parentNode.firstChild,
                result = [];
            for ( ; n; n = n.nextSibling ) {
                if ( n.nodeType === 1 && n !== element ) {
                    result.push( n );
                }
            }
            return result;
        },
        position: function positionFn(element, options) {
            AngularWidgets.position.position(element, options);
        },
        height: function heightFn(element) {
            return AngularWidgets.position.getDimensions(element).height;
        }

    }, function(fn, name) {
        /**
         * chaining functions
         */
        var jqLite = angular.element;
        jqLite.prototype[name] = function (arg1, arg2) {
            var value;
            for (var i = 0; i < this.length; i++) {
                if (value === undefined) {
                    value = fn(this[i], arg1, arg2);
                    if (value !== undefined) {
                        // any function which returns a value needs to be wrapped
                        value = jqLite(value);
                    }
                } else {
                    JQLiteAddNodes(value, fn(this[i], arg1, arg2));
                }
            }
            return value === undefined ? this : value;
        };


        AngularWidgets.position = {};

        AngularWidgets.position.regex = {

            rhorizontal: /left|center|right/,
            rvertical: /top|center|bottom/,
            roffset: /[\+\-]\d+(\.[\d]+)?%?/,
            rposition: /^\w+/,
            rpercent: /%$/
        };


        AngularWidgets.position.getDimensions = function (elem) {
            var clientRect = elem.getBoundingClientRect();
            return {
                width: clientRect.width || (clientRect.right - clientRect.left),
                height: clientRect.height || (clientRect.bottom - clientRect.top),
                offset: {
                    top: clientRect.top,
                    left: clientRect.left
                }
            };
        };


        AngularWidgets.position.check = function (options) {
            // force my and at to have valid horizontal and vertical positions
            // if a value is missing or invalid, it will be converted to center
            angular.forEach([ "my", "at" ], function (item) {
                var pos = ( options[ item ] || "" ).split(" "),
                    regex = AngularWidgets.position.regex;

                if (pos.length === 1) {
                    pos = regex.rhorizontal.test(pos[ 0 ]) ?
                        pos.concat([ "center" ]) :
                        regex.rvertical.test(pos[ 0 ]) ?
                            [ "center" ].concat(pos) :
                            [ "center", "center" ];
                }
                pos[ 0 ] = regex.rhorizontal.test(pos[ 0 ]) ? pos[ 0 ] : "center";
                pos[ 1 ] = regex.rvertical.test(pos[ 1 ]) ? pos[ 1 ] : "center";

                // reduce to just the positions without the offsets
                options[ item ] = [
                    regex.rposition.exec(pos[ 0 ])[ 0 ],
                    regex.rposition.exec(pos[ 1 ])[ 0 ]
                ];
            });
        };

        AngularWidgets.position.position = function (element, options) {

            var targetWidth, targetHeight, basePosition, dimensions,
                target = options.of;

            dimensions = this.getDimensions(target[0]);
            this.check(options);

            targetWidth = dimensions.width;
            targetHeight = dimensions.height;
            basePosition = dimensions.offset;

            if (options.at[ 0 ] === "right") {
                basePosition.left += targetWidth;
            } else if (options.at[ 0 ] === "center") {
                basePosition.left += targetWidth / 2;
            }

            if (options.at[ 1 ] === "bottom") {
                basePosition.top += targetHeight;
            } else if (options.at[ 1 ] === "center") {
                basePosition.top += targetHeight / 2;
            }

            element.style.position = "absolute";
            element.style.left = basePosition.left + "px";
            element.style.top = basePosition.top + "px";
        };
    });
}(window, document));
;
/*globals angular AngularWidgets*/

(function(window, document, undefined) {
    "use strict";

    angular.module('angular.widgets').factory('widgetAutocomplete', ['$timeout', '$parse', '$document', 'widgetBase', 'widgetInputText',
                      function ($timeout, $parse, $document, widgetBase, widgetInputText) {

        var widgetAutocomplete = {};

        widgetAutocomplete.determineOptions = function (scope, element, attrs) {
            var options = scope.$parent.$eval(attrs.binding) || {};
            options.minQueryLength = attrs.minQueryLength || options.minQueryLength || 2;
            if (attrs.completemethod) {

                options.completeMethod = scope.$parent.$eval(attrs.completemethod);
            }
            options.dropdown = attrs.dropdown || options.dropdown;
            options.scrollHeight = attrs.scrollheight || options.scrollHeight ;
            return options;
        };

        widgetAutocomplete.buildWidget = function (element, attrs, options) {
            var autocompleteData = {},
                children = element.children(),
                inputElement = AngularWidgets.tagSelectorSelection(children, 'INPUT'),
                panelElement = AngularWidgets.classSelectorSelection(children, 'pui-autocomplete-panel');

            autocompleteData.element = angular.element(inputElement[0]);
            autocompleteData.inputData = widgetInputText.buildWidget(autocompleteData.element, attrs, options);

            autocompleteData.panel = angular.element(panelElement[0]);
            autocompleteData.options = options;

            if(options.multiple) {
                element.wrap('<ul class="pui-autocomplete-multiple ui-widget pui-inputtext ui-state-default ui-corner-all">' +
                    '<li class="pui-autocomplete-input-token"></li></ul>');
                autocompleteData.inputContainer = element.parent();
                autocompleteData.multiContainer = autocompleteData.inputContainer.parent();
            }
            else {
                if (options.dropdown) {
                    autocompleteData.dropdownBtn = angular.element('<button type="button" class="pui-button ui-widget ui-state-default ui-corner-right pui-button-icon-only">' +
                        '<span class="pui-autocomplete-dropdown pui-button-icon-primary ui-icon ui-icon-triangle-1-s"></span><span class="pui-autocomplete-dropdown pui-button-text">&nbsp;</span></button>');
                    element.after(autocompleteData.dropdownBtn);
                    element.removeClass('ui-corner-all').addClass('ui-corner-left');
                }
            }
            this.bindKeyEvents(autocompleteData);
            this.bindEvents(autocompleteData);

            return autocompleteData;
        };

        widgetAutocomplete.bindKeyEvents = function(autocompleteData) {
            var $this = this;

            autocompleteData.element.bind('keyup', function(e) {
                var keyCode = widgetBase.keyCode,
                    key = e.which,
                    shouldSearch = true;

                if(key === keyCode.UP ||
                    key === keyCode.LEFT ||
                    key === keyCode.DOWN ||
                    key === keyCode.RIGHT ||
                    key === keyCode.TAB ||
                    key === keyCode.SHIFT ||
                    key === keyCode.ENTER ||
                    key === keyCode.NUMPAD_ENTER) {
                    shouldSearch = false;
                }

                if(shouldSearch) {
                    var value = autocompleteData.element.val();

                    if(!value.length) {
                        $this.hide();
                    }

                    if(value.length >= autocompleteData.options.minQueryLength) {
                        if(autocompleteData.timeout) {
                            autocompleteData.timeout.cancel();
                        }

                        autocompleteData.timeout = $timeout(function() {
                            $this.search(autocompleteData, value);
                        }, autocompleteData.options.delay);
                    }
                }

            });

            autocompleteData.element.bind('keydown', function(e) {
                if (widgetAutocomplete.panelVisible(autocompleteData)) {
                    var items = autocompleteData.listContainer.children(),
                        keyCode = widgetBase.keyCode,
                        highlightedItem = AngularWidgets.filter(items, function(item) {
                            return angular.element(item).hasClass('ui-state-highlight');
                        })[0];

                    switch(e.which) {
                        case keyCode.UP:
                        case keyCode.LEFT:
                            var prev = angular.element(highlightedItem.previousElementSibling);

                            if(prev.length !== 0) {
                                angular.element(highlightedItem).removeClass('ui-state-highlight');
                                prev.addClass('ui-state-highlight');

                                if(autocompleteData.options.scrollHeight) {
                                    AngularWidgets.scrollInView(autocompleteData.panel[0], prev[0]);
                                }
                            }

                            e.preventDefault();
                            break;

                        case keyCode.DOWN:
                        case keyCode.RIGHT:
                            var next = angular.element(highlightedItem.nextElementSibling);

                            if(next.length !== 0) {
                                angular.element(highlightedItem).removeClass('ui-state-highlight');
                                next.addClass('ui-state-highlight');

                                if(autocompleteData.options.scrollHeight) {
                                    AngularWidgets.core.scrollInView(autocompleteData.panel[0], next[0]);
                                }

                            }

                            e.preventDefault();
                            break;

                        case keyCode.ENTER:
                        case keyCode.NUMPAD_ENTER:
                            angular.element(highlightedItem).triggerHandler('click');

                            e.preventDefault();
                            break;

                        case keyCode.ALT:
                        case 224:
                            break;

                        case keyCode.TAB:
                            angular.element(highlightedItem).triggerHandler('click');
                            //$this.hide();
                            break;
                    }

                }

            });
        };

        widgetAutocomplete.bindEvents = function(autocompleteData) {
            if (autocompleteData.options.dropdown) {
                widgetBase.hoverAndFocus(autocompleteData.dropdownBtn);

                autocompleteData.dropdownBtn.bind('mouseup', function(e) {
                    widgetAutocomplete.search(autocompleteData, '');
                    autocompleteData.element.triggerHandler("focus");
                });
            }

            $document.bind(
                "click",
                function (event) {
                    if (widgetAutocomplete.panelVisible(autocompleteData)) {
                        if (!angular.element(event.target).hasClass('pui-autocomplete-dropdown')) {

                            autocompleteData.panel.hide();
                        }
                    }
                });
        };

        widgetAutocomplete.unbindEvents = function(autocompleteData) {

            if (autocompleteData.options.dropdown) {
                widgetBase.resetHoverAndFocus(autocompleteData.dropdownBtn);

                autocompleteData.dropdownBtn.unbind('mouseup');
            }
        };

        widgetAutocomplete.panelVisible = function(autocompleteData) {
            return autocompleteData.panel.css('display') !== 'none' && !autocompleteData.panel.hasClass('ui-helper-hidden');
        };

        widgetAutocomplete.search = function (autocompleteData, value) {
            var query = autocompleteData.options.caseSensitive ? value : value.toLowerCase(),
                emptyQuery = value.length === 0,
                request = {
                    query: query
                };

            autocompleteData.timeout = undefined;

            if (angular.isArray(autocompleteData.options.completeMethod)) {
                var sourceArr = autocompleteData.options.completeMethod,
                    data = [];

                for (var i = 0; i < sourceArr.length; i++) {
                    var item = sourceArr[i],
                        itemLabel = item.label || item;

                    if (!autocompleteData.options.caseSensitive) {
                        itemLabel = itemLabel.toLowerCase();
                    }

                    if (emptyQuery || itemLabel.indexOf(query) === 0) {
                        data.push({label: sourceArr[i], value: item});
                    }
                }

                widgetAutocomplete.handleData(autocompleteData, data);
            }
            else {
                autocompleteData.options.completeMethod.call(this, request, function (data) {
                    widgetAutocomplete.handleData(autocompleteData, data);
                });
            }
        };

        widgetAutocomplete.handleData = function(autocompleteData, data) {
            var items = [],
                hidden = autocompleteData.panel.css('display') === 'none' || autocompleteData.panel.hasClass('ui-helper-hidden');

            autocompleteData.panel.html('');
            autocompleteData.listContainer = angular.element('<ul class="pui-autocomplete-items pui-autocomplete-list ui-widget-content ui-widget ui-corner-all ui-helper-reset"></ul>');
            autocompleteData.panel.append(autocompleteData.listContainer);

            for(var i = 0; i < data.length; i++) {
                var itemInUL = angular.element('<ul><li class="pui-autocomplete-item pui-autocomplete-list-item ui-corner-all"></li></ul>'),
                    item = itemInUL.childrenSelector('li');

                item.data(data[i]);

                if(autocompleteData.options.content) {
                    item.html(autocompleteData.options.content.call(this, data[i]));
                }
                else {
                    item.text(data[i].label);
                }

                autocompleteData.listContainer.append(item);
                items.push(item);
            }


            this.bindDynamicEvents(autocompleteData, items);

            if(items.length > 0) {
                items[0].addClass('ui-state-highlight');

                //adjust height
                if(autocompleteData.options.scrollHeight) {
                    var heightConstraint = hidden ? autocompleteData.panel.height() : autocompleteData.panel.children().height();

                    if(heightConstraint > autocompleteData.options.scrollHeight) {

                        autocompleteData.panel.height(autocompleteData.options.scrollHeight);
                    }
                    else {

                        autocompleteData.panel.css('height', 'auto');
                    }

                }

                if(hidden) {
                    this.show(autocompleteData);
                }
                else {
                    this.alignPanel(autocompleteData);
                }
            }
            else {
                autocompleteData.panel.hide();
            }

        };

        widgetAutocomplete.show = function(autocompleteData) {
            this.alignPanel(autocompleteData);

            autocompleteData.panel.show();
            autocompleteData.panel.removeClass('ui-helper-hidden');
        };

        widgetAutocomplete.hide = function(autocompleteData) {
            autocompleteData.panel.hide();
            autocompleteData.panel.css('height', 'auto');
        };

        widgetAutocomplete.alignPanel = function(autocompleteData) {
            var panelWidth = null,
                heightConstraint = null,
                panelVisible = this.panelVisible(autocompleteData);

            if (autocompleteData.options.multiple) {
                panelWidth = autocompleteData.element[0].offsetWidth;
                heightConstraint = autocompleteData.panel.children()[0].offsetHeight;
            } else {
                if(panelVisible) {
                    panelWidth = autocompleteData.panel.childrenSelector('.pui-autocomplete-items').offsetWidth;
                }
                else {
                    autocompleteData.panel.css({'visibility':'hidden','display':'block'});
                    panelWidth = autocompleteData.panel.childrenSelector('.pui-autocomplete-items')[0].offsetWidth;
                    heightConstraint = autocompleteData.panel[0].offsetHeight;
                    autocompleteData.panel.css({'visibility':'visible','display':'none'});
                }

                var inputWidth = autocompleteData.element[0].offsetWidth;
                if(panelWidth < inputWidth) {
                    panelWidth = inputWidth;
                }
            }

            //adjust height
            if(autocompleteData.options.scrollHeight) {
                if(heightConstraint > autocompleteData.options.scrollHeight) {
                    autocompleteData.panel[0].style.height = autocompleteData.options.scrollHeight + 'px';
                }
                else {
                    autocompleteData.panel[0].style.height = 'auto';
                }
            }

            autocompleteData.panel[0].style.width = panelWidth + 'px';
            autocompleteData.panel.position({
                my: 'left top',
                at: 'left bottom',
                of: autocompleteData.element
            });
        };

        widgetAutocomplete.highlightInList = function(items) {
            var $items = items;
            angular.forEach(items, function (item) {

                angular.element(item).bind('mouseenter', function() {

                    angular.forEach($items, function (itemPanel) {
                        angular.element(itemPanel).removeClass('ui-state-highlight');
                    });
                    item.addClass('ui-state-highlight');
                });

            });
        };

        widgetAutocomplete.bindDynamicEvents = function(autocompleteData, items) {
            var cachedResults = [];
            widgetAutocomplete.highlightInList(items);
            angular.forEach(items, function(item) {
                var value = item.data('label');
                item.bind('mousedown', function(e) {
                    if(autocompleteData.options.multiple) {

                        var tokenMarkup = '<ul><li class="pui-autocomplete-token ui-state-active ui-corner-all ">';
                        tokenMarkup += '<span class="pui-autocomplete-token-icon ui-icon ui-icon-close" ></span>';
                        tokenMarkup += '<span class="pui-autocomplete-token-label">' + value + '</span></li></ul>';

                        var itemElement = angular.element(tokenMarkup).children()[0];
                        angular.element(autocompleteData.inputContainer.children()[0]).after(itemElement);

                        angular.element(itemElement).childrenSelector('.pui-autocomplete-token-icon').bind('click', function() {
                            itemElement.remove();
                            if (autocompleteData.options.removeSelection) {
                                autocompleteData.options.removeSelection(value);
                            }
                        });

                        autocompleteData.element.val('').triggerHandler("focus");

                    }
                    else {

                        autocompleteData.element.val(value).triggerHandler("focus");


                    }
                    widgetAutocomplete.updateModel(autocompleteData, value);

                    widgetAutocomplete.hide(autocompleteData);

                });
                if (autocompleteData.options.forceSelection) {
                    cachedResults.push(value);

                }
            });

            if (autocompleteData.options.forceSelection) {
                autocompleteData.element.bind("blur", function (e) {
                    var idx = cachedResults.indexOf(autocompleteData.element.val());
                    if (idx === -1) {
                        autocompleteData.element.val("");
                        widgetAutocomplete.updateModel(autocompleteData, "");
                    }
                    widgetAutocomplete.hide(autocompleteData);

                });
            }
        };

        widgetAutocomplete.updateModel = function(autocompleteData, value) {
            var $scope = autocompleteData.element.scope(),
                ngModelController = autocompleteData.element.controller('ngModel');

            $scope.safeApply(function () {
                ngModelController.$setViewValue(value);
            });

            if (autocompleteData.options.addSelection) {
                autocompleteData.options.addSelection(value);
            }
            if (autocompleteData.options.makeSelection) {
                autocompleteData.options.makeSelection(value);
            }
        };

        widgetAutocomplete.enableDisable = function (autocompleteData, value) {
            if (value === true) {

                widgetAutocomplete.unbindEvents(autocompleteData);
                if(autocompleteData.options.dropdown) {
                    autocompleteData.dropdownBtn.addClass('ui-state-disabled');
                }
            } else {
                widgetAutocomplete.bindEvents(autocompleteData);
                if(autocompleteData.options.dropdown) {
                    autocompleteData.dropdownBtn.removeClass('ui-state-disabled');
                }
            }
        };

        widgetAutocomplete.addBehaviour = function(scope, autocompleteData) {
            widgetBase.hoverAndFocus(autocompleteData.element);

            if (scope.puiDisabled !== undefined) {
                widgetBase.watchPuiDisabled(scope, autocompleteData, widgetAutocomplete.enableDisable);
                widgetBase.watchPuiDisabled(scope, autocompleteData.inputData, widgetInputText.enableDisable);
            }
        };

        return widgetAutocomplete;

    }]);

        angular.module('angular.widgets').directive('puiAutocomplete', ['widgetAutocomplete', function (widgetAutocomplete) {
        var linkFn = function (scope, element, attrs) {
            var options = widgetAutocomplete.determineOptions(scope, element, attrs),
                autocompleteData = widgetAutocomplete.buildWidget(element, attrs, options);

            widgetAutocomplete.addBehaviour(scope, autocompleteData);
        };
        return {
            restrict: 'E',
            replace: true,
            scope: {
                value: '=value',
                puiDisabled: '=puiDisabled',
                rendered: '=rendered'
            },
            template: '<div class="pui-autocomplete-container"><input ng-model="value" class="pui-inputtext ui-widget ui-state-default"><div class="pui-autocomplete-panel ui-widget-content ui-corner-all ui-helper-hidden pui-shadow" style="z-index: 1000"></div></div>',
            link: linkFn
        };

    }]);

}(window, document));
;/*globals angular */

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
}(window, document));;/*globals angular event AngularWidgets */

(function(window, document, undefined) {
    "use strict";

    angular.module('angular.widgets').factory('widgetDatatable', ['widgetBase', 'datatablePaginator', function (widgetBase, datatablePaginator) {


        var widgetDatatable = {};

        widgetDatatable.determineOptions = function (scope, element, attrs) {
            var _options =  scope.$eval(attrs.binding) || {},
                tableData = scope.$eval(attrs.value);


            if (angular.isArray(tableData)) {
                _options = {
                    tableData : tableData,
                    functionBasedData : false
                };
            }
            if (angular.isFunction(tableData)) {
                _options = {
                    tableData : tableData,
                    functionBasedData : true
                };
            }

            return _options;
        };

        widgetDatatable.buildWidget = function(scope, attrs, element, options) {
            var _columns = element.findAllSelector('pui-column'),
                columns = [],
                datatableData = {};

            if (options.paginator || attrs.paginator) {
                datatableData.paginatorData = datatablePaginator.buildWidget(scope, element, attrs, options);
            }

            angular.forEach(_columns, function(column) {
                this.push(angular.element(column).data('options'));
            }, columns);

            datatableData.options = options;
            datatableData.data = options.tableData;
            datatableData.selection = [];
            datatableData.columns = columns;
            _columns.remove();

            this.determineColumnInfo(options, columns);

            datatableData.thead = element.findAllSelector('thead');
            datatableData.tbody = element.findAllSelector('tbody');
            datatableData.element = element;

            return datatableData;

        };

        widgetDatatable.determineColumnInfo = function (options, columns) {
            if (columns.length === 0) {
                if (options.columns) {
                    columns = options.columns;
                }
                if (!options.functionBasedData && columns.length === 0) {
                    for (var property in options.tableData[0]) {
                        columns.push({field: property, headerText: property});
                    }
                }
            }
            options.columns = columns;
        };

        widgetDatatable.handleDataLoad = function (datatableData) {
            return function (data) {
                datatableData.data = data;
                if (!datatableData.data) {
                    datatableData.data = [];
                }

                if (datatableData.options.columns.length === 0) {
                    for (var property in data[0]) {
                        datatableData.options.columns.push({field: property, headerText: property});
                    }
                }


                widgetDatatable.initialize(datatableData);
            };
        };

        widgetDatatable.showWidget = function(datatableData) {
            if (datatableData.data) {
                if (datatableData.options.functionBasedData) {
                    var handleDataLoadObj = new widgetDatatable.handleDataLoad(datatableData);
                    datatableData.options.tableData.call(this, handleDataLoadObj);
                } else {

                    widgetDatatable.initialize(datatableData);
                }

            }

        };

        widgetDatatable.initialize = function(datatableData) {
            var options = datatableData.options;

            if(options.caption) {
                var caption = angular.element('<table><caption class="pui-datatable-caption ui-widget-header">' + options.caption + '</caption></table>');
                datatableData.element.findAllSelector('table').append(caption.childrenSelector('caption'));
            }

            this.renderColumnHeaders(datatableData);

            if (options.paginator) {
                datatableData.element.after(datatableData.paginatorData.paginatorContainer);

                datatablePaginator.initialize(datatableData.paginatorData, datatableData.data, function() {
                    widgetDatatable.renderData(datatableData);
                });
            }

            if(this.isSortingEnabled(datatableData)) {
                this.initSorting(datatableData);
            }


            this.renderData(datatableData);
        };

        widgetDatatable.renderColumnHeaders = function (datatableData) {
            if (datatableData.options.columns) {
                angular.forEach(datatableData.options.columns, function (column) {
                    // Elements are created as child of div tag. And if not valid html, it is not created.
                    var headerInTable = angular.element('<table><thead><th class="ui-state-default"/></thead></table>'),
                        header = headerInTable.findAllSelector('th');
                    header.data('field', column.field);
                    datatableData.thead.append(header);

                    if (column.headerText) {
                        header.text(column.headerText);
                    }

                    if (column.sortable) {
                        header.addClass('pui-sortable-column').data('order', 1).append('<span class="pui-sortable-column-icon ui-icon ui-icon-carat-2-n-s"></span>');
                        header.data('order', 1);
                    }
                });

            }
        };

        widgetDatatable.renderData = function (datatableData) {
            if(datatableData.data) {
                var first = this.getFirst(datatableData),
                    rows = this.getRows(datatableData),
                    totalRecords = datatableData.data.length;

                datatableData.tbody.html('');

                for(var i = first; i < (first + rows) && i < totalRecords; i++) {
                    var rowData = datatableData.data[i],
                        rowKey = rowData[datatableData.options.rowKey];

                    if(rowData) {
                        // Elements are created as child of div tag. And if not valid html, it is not created.
                        var rowInTable = angular.element('<table><tbody><tr class="ui-widget-content" /></tbody></table>'),
                            row = rowInTable.findAllSelector('tr'),
                            zebraStyle = (i%2 === 0) ? 'pui-datatable-even' : 'pui-datatable-odd';

                        datatableData.tbody.append(row);
                        row.addClass(zebraStyle);

                        if(datatableData.options.selectionMode) {
                            row.data('rowKey', rowKey );
                            row.data('rowData', rowData);
                            this.initSelection(datatableData, row);
                        }


                        if (datatableData.options.selectionMode && this.isSelected(datatableData, rowKey)) {
                            row.addClass("ui-state-highlight");
                        }


                        for(var j = 0; j < datatableData.options.columns.length; j++) {
                            var fieldValue = rowData[datatableData.options.columns[j].field],
                                columnInTable = angular.element('<table><tbody><tr><td/></tr></tbody></table>'),
                                column = columnInTable.findAllSelector('td');

                            row.append(column);
                            column.text(fieldValue);
                        }

                    }
                }
            }
        };

        widgetDatatable.initSelection = function(datatableData, row) {
            row.hover(function () {
                if (!row.hasClass('ui-state-highlight')) {
                    row.addClass('ui-state-hover');
                }
            }, function () {
                if (!row.hasClass('ui-state-highlight')) {
                    row.removeClass('ui-state-hover');
                }
            });


            row.bind('click', function(e) {
                if (e.target.nodeName === 'TD') {
                    var selected = row.hasClass('ui-state-highlight'),
                        metaKey = event.metaKey||event.ctrlKey,
                        shiftKey = event.shiftKey,
                        $this = widgetDatatable;

                    //unselect a selected row if metakey is on
                    if(selected && metaKey) {
                        $this.unselectRow(datatableData, row, false);
                    }
                    else {
                        //unselect previous selection if this is single selection or multiple one with no keys
                        if($this.isSingleSelection(datatableData) || ($this.isMultipleSelection(datatableData) && !metaKey && !shiftKey)) {
                            $this.unselectAllRows(datatableData);
                        }

                        $this.selectRow(datatableData, row, false);
                    }

                }

            });
        };

        widgetDatatable.getFirst = function(datatableData) {
            if(datatableData.options.paginator) {
                var page = datatableData.paginatorData.page,
                    rows = datatableData.paginatorData.rows;

                return (page * rows);
            }
            else {
                return 0;
            }
        };

        widgetDatatable.isSortingEnabled = function(datatableData) {
            var cols = datatableData.options.columns;
            if(cols) {
                for(var i = 0; i < cols.length; i++) {
                    if(cols[i].sortable) {
                        return true;
                    }
                }
            }

            return false;
        };

        widgetDatatable.getRows = function(datatableData) {
            return datatableData.options.paginator ? datatableData.paginatorData.rows : datatableData.data.length;
        };

        widgetDatatable.initSorting = function(datatableData) {
            var sortableColumns = datatableData.thead.childrenSelector('.pui-sortable-column');

            widgetBase.hoverAndFocus(sortableColumns);

            sortableColumns.hover(function () {
                var column = angular.element(this);
                if (!column.hasClass('ui-state-active')) {
                    column.addClass('ui-state-hover');
                }
            }, function () {
                var column = angular.element(this);
                if (!column.hasClass('ui-state-active')) {
                    column.removeClass('ui-state-hover');
                }
            });


            sortableColumns.click(function(e) {
                var column =  angular.element(e.target.nodeName === 'TH' ? e.target : e.target.parentNode ),
                    field = column.data('field'),
                    order = column.data('order'),
                    siblings = column.siblings(),
                    activeColumn = AngularWidgets.filter(siblings,function (item) {
                        return angular.element(item).hasClass('ui-state-active');
                    }),
                    sortIcon = column.childrenSelector('.pui-sortable-column-icon');

                if (activeColumn.length > 0) {
                    activeColumn.data('order', 1).removeClass('ui-state-active').children('span.pui-sortable-column-icon')
                        .removeClass('ui-icon-triangle-1-n ui-icon-triangle-1-s');
                }

                widgetDatatable.sort(datatableData, field, order);

                //update state
                column.data('order', -1 * order);

                column.removeClass('ui-state-hover').addClass('ui-state-active');
                sortIcon.removeClass('ui-icon-carat-2-n-s');
                if (order === -1) {
                    sortIcon.removeClass('ui-icon-triangle-1-n').addClass('ui-icon-triangle-1-s');
                }
                else if (order === 1) {
                    sortIcon.removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-n');
                }

            });
        };

        widgetDatatable.sort =  function(datatableData, field,order) {
            datatableData.data.sort(function(data1, data2) {
                var value1 = data1[field],
                    value2 = data2[field],
                    result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

                return (order * result);
            });

            this.renderData(datatableData);
        };

        widgetDatatable.isSingleSelection = function(datatableData) {
            return datatableData.options.selectionMode === 'single';
        };

        widgetDatatable.isMultipleSelection = function(datatableData) {
            return datatableData.options.selectionMode === 'multiple';
        };

        widgetDatatable.getRowKeyValue = function( row) {
            return row.data('rowKey');
        };

        widgetDatatable.getRowData = function( row) {
            return row.data('rowData');
        };

        widgetDatatable.unselectAllRows = function(datatableData, silent) {
            datatableData.tbody.children('tr.ui-state-highlight').removeClass('ui-state-highlight').attr('aria-selected', false);

            if (!silent && datatableData.options.onRowUnselect) {

                datatableData.options.onRowUnselect('rowUnselectAll', null);
            }
            datatableData.selection = [];

        };

        widgetDatatable.unselectRow = function (datatableData, row, silent) {
            var rowKey = this.getRowKeyValue(row),
                rowValue = widgetDatatable.getRowData(row);
            row.removeClass('ui-state-highlight').attr('aria-selected', false);

            this.removeSelection(datatableData, rowKey);

            if (!silent && datatableData.options.onRowUnselect) {
                datatableData.options.onRowUnselect('rowUnselect', rowValue);
            }

        };

        widgetDatatable.removeSelection = function(datatableData, rowKey) {
            if (this.isSelected(datatableData, rowKey)) {
                datatableData.selection.splice(datatableData.selection.indexOf(rowKey), 1);
            }
        };

        widgetDatatable.selectRow = function(datatableData, row, silent) {

            var rowKey = widgetDatatable.getRowKeyValue(row),
                rowValue = widgetDatatable.getRowData(row);
            row.removeClass('ui-state-hover').addClass('ui-state-highlight').attr('aria-selected', true);

            widgetDatatable.addSelection(datatableData, rowKey);

            if(!silent && datatableData.options.onRowSelect) {
                datatableData.options.onRowSelect('rowSelect', rowValue);
            }
        };

        widgetDatatable.addSelection = function (datatableData, rowKey) {

            if (!this.isSelected(datatableData, rowKey)) {
                datatableData.selection.push(rowKey);
            }

        };

        widgetDatatable.isSelected = function(datatableData, rowKey) {
            return AngularWidgets.inArray(datatableData.selection, rowKey);
        };

        widgetDatatable.addInteractionFunctions = function (datatableData, options) {
            if (options.selectionMode) {
                options.addSelection = function (key) {
                    widgetDatatable.addSelection(datatableData, key);
                    widgetDatatable.renderData(datatableData);
                };
                options.removeSelection = function (key) {
                    widgetDatatable.removeSelection(datatableData, key);
                    widgetDatatable.renderData(datatableData);
                };
                options.removeAllSelection = function () {
                    widgetDatatable.unselectAllRows(datatableData, true);
                };
            }
            if (options.paginator) {
                options.setPaginationPage = function(page) {
                    datatablePaginator.setPage(datatableData.paginatorData, page);
                };
            }
        };

        return widgetDatatable;

    }]);

    angular.module('angular.widgets').directive('puiDatatable', ['widgetDatatable', function (widgetDatatable) {
        var linkFn = function (scope, element, attrs) {
            var options = widgetDatatable.determineOptions(scope, element, attrs),
                datatableData = widgetDatatable.buildWidget(scope, attrs, element, options);

            widgetDatatable.showWidget(datatableData);
            widgetDatatable.addInteractionFunctions(datatableData, options);


        };
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<div class="pui-datatable-tablewrapper pui-datatable ui-widget" ><div ng-transclude ></div> <table><thead></thead><tbody class="pui-datatable-data"></tbody> </table></div> ',
            link: linkFn
        };

    }]);

    angular.module('angular.widgets').directive('puiColumn', function () {
        var linkFn = function (scope, element, attrs) {
            var fieldName = attrs.value,
                sortable = attrs.sortable || false,
                headerText = attrs.headertext || fieldName;


            element.data("options", {field: fieldName, headerText: headerText, sortable : sortable});


        };
        return {
            restrict: 'E',
            priority: 5,
            link : linkFn
        };
    });
}(window, document));;/*globals window document angular */

(function (window, document, undefined) {
    "use strict";

    angular.module('angular.widgets').factory('widgetEvent', [ function () {

        var widgetEvent = {};

        widgetEvent.determineOptions = function(scope, element, attrs) {
            var nodeName = element.parent()[0].nodeName,
                event = attrs.event;

            if (! event) {
                if (nodeName === 'INPUT') {
                    event = 'ngEnter';
                }
            }
            element.data("puiEvent", {event: event, callback: function () {
                console.log("event triggered");
                scope.actionListener();
            }});
        };

        return widgetEvent;

    }]);


    angular.module('angular.widgets').directive('puiEvent', ['widgetEvent', function (widgetEvent) {
        var linkFn = function (scope, element, attrs) {
            widgetEvent.determineOptions(scope, element, attrs);

        };
        return {
            restrict: 'E',
            scope: {
                actionListener: '&actionlistener',
            },
            priority: 5,
            link: linkFn
        };

    }]);
}(window, document));;/*globals angular */

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
;/*globals angular AngularWidgets */

(function(window, document, undefined) {
    "use strict";

    angular.module('angular.widgets').factory('puiGrowl', ['$timeout', 'widgetBase', function ($timeout, widgetBase) {
        var growlInternal = {};

        growlInternal.data =  {
            growlElement : undefined,
            options : {
                sticky: false,
                life: 3000
            }
        };


        growlInternal.widget = function(_growlElement) {
            this.data.growlElement = angular.element(_growlElement);
            this.data.growlElement.addClass("pui-growl ui-widget");
            angular.element(document.getElementsByTagName('body')).append(this.data.growlElement);
        };

        growlInternal.show = function(msgs) {

            angular.forEach(msgs, function(msg) {
                growlInternal.renderMessage(msg);
            });

        };

        growlInternal.renderMessage = function(msg) {
            var markup = '<div class="pui-growl-item-container ui-state-highlight ui-corner-all ui-helper-hidden" aria-live="polite">';
            markup += '<div class="pui-growl-item pui-shadow">';
            markup += '<div class="pui-growl-icon-close ui-icon ui-icon-closethick" style="display:none"></div>';
            markup += '<span class="pui-growl-image pui-growl-image-' + msg.severity + '" ></span>';
            markup += '<div class="pui-growl-message">';
            markup += '<span class="pui-growl-title">' + msg.summary + '</span>';
            markup += '<p>' + msg.detail + '</p>';
            markup += '</div><div style="clear: both;"></div></div></div>';

            var message = angular.element(markup);

            this.bindMessageEvents(message);

            this.data.growlElement.append(message);
            message.showAsBlock();
            // fadein()  //TODO;
        };

        growlInternal.bindMessageEvents = function(message) {
            var closer = message.findAllSelector(".pui-growl-icon-close");
            message.hover(function(e) {
                //message.childrenSelector(".pui-growl-icon-close").showAsBlock();
                closer.showAsBlock();
            }, function (e) {
                //message.childrenSelector(".pui-growl-icon-close").hide();
                closer.hide();
            });

            message.click(function(e) {
                e.preventDefault();
                growlInternal.removeMessage(message);
            });

            if (!growlInternal.data.options.sticky) {
                this.setRemovalTimeout(message);
            }
        };

        growlInternal.setRemovalTimeout = function(message) {
            var messageTimer = $timeout(function() {
                    growlInternal.removeMessage(message);
                }, growlInternal.data.options.life);

            message.data('timer', messageTimer);
        };

        growlInternal.removeMessage = function(message) {
            widgetBase.hideWithAnimation(message, function () {
                message.remove();
            });
        };

        growlInternal.clear = function()  {
            angular.forEach(this.data.growlElement.findAllSelector('.pui-growl-item-container'), function(message) {
                growlInternal.removeMessage(angular.element(message));
            });
        };

        var growl = {};

        var initializeGrowl = function () {
            var _growlElement = growlInternal.data.growlElement;
            if (_growlElement === undefined) {

                   angular.element(document.getElementsByTagName('body')).append('<div id="growl"></div>');
                    _growlElement = document.getElementById('growl');
                growlInternal.widget(_growlElement);
            }
        };

        growl.showInfoMessage = function (title, msg) {
            initializeGrowl();
            growlInternal.show([
                {severity: 'info', summary: title, detail: msg}
            ]);
        };

        growl.showWarnMessage = function (title, msg) {
            initializeGrowl();
            growlInternal.show([
                {severity: 'warn', summary: title, detail: msg}
            ]);
        };

        growl.showErrorMessage = function (title, msg) {
            initializeGrowl();
            growlInternal.show([
                {severity: 'error', summary: title, detail: msg}
            ]);
        };

        growl.setSticky = function(sticky) {
            if ( typeof sticky !== 'boolean') {
                throw new Error('Only boolean allowed as parameter of setSticky function');
            }
            growlInternal.data.options.sticky = sticky;
        };

        growl.setStickyRememberOption = function() {
            growlInternal.data.options.previousStickyValue = AngularWidgets.puiGrowl.options.sticky;
            this.setSticky(true);
        };

        growl.resetStickyOption = function() {
            this.setSticky(growlInternal.data.options.previousStickyValue);
        };

        growl.setLife = function(time) {
            if ( typeof time !== 'int') {
                throw new Error('Only int allowed as parameter of setSticky function');
            }
            growlInternal.data.options.life = time;
            initializeGrowl();
        };

        growl.clear = function() {
            initializeGrowl();
            growlInternal.clear();
        };

        return growl;

    }]);

}(window, document));;/*globals window document angular */

(function (window, document, undefined) {
    "use strict";

    angular.module('angular.widgets').factory('widgetInputText', ['$interpolate', 'widgetBase', function ($interpolate, widgetBase) {


        var widgetInputText = {},
            eventsHelper = {};

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

        // TODO this should go in the core when used by more then 1 widget.

        eventsHelper.handleEnterKey = function (element, callback) {
            element.bind("keyup", function (e) {
                var keyCode = widgetBase.keyCode,
                    key = e.which;

                if (key === keyCode.ENTER) {
                    callback();
                    e.preventDefault();
                }
            });
        };

        widgetInputText.registerEvents = function (inputData) {
            var _events = inputData.element.findAllSelector('pui-event');
            angular.forEach(_events, function (event) {
                var puiEventData = angular.element(event).data('puiEvent');
                if (puiEventData.event === 'ngEnter') {

                    eventsHelper.handleEnterKey(inputData.element, puiEventData.callback);
                }

            });
            _events.remove();  // As events aren't graphic, they don't need to stay oin the HTML (but is is OK it not done)


        };

        return widgetInputText;

    }]);


    angular.module('angular.widgets').directive('puiInputtext', ['widgetInputText', function (widgetInputText) {
        var linkFn = function (scope, element, attrs) {
            var options = widgetInputText.determineOptions(scope, element, attrs),
                inputData = widgetInputText.buildWidget(element, attrs, options);

            widgetInputText.addBehaviour(scope, inputData);
            widgetInputText.registerEvents(inputData);

        };
        return {
            restrict: 'E',
            scope: {
                value: '=value',
                puiDisabled: '=puiDisabled',
                rendered: '=rendered'
            },
            replace: true,
            transclude: true,
            template: '<input ng-model="value" class="pui-inputtext ui-widget ui-state-default ui-corner-all" role="textbox" aria-disabled="false" aria-readonly="false" aria-multiline="false" ng-transclude> ',
            link: linkFn
        };

    }]);
}(window, document));;/*globals angular */

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
;/*globals angular */

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
}(window, document));;/*globals angular AngularWidgets*/

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