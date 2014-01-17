/**
 * @name underscorepp.js
 * @author Gidi Morris, 2014
 * @version 0.1
 */
(function (window,document,undefined) {

    /**
     * The top-level namespace
     * @namespace underscore++. An extension of the Underscore JS library
     */
    var _pp;

    _pp = window._pp = {
        /***
         * Extend the parameter object by adding the Underscore++ methods.
         * This allows the user to extend Underscore even if it is running in "no conflict"
         * mode (and hence, not on the _ global variable) add the library's functionality.
         * This also allows the user to extend any JS object they wish, but it is important
         * to note that some of Underscore++'s functionality depends on Underscore itself,
         * and hence, won't work if the extended object is anything other than the Underscore object.
         * An optional parameter also allows the user to remove the library's methods
         * from the existing Underscore object which is automatically extended when the
         * library is included on the page.
         * @param obj (Object) An object to extend with the library's methods.
         * @param revertUnderscore (boolean,opional) Should the Underscore library be reverted to it's original state
         *                                  as it was before including the library on the page
         */
        extend : function(obj,revertUnderscore){
            /** We use extendTopDown so that we don't overwrite the target object with
            * Underscore++'s methods. This is important to avoid a situation where
            * we accidentally use a method name which is in use by Underscore itself.
             * This might happen in the future, as both projects are Open Source.
            */
            this.methods.extendTopDown(obj,this.methods);

            if(revertUnderscore && window._) {
                this.curtail(window._);
            }
        },
        /***
         * Curtail the parameter object by removing the Underscore++ methods.
         * If no parameter is supplied, Underscore.js itself will be curtailed.
         * @param obj (object, optional) The object from which we will remove the Underscore++ methods.
         */
        curtail : function(obj){
            if(obj == undefined) {
                if(window._) {
                    this.curtail(window._);
                } else {
                    throw new Error("Underscore++[curtail method]: No object has been specified for curtailing, but Underscore isn't present on the page.");
                }
            } else if(typeof obj == "object"){
                for (var method in this.methods) {
                    if (this.methods.hasOwnProperty(method) && obj[method] && (typeof obj[method] == "function")) {
                        delete obj[method];
                    }
                }
            } else {
                throw new Error("Underscore++[curtail method]: An invalid parameter has been supplied, it must be of tpe Object.");
            }
        },

        /***
         * These are the library's functional methods - they will be added to any extended object.
         * @type {{}}
         */
        methods:  {
            /***
             * Merge objects in such a way that the preceding properties take precedence over the following properties.
             * This is similar to Underscore's extend method, but Underscore's extend method would give precedence to the following
             * properties, rather than the preceding ones.
             * @param obj (object) The object to extend
             * @param (objects) An unlimited number of parameters can be provided. Each parameter must be an object and it's properties
             *                  will be added to the first parameter (he object to be extended)
             * @returns {*}
             */
             extendTopDown:function (obj) {
                /**
                 * Cycle through the arguments from second to last and add their properties to
                 * the first argument
                 */
                for (var idx = 1; idx < arguments.length; idx++) {
                    var objFrom = arguments[idx];
                    if (typeof objFrom == 'object') {
                        for (var prop in objFrom) {
                            if (objFrom.hasOwnProperty(prop) && !obj.hasOwnProperty(prop)) {
                                if(typeof objFrom[prop] == "function") {
                                    // use a closure to call the function within the context of the object
                                    // being extended
                                    obj[prop] = (function(func,context){
                                        return function(){
                                            return func.apply(context,arguments);
                                        }
                                    })(objFrom[prop],obj);
                                } else if(typeof objFrom[prop] == "object") {
                                    // if this property is an object, then extend it using this method as well
                                    obj[prop] = this.extendTopDown({},objFrom[prop]);
                                } else {
                                    obj[prop] = objFrom[prop];
                                }
                            }
                        }
                    } else {
                        throw new Error("Underscore++[extendTopDown method]: All parameters must be Objects, but parameter #" + (index+1) + " is of type " + typeof objFrom);
                    }
                }
                return obj;
            },
            /***
             * Find the index of the first element in a list of values which passes a truth test.
             * This method can only be used when extending Underscore.js
             * @param list (array) An array of values to be tested
             * @param iterator (function) The method to test whether a specific value passes the truth test.
             * @param context (object, optional) The context in which the truth test is to be called
             * @returns {number}
             */
            findIndex:function (list, truthTest, context) {
                // Make sure the required Underscore method is available
                if(typeof this.any != "function") {
                    throw new Error("Underscore++[findIndex method]: The Underscore Any method is missing, presumably this means an object other than Underscore has been extended by Underscore++.");
                }

                // Inline with the Underscore default, use identity() as the default iterator
                truthTest = truthTest || this.identity;
                // If no context is specified, use window
                context = context || window;

                var truthIndex = -1;
                this.any(list, function (value, index, originalList) {
                    if (truthTest.call(context, value, index, originalList)) {
                        truthIndex = index;
                        return true;
                    }
                });
                return truthIndex;
            },

            /***
             * Returns a (stably) sorted copy of list, ranked in ascending order by the results of running each value through iterator.
             * Multiple iterators can be specified to allow sub sorting of values with the same result in the preceding iterators.
             * Iterator may also be the string name of the property to sort by.
             * This method can only be used when extending Underscore.js
             * @param list (object) The list of items to sort
             * @param sorting functions. (function, multiple params)
             * @param context (object) The context for the iterator functions
             * @return The sorted list
             */
            deepSortBy:function (list,iterator,context) {
                // Make sure the required Underscore methods are available
                if(typeof this.pluck != "function" || typeof this.map != "function" || typeof this.sort != "function") {
                    throw new Error("Underscore++[deepSortBy method]: Some of the Underscore methods are missing, presumably this means an object other than Underscore has been extended by Underscore++.");
                }

                var iterators = [];

                if(!(list instanceof Array)) {
                    throw new Error("Underscore++[deepSortBy method]: The first parameter must be an Array, but is of type " + typeof list);
                }

                for (var index = 1; index < arguments.length && !context; index++) {
                    if (typeof arguments[index] == 'function') {
                        iterators.push(arguments[index]);
                    } else if (typeof arguments[index] == 'object') {
                        context = arguments[index];
                    }
                }
                context = context || window;

                if (iterators.length == 0) {
                    throw new Error("Underscore++[deepSortBy method]: No iterator has been specified to calculate the sort order" + typeof list);
                } else if (iterators.length == 1) {
                    // only one iterator? No need for sub sort, just use the default sort method
                    return this.sort.call(this,list,iterators[0],context);
                }

                /**
                 * This process is a little complex, follow it by steps 1 through 3.
                 *
                 * Step 1: The Map
                 * Go through the values in the list and create an array of values for each one of the
                 * iterators for each one of the list items
                 */
                list = this.map(list,function (value, index, list) {

                    var criteria = [];

                    for (var idx = 0; idx < iterators.length; idx++) {
                        criteria.push(iterators[idx].call(context, value, idx, list));
                    }

                    return {
                        value   :value,
                        criteria:criteria
                    };

                });

                /**
                 * Step 2: The Sort
                 * Now that the iterator values have been calculated for each item in the list
                 * we can compare them using the regular Underscore sort method in which we compare
                 * all the criteria comparison arrays from first iterator through to the last.
                 */
                list = list.sort(function (left, right) {
                    var a = left.criteria,
                        b = right.criteria,
                        criteriaIndex = 0;

                    while (criteriaIndex < a.length) {
                        if (criteriaIndex == a.length) {
                            return 0; // equal
                        } else {
                            if (a[criteriaIndex] < b[criteriaIndex]) {
                                return -1;
                            } else if (a[criteriaIndex] > b[criteriaIndex]) {
                                return 1;
                            } else {
                                criteriaIndex++;
                            }
                        }
                    }
                    return 0; // equal
                });

                /**
                 * Step 3: The Pluck
                 * Now that we have the sorted mapped object - pluck out the values.
                 */
                return this.pluck(list, 'value');
            }
        }
    };

    /***
     * Automatically check for Underscore.js on the page.
     * If it there - extend it.
     */
    if(window._) {
        _pp.extend(window._);
    }

})(window,document);