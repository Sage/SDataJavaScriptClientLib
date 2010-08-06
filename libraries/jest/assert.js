(function(W) {
    var ASSERT = {},
    SLICE = Array.prototype.slice,
    TOSTRING = Object.prototype.toString,
    // ASSERT needs to define a few methods for its deepEqual evaluations 
    // which you may already have available depending on your environment.
    // if these methods are defined already just reference them, otherwise
    // you will need to define them here
    has = function(obj, key) {
        return obj && obj.hasOwnProperty && obj.hasOwnProperty(key);
    },
    isUndefinedOrNull = function(obj) {
        return typeof obj === 'undefined' || obj === null;
    },
    isArguments = function(obj) {
        return TOSTRING.call(obj) === '[object Arguments]';
    },
    isArrayLike = function(obj) {
        var res = TOSTRING.call(obj);
        return res === '[object Array]' ||
        res === '[object NodeList]' ||
        res === '[object HTMLCollection]';
    },
    nSort = function(a, b) {
        return a-b;
    },
    extract = function(obj, what) {
        var count = (what === 2), out = (count) ? 0 : [], i;
        for (i in obj) {
            if (count) {
                out++;
            } else {
                if (has(obj, i)) {
                    out.push((what) ? obj[i] : i);
                }
            }
        }
        return out;
    },
    keys = function(obj) {
        return extract(obj);
    };
    
    ASSERT.Assertion = function(opt) {
        this.name = 'Assertion Error';
        this.message = opt.message;
        this.actual = opt.actual;
        this.expected = opt.expected;
        this.operator = opt.operator;
        var stackStartFunction = opt.stackStartFunction || this.fail;
        
        // add a method to Error.prototype to use SSF?
        //if (Error.captureStackTrace) {
            //Error.captureStackTrace(this, stackStartFunction);
        //}
    };
    
    ASSERT.Assertion.prototype.toString = function() {
        if (this.message) {
            return [this.name+":", this.message].join(' ');
        } else {
            return [this.name+": ", 
                'Expected ', JSON.stringify(this.expected), 
                ', Actual ', JSON.stringify(this.actual),
                ', Operator ', this.operator].join("");
        }
    };
    
    ASSERT.fail = function(act, exp, mess, op, ssf) {
        throw new ASSERT.Assertion({
            message: mess,
            actual: act,
            expected: exp,
            operator: op,
            stackStartFunction: ssf
        });
    };

    ASSERT.exists = function(val, mess) {
        if (isUndefinedOrNull(val)) {
            return this.fail(val, true, mess, 'exists', ASSERT.exists);
        }
    };
    
    ASSERT.ok = function(val, mess) {
        if(val !== true) {
            return this.fail(val, true, mess, '===', ASSERT.ok);
        }
    };
    
    ASSERT.equal = function(act, exp, mess) {
        if(act !== exp) {
            return this.fail(act, exp, mess, '===', ASSERT.equal);
        }
    };

    ASSERT.shallowEqual = function(act, exp, mess) {
        if(act != exp) {
            return this.fail(act, exp, mess, '==', ASSERT.shallowEqual);
        }
    };
    
    ASSERT.deepEqual = function(actual, expected, message) {
      if (!this._deepEqual(actual, expected)) {
        return this.fail(actual, expected, message, "deepEqual", ASSERT.deepEqual);
      }
    };

    ASSERT.notEqual = function(act, exp, mess) {
        if(act === exp) {
            return this.fail(act, exp, mess, '===', ASSERT.notEqual);
        }
    };

    ASSERT.shallowNotEqual = function(act, exp, mess) {
        if(act == exp) {
            return this.fail(act, exp, mess, '==', ASSERT.shallowNotEqual);
        }
    };

    ASSERT.notDeepEqual = function(actual, expected, message) {
        if (this._deepEqual(actual, expected)) {
            return this.fail(actual, expected, message, "notDeepEqual", ASSERT.notDeepEqual);
        }
    };
    
    ASSERT._deepEqual = function(actual, expected) {
        if (1 === 2) {
            return true;
          // If the expected value is a Date object, the actual value is
          // equivalent if it is also a Date object that refers to the same time.
          } else if (actual instanceof Date && expected instanceof Date) {
            return actual.getTime() === expected.getTime();
          // Other pairs that do not both pass typeof value == "object",
          // equivalence is determined by ===.
          } else if (typeof actual !== 'object' && typeof expected !== 'object') {
            return actual === expected;
          // For all other Object pairs, including Array objects, equivalence is
          // determined by having the same number of owned properties (as verified
          // with Object.prototype.hasOwnProperty.call), the same set of keys
          // (although not necessarily the same order), equivalent values for every
          // corresponding key, and an identical "prototype" property. Note: this
          // accounts for both named and indexed properties on Arrays.
          } else {
            return this.objEquiv(actual, expected);
          }
    };
    
    ASSERT.objEquiv = function(a, b) {
        var ka, kb, key, i, j, k;
        if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) {
            return false;
        }
        // an identical "prototype" property.
        if (a.prototype !== b.prototype) {
            return false;
        }
        //~~~I've managed to break Object.keys through screwy arguments passing.
        //   Converting to array solves the problem.
        if (isArguments(a)) {
            if (isArguments(b)) {
                return false;
            }
            a = SLICE.call(a);
            b = SLICE.call(b);
            return this._deepEqual(a, b);
        }
        // this will only work correctly for objects,
        // don't put arrays/psuedo-arrays through it so
        // short-circuit out any array-like objects
        if (isArrayLike(a)) {
            if(!isArrayLike(b)) {return false;}
            // go ahead and compare the sorted indices of 
            // all array-like objects
            ka = a.sort(nSort);
            kb = b.sort(nSort);
            i = ka.length;
            j = kb.length;
            k = i-1;
        } else {
            try {
                ka = keys(a);
                kb = keys(b);
                i = ka.length;
                j = kb.length;
                k = i-1;
                // these objects should have string keys so sort should be ok
                ka = ka.sort();
                kb = kb.sort();
            } catch (e) {
                console.log('Error extracting keys');
                return false;
            }
        }
        // having the same number of owned properties
        if (i !== j) {return false;}
        //~~~cheap key test
        for (k; i >= 0; i--) {
            if (ka[i] !== kb[i]) {return false;}
        }
        //equivalent values for every corresponding key, and
        //~~~possibly expensive deep test
        if (!isArrayLike(a)) {
            // both will be non-array-like by now...
            for (k; i >= 0; i--) {
                key = ka[i];
                if (!this._deepEqual(a[key], b[key])) {return false;}
            }
        }
        return true;
    };
    
    // append ASSERT somewhere, here we'll put it in the global if nothing else 
    // is already there name
    if (!W.ASSERT) {W.ASSERT = ASSERT;}
    
}(window));
