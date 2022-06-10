import { Clonable } from '../../utils/clonable';
import cloneObject from '../../utils/cloneObject';

describe('clone', () => {
  it('should clone object and not mutate the original object', () => {
    const fileData = new File([''], 'filename');
    const data = {
      items: [],
      test: {
        date: new Date('2020-10-15'),
        test0: 12,
        test1: '12',
        test2: [1, 2, 3, 4],
        deep: {
          date: new Date('2020-10-15'),
          test0: 12,
          test1: '12',
          test2: [
            1,
            2,
            3,
            4,
            {
              file: fileData,
            },
          ],
          file: fileData,
        },
      },
      file: fileData,
      test2: new Set([1, 2]),
      test1: new Map([
        [1, 'one'],
        [2, 'two'],
        [3, 'three'],
      ]),
    };

    const copy = cloneObject(data);
    expect(cloneObject(data)).toEqual(copy);

    // @ts-expect-error
    copy.test.what = '1243';
    copy.test.date = new Date('2020-10-16');
    // @ts-expect-error
    copy.items[0] = 2;

    expect(data).toEqual({
      items: [],
      test: {
        date: new Date('2020-10-15'),
        test0: 12,
        test1: '12',
        test2: [1, 2, 3, 4],
        deep: {
          date: new Date('2020-10-15'),
          test0: 12,
          test1: '12',
          test2: [
            1,
            2,
            3,
            4,
            {
              file: fileData,
            },
          ],
          file: fileData,
        },
      },
      file: fileData,
      test2: new Set([1, 2]),
      test1: new Map([
        [1, 'one'],
        [2, 'two'],
        [3, 'three'],
      ]),
    });

    // @ts-expect-error
    data.items = [1, 2, 3];

    expect(copy.items).toEqual([2]);
  });

  it('should skip clone if a node is instance of function', () => {
    function testFunction() {}

    const data = {
      test: {
        testFunction,
        test: 'inner-string',
        deep: {
          testFunction,
          test: 'deep-string',
        },
      },
      testFunction,
      other: 'string',
    };

    const copy = cloneObject(data);
    data.test.deep.test = 'changed-deep-string';

    expect(copy).toEqual({
      test: {
        test: 'inner-string',
        deep: {
          test: 'changed-deep-string',
          testFunction,
        },
        testFunction,
      },
      testFunction,
      other: 'string',
    });
  });

  it('should reference same Symbols on cloned object', () => {
    const testSymbol = Symbol();

    const data = {
      symbol: testSymbol,
      text: 'foobar',
    };

    const copy = cloneObject(data);

    expect(copy.text).toEqual(data.text);
    expect(copy === data).toBeFalsy();
    expect(copy.symbol === data.symbol).toBeTruthy();
  });

  it('should retain type info when node is a class instance', () => {
    class TestObject {
      constructor(public name: string) {}
    }

    const data = new TestObject('foobar');
    const copy = cloneObject(data);

    expect(copy.name).toEqual(data.name);
    expect(copy).toBeInstanceOf(TestObject);
    expect(copy === data).toBeFalsy();
  });

  it('should work with classes using getter', () => {
    class TestObject {
      constructor(private _name: string) {}

      get name() {
        return this._name;
      }
    }

    const data = new TestObject('foobar');
    const copy = cloneObject(data);

    expect(copy.name).toEqual(data.name);
    expect(copy).toBeInstanceOf(TestObject);
    expect(copy === data).toBeFalsy();
  });

  it('should work with Proxies', () => {
    class TestObject {
      constructor(public name: string) {}
    }

    const proxiedValue = 'From proxy';
    const data = new TestObject('foobar');

    const proxy = new Proxy(data, {
      get() {
        return proxiedValue;
      },
    });

    const copy = cloneObject(proxy);

    expect(copy.name).toEqual(proxiedValue);
    expect(copy).toBeInstanceOf(TestObject);
    expect(copy === data).toBeFalsy();
  });

  it('should delegate to object clone() method if any', () => {
    class TestObject implements Clonable<TestObject> {
      constructor(public name: string) {}

      clone() {
        return new TestObject(this.name);
      }
    }

    const data = new TestObject('foobar');
    const spy = jest.spyOn(data, 'clone');

    const copy = cloneObject(data);

    expect(spy).toHaveBeenCalled();
    expect(copy.name).toEqual(data.name);
    expect(copy).toBeInstanceOf(TestObject);
    expect(copy === data).toBeFalsy();
  });
});
