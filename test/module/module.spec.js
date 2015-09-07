(function() {
  'use strict';

  describe('Majool - Module', function() {
    describe('module()', function() {
      beforeEach(function() {
        mjs.module('myModule');
      });

      afterEach(function() {
        mjs.modules_ = {};
        mjs.current_ = null;
      });

      it('should create a module.', function() {
        expect(mjs.modules_.myModule).toBeDefined();
      });

      it('should be an object.', function() {
        expect(mjs.modules_.myModule).toEqual(jasmine.any(Object));
      });

      it('should set the current module.', function() {
        expect(mjs.current_).toBe(mjs.modules_.myModule);
      });

      describe('when module was created', function() {
        it('should return true.', function() {
          expect(mjs.module('newModule')).toBe(true);
        });
      });

      describe('when module already exist', function() {
        it('should set the current module.', function() {
          var moduleName = 'alreadyExist';
          mjs.module(moduleName);
          mjs.module('myModule');
          mjs.module(moduleName);

          expect(mjs.current_).toBe(mjs.modules_[moduleName]);
        });
      });
    });

    describe('export()', function() {
      describe('when does not exist the current module', function() {
        beforeEach(function() {
          mjs.current_ = null;
        });

        it('should throw an error.', function() {
          expect(function() {
            mjs.export(function MyComponent() {});
          }).toThrowError('Majool says: current module is not defined!');
        });
      });

      describe('when the first parameter is a String', function() {
        beforeEach(function() {
          mjs.module('myModule');
        });

        describe('and does not pass the component parameter', function() {
          it('should throw an Error.', function() {
            expect(function() {
              mjs.export('myComponent');
            }).toThrowError('Majool says: you need to define the component!');
          });
        });

        describe('and pass the component parameter', function() {
          beforeEach(function() {
            mjs.export('myComponent', 'This is the public component');
          });

          it('should add into current module with the string name.', function() {
            expect(mjs.current_.myComponent).toBe('This is the public component');
          });
        });
      });

      describe('when the first parameter is a Function', function() {
        beforeEach(function() {
          mjs.module('functionTest');
        });

        it('should add into current module with the function name', function() {
          function MyComponent() {}
          mjs.export(MyComponent);
          expect(mjs.current_[MyComponent.name]).toBe(MyComponent);
        });
      });

      describe('when the first parameter is an Object', function() {
        beforeEach(function() {
          mjs.module('objectTest');
        });

        it('should add all the keys in the current module.', function() {
          var myModule = {
            myComponent: 'This is my component'
          };

          mjs.export(myModule);
          expect(mjs.current_.myComponent).toBe(myModule.myComponent);
        });
      });

      describe('when first parameter is not a String, Function nor Object', function() {
        it('should throw an error.', function() {
          expect(function() {
            mjs.export(42);
          }).toThrowError();
        });
      });
    });

    describe('exportDeafult()', function() {
      describe('when doesn \'t exist the current module', function() {
        beforeEach(function() {
          mjs.current_ = null;
        });

        it('should throw an error.', function() {
          expect(function() {
            mjs.exportDefault('myComponent', {});
          }).toThrowError('Majool says: current module is not defined!');
        });
      });

      describe('when pass a string', function() {
        beforeEach(function() {
          mjs.module('myModule');
        });

        describe('and not pass a component', function() {
          it('should throw an error.', function() {
            expect(function() {
              mjs.exportDefault('errorComponent');
            }).toThrowError();
          });
        });

        describe('and pass a component', function() {
          it('should add into the default object of the current module.', function() {
            mjs.exportDefault('myComponent', 'Default componennt.');

            expect(mjs.current_.default_.myComponent).toBe('Default componennt.');
          });
        });
      });

      describe('when pass a function', function() {
        beforeEach(function() {
          mjs.module('myFunctionTestModule');
          mjs.exportDefault(function MyComponent() {});
        });

        it('should add into default property of the current module with function name', function() {
          expect(mjs.current_.default_.MyComponent).toBeDefined();
        });
      });

      describe('when first parameter is not a String nor Function', function() {
        it('should throw an error.', function() {
          expect(function() {
            mjs.exportDefault({});
          }).toThrowError('Majool says: you need to pass a correct first parameter!');
        });
      });
    });

    describe('import()', function() {
      it('should return a "from" function.', function() {
        expect(mjs.import('').from).toBeDefined();
      });

      describe('when pass an array', function() {
        beforeEach(function() {
          mjs.module('importTest');
          mjs.export('first', 'first');
          mjs.export('second', 'second');
        });

        describe('and when exist the components', function() {
          it('should return an Object with all the properties requested.', function() {
            var expected = {
              first: 'first'
            };

            var assert = mjs.import(['first']).from('importTest');

            expect(assert).toEqual(expected);
          });
        });

        describe('and when not exist one component', function() {
          it('should throw an error.', function() {
            expect(function() {
              mjs.import(['first', 'second', 'errorComponent']).from('importTest');
            }).toThrowError();
          });
        });
      });

      describe('when pass a string', function() {
        beforeEach(function() {
          mjs.module('importStringTest');
          mjs.exportDefault('defaultKey', 'defaultComponent');
        });

        describe('and when exist the component', function() {
          it('should return the default component from module requested.', function() {
            var expected = 'defaultComponent';

            var assert = mjs.import('defaultKey').from('importStringTest');

            expect(assert).toBe(expected);
          });
        });

        describe('and when not exist the component', function() {
          it('should throw an error.', function() {
            expect(function() {
              mjs.import('doesntExistDefault').from('importStringTest');
            }).toThrowError();
          });
        });
      });

      describe('from():', function() {
        describe('when does not exist the module', function() {
          it('should throw an error.', function() {
            var fakeModule = 'imNotHere';
            expect(function() {
              mjs.import(['MyFakeComponent']).from(fakeModule);
            }).toThrowError('Majool says: the module "' + fakeModule + '" does not exist.');
          });
        });

        describe('searching for a default component:', function() {
          var moduleName;

          beforeEach(function() {
            moduleName = 'iAmHere';

            mjs.module(moduleName);
          });

          describe('when does not exists any default value', function() {
            it('should throw an error.', function() {
              expect(function() {
                mjs.import('MyFakeDefaultComponent').from(moduleName);
              }).toThrowError('Majool says: the module "' + moduleName + '" does not have a default component.');
            });
          });
        });
      });
    });
  });
})();
