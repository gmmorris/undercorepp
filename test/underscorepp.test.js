/**
 * @name TEST underscorepp.js
 * @author Gidi Morris (c) 2014
 * @version 0.0.1
 */


$(document).ready(function () {

    /***
     * Test Underscore++ methods which can work on any extended object
     */
    var testUnderscorePPMethods = function(onObject,desc){

        var methods = [
            "extendTopDown",
            "findIndex",
            "deepSortBy"
        ];

        test('should have Underscore++ methods on ' + desc, function () {
            $.each(methods, function(index, value) {
                ok(typeof onObject[value] == "function");
            });
        });

        test('extendTopDown should return a reference to the first parameter', function () {
            var toObject = {};
            var fromObject = {
                num: 1,
                str: "string",
                bool: true
            };

            var returnedObject = onObject.extendTopDown(toObject,fromObject);
            equal(returnedObject,toObject);
        });

        test('extendTopDown should add basic properties to empty object', function () {
            var toObject = {};
            var fromObject = {
                num: 1,
                str: "string",
                bool: true
            };

            onObject.extendTopDown(toObject,fromObject);
            equal(toObject.num,fromObject.num);
            equal(toObject.str,fromObject.str);
            equal(toObject.bool,fromObject.bool);
        });

        test('extendTopDown should add basic properties to object with existing basic properties', function () {
            var toObject = {
                otherNum: 2,
                otherString: "other string",
                falseBool: false
            };
            var fromObject = {
                num: 1,
                str: "string",
                bool: true
            };

            onObject.extendTopDown(toObject,fromObject);
            equal(toObject.num,fromObject.num);
            equal(toObject.str,fromObject.str);
            equal(toObject.bool,fromObject.bool);
        });

        test('extendTopDown should add basic properties to object with existing basic properties with clash in one property', function () {
            var originalValue = 9;
            var toObject = {
                num: originalValue,
                otherNum: 2,
                otherString: "other string",
                falseBool: false
            };
            var fromObject = {
                num: 3,
                str: "string",
                bool: true
            };

            onObject.extendTopDown(toObject,fromObject);
            notEqual(toObject.num,fromObject.num);
            equal(toObject.num,originalValue);
            equal(toObject.str,fromObject.str);
            equal(toObject.bool,fromObject.bool);
        });

        test('extendTopDown should add complex properties to empty object', function () {
            var toObject = {};
            var fromObject = {
                num: 1,
                str: "string",
                bool: true,
                complex : {
                    complexStr: "complex"
                }
            };

            onObject.extendTopDown(toObject,fromObject);
            equal(toObject.num,fromObject.num);
            equal(toObject.str,fromObject.str);
            equal(toObject.bool,fromObject.bool);
            equal(toObject.complex.complexStr,fromObject.complex.complexStr);
        });

        test('extendTopDown should add complex properties to object with existing basic properties', function () {
            var toObject = {
                otherNum: 2,
                otherString: "other string",
                falseBool: false
            };
            var fromObject = {
                num: 1,
                str: "string",
                bool: true  ,
                complex : {
                    complexStr: "complex"
                }
            };

            onObject.extendTopDown(toObject,fromObject);
            equal(toObject.num,fromObject.num);
            equal(toObject.str,fromObject.str);
            equal(toObject.bool,fromObject.bool);
            equal(toObject.complex.complexStr,fromObject.complex.complexStr);
        });

        test('extendTopDown should add complex properties to object with existing complex properties with clash in one property', function () {
            var originalValue = "complex 1";
            var toObject = {
                num: originalValue,
                otherNum: 2,
                otherString: "other string",
                falseBool: false   ,
                complex : {
                    complexStr:originalValue
                }
            };
            var fromObject = {
                num: 3,
                str: "string",
                bool: true        ,
                complex : {
                    complexStr: "complex 2"
                }
            };

            onObject.extendTopDown(toObject,fromObject);
            notEqual(toObject.complex.complexStr,fromObject.complex.complexStr);
            equal(toObject.complex.complexStr,originalValue);
            equal(toObject.str,fromObject.str);
            equal(toObject.bool,fromObject.bool);
        });


        test('extendTopDown should add function from target object into to object', function () {

            var toObject = {
            };
            var fromObject = {
                action : function(){
                    return 2;
                }
            };

            onObject.extendTopDown(toObject,fromObject);
            ok(typeof toObject.action == "function");
            equal(toObject.action(),fromObject.action());
        });

        test('extendTopDown should not add function when a clash occurs', function () {

            var returnedValue = 1;
            var toObject = {
                action : function(){
                    return returnedValue;
                }
            };
            var fromObject = {
                action : function(){
                    return 2;
                }
            };

            onObject.extendTopDown(toObject,fromObject);
            ok(typeof toObject.action == "function");
            notEqual(toObject.action(),fromObject.action());
            equal(toObject.action(),returnedValue);
        });

        test('extendTopDown should change the context of the called function when extended', function () {
            var firstValue = 1;
            var secondValue = 2;

            var toObject = {
                myValue: firstValue
            };
            var fromObject = {
                myValue: secondValue,
                action : function(){
                    return this.myValue;
                }
            };

            onObject.extendTopDown(toObject,fromObject);
            ok(typeof toObject.action == "function");
            notEqual(toObject.action(),secondValue);
            equal(toObject.action(),firstValue);
            equal(fromObject.action(),secondValue);
        });

        test('should be able to remove the Underscore++ methods from ' + desc, function () {
            _pp.curtail(onObject);
            $.each(methods, function(index, value) {
                ok(onObject[value] === undefined);
            });
        });
    };

    /***
     * Test Underscore++ methods which require Underscore to work
     */
    var testUnderscorePPMethodsWhichRequireUnderscore = function(onObject,desc,shouldPass){

    };

    /**
     * Execute the different modules
     */

    module("Automatic extension of Underscore.js at the Window level", {
        setup: function() {

        },
        teardown: function() {

        }
    });

    testUnderscorePPMethods(window._,"the Window level object");
    testUnderscorePPMethodsWhichRequireUnderscore(window._,"the Window level object");

    module("Extension of Underscore.js in noConflict mode", {
        setup: function() {
            // extend the noConflict version
            _pp.extend(window._noConflict);
        },
        teardown: function() {

        }
    });

    testUnderscorePPMethods(window._noConflict,"in noConflict mode");
    testUnderscorePPMethodsWhichRequireUnderscore(window._noConflict,"in noConflict mode");


    window.nonUnderscoreObject = {
        name : "Dark Angel",
        creator: "James Cameron",
        status : "Canceled too soon :(",
        seasons: 2,
        staring: "Jessica Alba",
        iWish : function(){
            return "It would be resurrected.";
        }
    };
    // extend the noConflict version
    _pp.extend(window.nonUnderscoreObject);

    module("Extension of non Underscore.js object", {
        setup: function() {
        },
        teardown: function() {

        }
    });

    testUnderscorePPMethods(window.nonUnderscoreObject,"a non Underscore.js object");
    testUnderscorePPMethodsWhichRequireUnderscore(window.nonUnderscoreObject,"a non Underscore.js object");

})