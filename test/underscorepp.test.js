/**
 * @name TEST underscorepp.js
 * @author Gidi Morris (c) 2014
 * @version 0.0.1
 */


$(document).ready(function () {

    var methods = [
        "extendTopDown",
        "findIndex",
        "deepSortBy"
    ];

    /***
     * Test Underscore++ methods which can work on any extended object
     */
    var testUnderscorePPMethods = function(onObject,desc){


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

    };

    /***
     * Test Underscore++ methods which require Underscore to work
     */
    var testUnderscorePPMethodsWhichRequireUnderscore = function(onObject,desc,shouldFail){

        // test findIndex

        test('findIndex should find index of item with array of one item which returns true for the truthTest at context of window', function () {
            var arr = [1];
            var truthTest = function(itm){
                return itm === 1;
            };

            if(shouldFail) {
                raises(function(){
                    onObject.findIndex(arr,truthTest);
                });
            } else {
                equal(onObject.findIndex(arr,truthTest),0);
            }
        });

        test('findIndex should find index of item with array of two items which first returns true for the truthTest at context of window', function () {
            var arr = [1,2];
            var truthTest = function(itm){
                return itm === 1;
            };

            var doTest = function(){
                equal(onObject.findIndex(arr,truthTest),0);
            };

            if(shouldFail) {
                raises(doTest);
            } else {
                doTest();
            }
        });

        test('findIndex should find index of item with array of two items which second returns true for the truthTest at context of window', function () {
            var arr = [1,2];
            var truthTest = function(itm){
                return itm === 2;
            };

            var doTest = function(){
                equal(onObject.findIndex(arr,truthTest),1);
            };

            if(shouldFail) {
                raises(doTest);
            } else {
                doTest();
            }

        });

        test('findIndex should not find index (return -1) of item with empty array', function () {
            var arr = [];
            var truthTest = function(itm){
                return true;
            };

            var doTest = function(){
                equal(onObject.findIndex(arr,truthTest),-1);
            };

            if(shouldFail) {
                raises(doTest);
            } else {
                doTest();
            }

        });

        test('findIndex should not find index (return -1) of item with array which has no value which passes the truthTest', function () {
            var arr = [1,2,3,4,5];
            var truthTest = function(itm){
                return itm > 5;
            };

            var doTest = function(){
                equal(onObject.findIndex(arr,truthTest),-1);
            };

            if(shouldFail) {
                raises(doTest);
            } else {
                doTest();
            }
        });

        test('findIndex should find index of item with array of two items which second returns true for the truthTest in specified context', function () {
            var arr = [1,2];
            var context = {
                trueValue: 2
            };

            var truthTest = function(itm){
                return this.trueValue === itm;
            };

            var doTest = function(){
                equal(onObject.findIndex(arr,truthTest,context),1);
            };

            if(shouldFail) {
                raises(doTest);
            } else {
                doTest();
            }
        });

        test('findIndex should not find index (return -1) of item with array which has no value which passes the truthTest in specified context', function () {
            var arr = [1,2];
            var context = {
                trueValue: 3
            };

            var truthTest = function(itm){
                equal(this.trueValue,3);
                return false;
            };

            var doTest = function(){
                equal(onObject.findIndex(arr,truthTest,context),-1);
            };

            if(shouldFail) {
                raises(doTest);
            } else {
                doTest();
            }
        });

        // test deepSortBy

        var compareArrays = function(left,right){
            if(left instanceof Array && right instanceof Array) {
                if(left.length == right.length) {
                    for(var index = 0;index< left.length;index++){
                        if(left[index] != right[index]) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            return false;
        };

        test('deepSortBy should fail if no list is specified', function () {
            var doTest = function(){
                onObject.deepSortBy();
            };

            raises(doTest);
        });

        test('deepSortBy should fail if a non array list is specified', function () {
            var doTest = function(){
                onObject.deepSortBy(true);
            };

            raises(doTest);
        });

        test('deepSortBy should fail if an array list is specified but no iterator', function () {
            var doTest = function(){
                var original = [1,2,3,2];
                var result = onObject.deepSortBy(original);
                ok(compareArrays(original,result));
            };

            raises(doTest);
        });

        test('deepSortBy should sort array according to iterator if only one is specified', function () {
            var doTest = function(){
                var original = [1,2,3,4,11,12,13];
                var result = onObject.deepSortBy(original,function(itm){
                    return (itm % 10);
                });
                ok(compareArrays(result,[1,11,2,12,3,13,4]));
            };

            if(shouldFail) {
                raises(doTest);
            } else {
                doTest();
            }
        });

        test('deepSortBy should sort array according to multiple iterators if they are specified', function () {
            var doTest = function(){
                var original = [1,2,3,4,11,12,13];
                var result = onObject.deepSortBy(
                    original,
                    function(itm){
                        return (itm % 10);
                    },
                    function(itm){
                        // the bigger the number, the smaller the index
                        return (-(itm / 10));
                    });
                ok(compareArrays(result,[11,1,12,2,13,3,4]));
            };

            if(shouldFail) {
                raises(doTest);
            } else {
                doTest();
            }
        });
    };

    var testRemovalOfUnderscorePPMethods = function(onObject,desc){

        test('should be able to remove the Underscore++ methods from ' + desc, function () {
            _pp.curtail(onObject);
            $.each(methods, function(index, value) {
                ok(onObject[value] === undefined);
            });
        });
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
    testRemovalOfUnderscorePPMethods(window._,"the Window level object");

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
    testRemovalOfUnderscorePPMethods(window._noConflict,"in noConflict mode");


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
    testUnderscorePPMethodsWhichRequireUnderscore(window.nonUnderscoreObject,"a non Underscore.js object",true);
    testRemovalOfUnderscorePPMethods(window.nonUnderscoreObject,"a non Underscore.js object");

})