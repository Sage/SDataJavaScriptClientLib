(function(W) {
    // JEST relies on a native forEach method, if
    // you intend to use it with an older browser define one here
    // Array.prototype.forEach = function() {...};
    
    // JEST also uses the console API, if you aren't using a browser that
    // supports it, you should define a substitute object with the methods
    // log(), warn(), group(), and groupEnd().
    // var console = {log: function(s) {...}} 
    
    var JEST = {};

    //test runner, the (r) argument
    JEST.runner = {
        runOnCreation: false,
        passed: 0,
        failed: [],
        cases: [],
        currentCase: null,
        //run the tests and hydrate the passed int, or failed array
        run: function() {
            var $case,tests = [];
            //the cases can be groups of tests
            this.cases.forEach(function(c) {
                $case = c;
                tests = $case.run(JEST.runner);
                tests.forEach(function(t) {
                    if (t.passed) {
                        JEST.runner.passed += 1;
                    } else {
                        JEST.runner.failed.push(t);
                    }
                });
            });
            this.results();
        }, //end run
        results: function() {
            var len = this.failed.length,
            total = this.passed + len,
            arr = [total, ' tests. ', this.passed, ' passed. ', len, ' failed'];
            console.info(arr.join(''));
            if(len) {
                //failed will be an array of objects sent from Assert's fail()
                this.failed.forEach(function(t) {
                    console.group();
                    console.log('TEST: ' + t.description);
                    console.warn(t.error);
                    console.groupEnd();
                });
            }
        },
        autoMagically: function() {
            if(this.runOnCreation) {
                this.run();
            }
        },
        greenLight: function(s) {
            console.log(s || '.');
        },
        redLight: function(s) {
            console.log(s || 'X');
        }
    }; // end runner

    // A case constructor, will be called with the new keyword from describe
    JEST._Case = function(desc) {
        this.description = desc ? desc : '';
        this.tests = [];
        this.beforeCallbacks = [];
        this.afterCallbacks = [];

        this.test = function(s, cb) {
            var t = new JEST.Test(this, s, cb);
            this.tests.push(t);
            if(JEST.runner.runOnCreation) {
                t.run(JEST.runner);
            }
            return t;
        };

        this.before = function(cb) {
            this.beforeCallbacks.push(cb);
        };

        this.after = function(cb) {
            this.afterCallbacks.push(cb);
        };

        this.run = function(r) {
            if (!this.runOnCreation) {
                this.tests.forEach(function(t) {
                    t.run(r);
                });
            }
            return this.tests;
        };

        this.runTest = function(cb) {
            var context = {}; //each test has an empty context
            this.beforeCallbacks.forEach(function(f) {
                f.apply(context);
            });
            cb.apply(context);
            this.afterCallbacks.forEach(function(f) {
                f.apply(context);
            });
        };
    }; // end $Case

    // A singular test constructor, called from Case
    JEST.Test = function($case, s, cb) {
        this.$case = $case;
        this.summary = s;
        this.description = ($case.description + ' ' + s).replace(/^\s+/i, '');
        this.callback = cb;
        this.passed = false;
        //error will be an object recieved from ASSERT.fail()
        this.error = null;

        this.run = function(r) {
            if(this.passed || this.error) {return;}
            try {
                this.$case.runTest(this.callback);
                this.passed = true;
                this.error = null;
                //r.greenLight();
            } catch(e) {
                //use the overridden toString method defined in ASSERT
                this.error = e.toString();
                this.passed = false;
                //r.redLight();
            }
        };    
    }; // end Test

    // setup a testcase in the runner
    JEST.testCase = function(desc) {
        var $case = new JEST._Case(desc);
        JEST.runner.cases.push($case);
        JEST.runner.currentCase = $case;
        return $case;
    };

    JEST.test = function(desc, cb) {
        if(!JEST.runner.currentCase) {
            this.testCase();
        }
        return JEST.runner.currentCase.test(desc, cb);
    };

    JEST.before = function(cb) {
        if(!JEST.runner.currentCase) {
            JEST.testCase();
        }
        return JEST.runner.currentCase.before(cb);
    };

    JEST.after = function(cb) {
        if(!JEST.runner.currentCase) {
            JEST.testCase();
        }
        return JEST.runner.currentCase.after(cb);
    };

    // Hoist run up to JEST.* 
    JEST.run = function() {
       JEST.runner.run();
    };

    // setup some syntactic sugar
    JEST.it = JEST.test;
    JEST.setup = JEST.before;
    JEST.teardown = JEST.after;
    
    // append JEST somewhere, here we'll put it in the global if nothing else 
    // is already there named JEST
    if (!W.JEST) {W.JEST = JEST;}
    
}(window));