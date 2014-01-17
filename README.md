Underscore++
===========

Underscore++ is an extension for Underscore.js (https://github.com/jashkenas/underscore) adding the Underscore methods which are missing, which is ironic, because thats exactly what Underscore is supposed to do for the ECMAScript spec. ;)


### Basic usage

To use Underscore++ alog side Underscore.js all you have to do is include the script and you can start using the new methods using your existing Underscore variable.


```html
    <script type="text/javascript" src="underscore.min.js"></script>
    <script type="text/javascript" src="underscorepp.js"></script>
```

```js
var indexOfMyTrueItem = _.findIndex(["Teenage","Mutant","Ninja","Turtles"],function(itm){
        return (itm == "Ninja");
    }); //returns 2
```

### Advanced usage

#### Manually adding the Underscore++ methods to Underscore

If the global Underscore variable isn't available (if you're using it in noConflict mode) then you can extend it manually by using the global '_pp' variable that is added by the script.

```js
    var myNoConflictUnderscore = _.noConflict();

    ...
    // include the Underscore++ script at some point

    _.findIndex([],function(){...}) // doesn't exist

    _pp.extend(myNoConflictUnderscore);
    _.findIndex([],function(){...}) // works
```

#### Removing the Underscore++ methods from Underscore

Using the Curtail method the Underscore++ methods can be removed from Underscore, or any object which has been extended using the _pp.extend method.

```js
    _.findIndex([],function(){...}) // works
    _pp.curtail(_);
    _.findIndex([],function(){...}) // doesn't exist
```

### Methods

#### extendTopDown

Extend the parameter object by adding the Underscore++ methods.
This allows the user to extend Underscore even if it is running in "no conflict" mode (and hence, not on the _ global variable) add the library's functionality.
This also allows the user to extend any JS object they wish, but it is important to note that some of Underscore++'s functionality depends on Underscore itself, and hence, won't work if the extended object is anything other than the Underscore object.
An optional parameter also allows the user to remove the library's methods from the existing Underscore object which is automatically extended when the library is included on the page.

```js
    var Configuration = {
        DoThis: true,
        DoThat:false,
        ConfigVersion: 1
    };
    var ConfigChanges = {
        DoThat:true,
        ConfigVersion: 2
    };
    NewConfiguration = _.extendTopDown(ConfigChanges,Configuration);

    console.log(NewConfiguration);
    /*
    Prints:
    {
        DoThis: true,
        DoThat:true,
        ConfigVersion: 2
    }
    **/
```

#### findIndex

Find the index of the first element in a list of values which passes a truth test.
This method can only be used when extending Underscore.js, rather than some other object, as it relies on Underscore.js methods.

```js
    var objects = [
        {
            name: "spider",
            legCount: 8,
            tail : null
        },
        {
            name: "snake",
            legCount: 0,
            tail : "straight"
        },
        {
            name: "cat",
            legCount: 4,
            tail : "straight"
        },
        {
            name: "Pig",
            legCount: 4,
            tail : "springy"
        },
        {
            name: "Penny the three legged dog",
            legCount: 3,
            tail : "straight"
        }
    ];

    _.findIndex(objects,function(item){
        returns (item.tail == "straight");
    }); // returns 1

    _.findIndex(objects,function(item){
        returns (item.legCount %2 == 1);
    }); // returns 4

```


#### deepSortBy

Sort an array by multiple iterators with sub sorting.
This method works very similarly to the regular sortBy that Underscore provides, but this version includes, as previously specified, support for additional sorting when the initial sort returns the same sort index for different values.
This method can only be used when extending Underscore.js, rather than some other object, as it relies on Underscore.js methods.

```js
    var arr = [1,4,2,44,45,32,22,11];

    var sortedArray = _.deepSortBy(
        arr,
        function(val){
           // first we sort the odd and even number, so that even comes first (%2 == 0 for even, and 1 for odd)
           return val % 2;
        },
        function(val){
           // now we sort the even and odd numbers, in between themselves, so that the larger numbers come first
           return -(val / 10) ;
        });

     console.log(sortedArray); // prints [44, 32, 22, 4, 2, 45, 11, 1]


```
