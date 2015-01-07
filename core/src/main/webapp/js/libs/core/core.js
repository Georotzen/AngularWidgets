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
