/*
 * Polyfill service v3.111.0
 * For detailed credits and licence information see https://polyfill.io.
 * 
 * Features requested: es2021
 * 
 * - _ESAbstract.Call, License: CC0
 * - _ESAbstract.CreateDataProperty, License: CC0
 * - _ESAbstract.CreateDataPropertyOrThrow, License: CC0
 * - _ESAbstract.CreateMethodProperty, License: CC0
 * - _ESAbstract.Get, License: CC0
 * - _ESAbstract.IsCallable, License: CC0
 * - _ESAbstract.RequireObjectCoercible, License: CC0
 * - _ESAbstract.ToBoolean, License: CC0
 * - _ESAbstract.ToObject, License: CC0
 * - _ESAbstract.GetV, License: CC0
 * - _ESAbstract.GetMethod, License: CC0
 * - _ESAbstract.Type, License: CC0
 * - _ESAbstract.GetIterator, License: CC0
 * - _ESAbstract.GetSubstitution, License: CC0
 * - _ESAbstract.IsRegExp, License: CC0
 * - _ESAbstract.IteratorComplete, License: CC0
 * - _ESAbstract.IteratorNext, License: CC0
 * - _ESAbstract.IteratorStep, License: CC0
 * - _ESAbstract.IteratorValue, License: CC0
 * - _ESAbstract.IterableToList, License: CC0
 * - AggregateError, License: MIT
 * - Promise.any, License: MIT
 * - _ESAbstract.OrdinaryToPrimitive, License: CC0
 * - _ESAbstract.StringIndexOf, License: CC0
 * - _ESAbstract.ToPrimitive, License: CC0
 * - _ESAbstract.ToString, License: CC0
 * - String.prototype.replaceAll, License: MIT
*/

(function(self, undefined) {

// _ESAbstract.Call
/* global IsCallable */
// 7.3.12. Call ( F, V [ , argumentsList ] )
function Call(F, V /* [, argumentsList] */) { // eslint-disable-line no-unused-vars
	// 1. If argumentsList is not present, set argumentsList to a new empty List.
	var argumentsList = arguments.length > 2 ? arguments[2] : [];
	// 2. If IsCallable(F) is false, throw a TypeError exception.
	if (IsCallable(F) === false) {
		throw new TypeError(Object.prototype.toString.call(F) + 'is not a function.');
	}
	// 3. Return ? F.[[Call]](V, argumentsList).
	return F.apply(V, argumentsList);
}

// _ESAbstract.CreateDataProperty
// 7.3.4. CreateDataProperty ( O, P, V )
// NOTE
// This abstract operation creates a property whose attributes are set to the same defaults used for properties created by the ECMAScript language assignment operator.
// Normally, the property will not already exist. If it does exist and is not configurable or if O is not extensible, [[DefineOwnProperty]] will return false.
function CreateDataProperty(O, P, V) { // eslint-disable-line no-unused-vars
	// 1. Assert: Type(O) is Object.
	// 2. Assert: IsPropertyKey(P) is true.
	// 3. Let newDesc be the PropertyDescriptor{ [[Value]]: V, [[Writable]]: true, [[Enumerable]]: true, [[Configurable]]: true }.
	var newDesc = {
		value: V,
		writable: true,
		enumerable: true,
		configurable: true
	};
	// 4. Return ? O.[[DefineOwnProperty]](P, newDesc).
	try {
		Object.defineProperty(O, P, newDesc);
		return true;
	} catch (e) {
		return false;
	}
}

// _ESAbstract.CreateDataPropertyOrThrow
/* global CreateDataProperty */
// 7.3.6. CreateDataPropertyOrThrow ( O, P, V )
function CreateDataPropertyOrThrow(O, P, V) { // eslint-disable-line no-unused-vars
	// 1. Assert: Type(O) is Object.
	// 2. Assert: IsPropertyKey(P) is true.
	// 3. Let success be ? CreateDataProperty(O, P, V).
	var success = CreateDataProperty(O, P, V);
	// 4. If success is false, throw a TypeError exception.
	if (!success) {
		throw new TypeError('Cannot assign value `' + Object.prototype.toString.call(V) + '` to property `' + Object.prototype.toString.call(P) + '` on object `' + Object.prototype.toString.call(O) + '`');
	}
	// 5. Return success.
	return success;
}

// _ESAbstract.CreateMethodProperty
// 7.3.5. CreateMethodProperty ( O, P, V )
function CreateMethodProperty(O, P, V) { // eslint-disable-line no-unused-vars
	// 1. Assert: Type(O) is Object.
	// 2. Assert: IsPropertyKey(P) is true.
	// 3. Let newDesc be the PropertyDescriptor{[[Value]]: V, [[Writable]]: true, [[Enumerable]]: false, [[Configurable]]: true}.
	var newDesc = {
		value: V,
		writable: true,
		enumerable: false,
		configurable: true
	};
	// 4. Return ? O.[[DefineOwnProperty]](P, newDesc).
	Object.defineProperty(O, P, newDesc);
}

// _ESAbstract.Get
// 7.3.1. Get ( O, P )
function Get(O, P) { // eslint-disable-line no-unused-vars
	// 1. Assert: Type(O) is Object.
	// 2. Assert: IsPropertyKey(P) is true.
	// 3. Return ? O.[[Get]](P, O).
	return O[P];
}

// _ESAbstract.IsCallable
// 7.2.3. IsCallable ( argument )
function IsCallable(argument) { // eslint-disable-line no-unused-vars
	// 1. If Type(argument) is not Object, return false.
	// 2. If argument has a [[Call]] internal method, return true.
	// 3. Return false.

	// Polyfill.io - Only function objects have a [[Call]] internal method. This means we can simplify this function to check that the argument has a type of function.
	return typeof argument === 'function';
}

// _ESAbstract.RequireObjectCoercible
// 7.2.1. RequireObjectCoercible ( argument )
// The abstract operation ToObject converts argument to a value of type Object according to Table 12:
// Table 12: ToObject Conversions
/*
|----------------------------------------------------------------------------------------------------------------------------------------------------|
| Argument Type | Result                                                                                                                             |
|----------------------------------------------------------------------------------------------------------------------------------------------------|
| Undefined     | Throw a TypeError exception.                                                                                                       |
| Null          | Throw a TypeError exception.                                                                                                       |
| Boolean       | Return argument.                                                                                                                   |
| Number        | Return argument.                                                                                                                   |
| String        | Return argument.                                                                                                                   |
| Symbol        | Return argument.                                                                                                                   |
| Object        | Return argument.                                                                                                                   |
|----------------------------------------------------------------------------------------------------------------------------------------------------|
*/
function RequireObjectCoercible(argument) { // eslint-disable-line no-unused-vars
	if (argument === null || argument === undefined) {
		throw TypeError(Object.prototype.toString.call(argument) + ' is not coercible to Object.');
	}
	return argument;
}

// _ESAbstract.ToBoolean
// 7.1.2. ToBoolean ( argument )
// The abstract operation ToBoolean converts argument to a value of type Boolean according to Table 9:
/*
--------------------------------------------------------------------------------------------------------------
| Argument Type | Result                                                                                     |
--------------------------------------------------------------------------------------------------------------
| Undefined     | Return false.                                                                              |
| Null          | Return false.                                                                              |
| Boolean       | Return argument.                                                                           |
| Number        | If argument is +0, -0, or NaN, return false; otherwise return true.                        |
| String        | If argument is the empty String (its length is zero), return false; otherwise return true. |
| Symbol        | Return true.                                                                               |
| Object        | Return true.                                                                               |
--------------------------------------------------------------------------------------------------------------
*/
function ToBoolean(argument) { // eslint-disable-line no-unused-vars
	return Boolean(argument);
}

// _ESAbstract.ToObject
// 7.1.13 ToObject ( argument )
// The abstract operation ToObject converts argument to a value of type Object according to Table 12:
// Table 12: ToObject Conversions
/*
|----------------------------------------------------------------------------------------------------------------------------------------------------|
| Argument Type | Result                                                                                                                             |
|----------------------------------------------------------------------------------------------------------------------------------------------------|
| Undefined     | Throw a TypeError exception.                                                                                                       |
| Null          | Throw a TypeError exception.                                                                                                       |
| Boolean       | Return a new Boolean object whose [[BooleanData]] internal slot is set to argument. See 19.3 for a description of Boolean objects. |
| Number        | Return a new Number object whose [[NumberData]] internal slot is set to argument. See 20.1 for a description of Number objects.    |
| String        | Return a new String object whose [[StringData]] internal slot is set to argument. See 21.1 for a description of String objects.    |
| Symbol        | Return a new Symbol object whose [[SymbolData]] internal slot is set to argument. See 19.4 for a description of Symbol objects.    |
| Object        | Return argument.                                                                                                                   |
|----------------------------------------------------------------------------------------------------------------------------------------------------|
*/
function ToObject(argument) { // eslint-disable-line no-unused-vars
	if (argument === null || argument === undefined) {
		throw TypeError();
	}
	return Object(argument);
}

// _ESAbstract.GetV
/* global ToObject */
// 7.3.2 GetV (V, P)
function GetV(v, p) { // eslint-disable-line no-unused-vars
	// 1. Assert: IsPropertyKey(P) is true.
	// 2. Let O be ? ToObject(V).
	var o = ToObject(v);
	// 3. Return ? O.[[Get]](P, V).
	return o[p];
}

// _ESAbstract.GetMethod
/* global GetV, IsCallable */
// 7.3.9. GetMethod ( V, P )
function GetMethod(V, P) { // eslint-disable-line no-unused-vars
	// 1. Assert: IsPropertyKey(P) is true.
	// 2. Let func be ? GetV(V, P).
	var func = GetV(V, P);
	// 3. If func is either undefined or null, return undefined.
	if (func === null || func === undefined) {
		return undefined;
	}
	// 4. If IsCallable(func) is false, throw a TypeError exception.
	if (IsCallable(func) === false) {
		throw new TypeError('Method not callable: ' + P);
	}
	// 5. Return func.
	return func;
}

// _ESAbstract.Type
// "Type(x)" is used as shorthand for "the type of x"...
function Type(x) { // eslint-disable-line no-unused-vars
	switch (typeof x) {
		case 'undefined':
			return 'undefined';
		case 'boolean':
			return 'boolean';
		case 'number':
			return 'number';
		case 'string':
			return 'string';
		case 'symbol':
			return 'symbol';
		default:
			// typeof null is 'object'
			if (x === null) return 'null';
			// Polyfill.io - This is here because a Symbol polyfill will have a typeof `object`.
			if ('Symbol' in self && (x instanceof self.Symbol || x.constructor === self.Symbol)) return 'symbol';

			return 'object';
	}
}

// _ESAbstract.GetIterator
/* global GetMethod, Symbol, Call, Type, GetV */
// 7.4.1. GetIterator ( obj [ , method ] )
// The abstract operation GetIterator with argument obj and optional argument method performs the following steps:
function GetIterator(obj /*, method */) { // eslint-disable-line no-unused-vars
	// 1. If method is not present, then
		// a. Set method to ? GetMethod(obj, @@iterator).
	var method = arguments.length > 1 ? arguments[1] : GetMethod(obj, Symbol.iterator);
	// 2. Let iterator be ? Call(method, obj).
	var iterator = Call(method, obj);
	// 3. If Type(iterator) is not Object, throw a TypeError exception.
	if (Type(iterator) !== 'object') {
		throw new TypeError('bad iterator');
	}
	// 4. Let nextMethod be ? GetV(iterator, "next").
	var nextMethod = GetV(iterator, "next");
	// 5. Let iteratorRecord be Record {[[Iterator]]: iterator, [[NextMethod]]: nextMethod, [[Done]]: false}.
	var iteratorRecord = Object.create(null);
	iteratorRecord['[[Iterator]]'] = iterator;
	iteratorRecord['[[NextMethod]]'] = nextMethod;
	iteratorRecord['[[Done]]'] = false;
	// 6. Return iteratorRecord.
	return iteratorRecord;
}

// _ESAbstract.GetSubstitution
/* global Type */
// 21.1.3.17.1 GetSubstitution ( matched, str, position, captures, namedCaptures, replacement )
var GetSubstitution = (function() { // eslint-disable-line no-unused-vars
	function isDigit(string) {
		return /^[0-9]$/.test(string);
	}
	return function GetSubstitution ( matched, str, position, captures, namedCaptures, replacement ) { // eslint-disable-line no-unused-vars
		// 1. Assert: Type(matched) is String.
		// 2. Let matchLength be the number of code units in matched.
		var matchLength = matched.length;
		// 3. Assert: Type(str) is String.
		// 4. Let stringLength be the number of code units in str.
		var stringLength = str.length;
		// 5. Assert: ! IsNonNegativeInteger(position) is true.
		// 6. Assert: position ≤ stringLength.
		// 7. Assert: captures is a possibly empty List of Strings.
		// 8. Assert: Type(replacement) is String.
		// 9. Let tailPos be position + matchLength.
		var tailPos = position + matchLength;
		// 10. Let m be the number of elements in captures.
		var m = captures.length;
		// 11. Let result be the String value derived from replacement by copying
		// code unit elements from replacement to result while performing replacements
		// as specified in Table 53. These $ replacements are done left-to-right, and,
		// once such a replacement is performed, the new replacement text is not subject to further replacements.
		var result = '';
		for (var i = 0; i < replacement.length; i += 1) {
			// if this is a $, and it's not the end of the replacement
			var current = replacement.charAt(i);
			var isLast = (i + 1) >= replacement.length;
			var nextIsLast = (i + 2) >= replacement.length;
			if (current === '$' && !isLast) {
				var next = replacement.charAt(i + 1);
				if (next === '$') {
					result += '$';
					i += 1;
				} else if (next === '&') {
					result += matched;
					i += 1;
				} else if (next === '`') {
					result += position === 0 ? '' : str.slice(0, position - 1);
					i += 1;
				} else if (next === "'") {
					result += tailPos >= stringLength ? '' : str.slice(tailPos);
					i += 1;
				} else {
					var nextNext = nextIsLast ? null : replacement.charAt(i + 2);
					if (isDigit(next) && next !== '0' && (nextIsLast || !isDigit(nextNext))) {
						// $1 through $9, and not followed by a digit
						var n = parseInt(next, 10);
						// if (n > m, impl-defined)
						result += n <= m && Type(captures[n - 1]) === 'Undefined' ? '' : captures[n - 1];
						i += 1;
					} else if (isDigit(next) && (nextIsLast || isDigit(nextNext))) {
						// $00 through $99
						var nn = next + nextNext;
						var nnI = parseInt(nn, 10) - 1;
						// if nn === '00' or nn > m, impl-defined
						result += nn <= m && Type(captures[nnI]) === 'Undefined' ? '' : captures[nnI];
						i += 2;
					} else {
						result += '$';
					}
				}
			} else {
				// the final $, or else not a $
				result += replacement.charAt(i);
			}
		}
		// 12. Return result.
		return result;
	};
}());

// _ESAbstract.IsRegExp
/* global Type, Get, ToBoolean */
// 7.2.8. IsRegExp ( argument )
function IsRegExp(argument) { // eslint-disable-line no-unused-vars
	// 1. If Type(argument) is not Object, return false.
	if (Type(argument) !== 'object') {
		return false;
	}
	// 2. Let matcher be ? Get(argument, @@match).
	var matcher = 'Symbol' in self && 'match' in self.Symbol ? Get(argument, self.Symbol.match) : undefined;
	// 3. If matcher is not undefined, return ToBoolean(matcher).
	if (matcher !== undefined) {
		return ToBoolean(matcher);
	}
	// 4. If argument has a [[RegExpMatcher]] internal slot, return true.
	try {
		var lastIndex = argument.lastIndex;
		argument.lastIndex = 0;
		RegExp.prototype.exec.call(argument);
		return true;
	// eslint-disable-next-line no-empty
	} catch (e) {} finally {
		argument.lastIndex = lastIndex;
	}
	// 5. Return false.
	return false;
}

// _ESAbstract.IteratorComplete
/* global Type, ToBoolean, Get */
// 7.4.3 IteratorComplete ( iterResult )
function IteratorComplete(iterResult) { // eslint-disable-line no-unused-vars
	// 1. Assert: Type(iterResult) is Object.
	if (Type(iterResult) !== 'object') {
		throw new Error(Object.prototype.toString.call(iterResult) + 'is not an Object.');
	}
	// 2. Return ToBoolean(? Get(iterResult, "done")).
	return ToBoolean(Get(iterResult, "done"));
}

// _ESAbstract.IteratorNext
/* global Call, Type */
// 7.4.2. IteratorNext ( iteratorRecord [ , value ] )
function IteratorNext(iteratorRecord /* [, value] */) { // eslint-disable-line no-unused-vars
	// 1. If value is not present, then
	if (arguments.length < 2) {
		// a. Let result be ? Call(iteratorRecord.[[NextMethod]], iteratorRecord.[[Iterator]], « »).
		var result = Call(iteratorRecord['[[NextMethod]]'], iteratorRecord['[[Iterator]]']);
	// 2. Else,
	} else {
		// a. Let result be ? Call(iteratorRecord.[[NextMethod]], iteratorRecord.[[Iterator]], « value »).
		result = Call(iteratorRecord['[[NextMethod]]'], iteratorRecord['[[Iterator]]'], [arguments[1]]);
	}
	// 3. If Type(result) is not Object, throw a TypeError exception.
	if (Type(result) !== 'object') {
		throw new TypeError('bad iterator');
	}
	// 4. Return result.
	return result;
}

// _ESAbstract.IteratorStep
/* global IteratorNext, IteratorComplete */
// 7.4.5. IteratorStep ( iteratorRecord )
function IteratorStep(iteratorRecord) { // eslint-disable-line no-unused-vars
	// 1. Let result be ? IteratorNext(iteratorRecord).
	var result = IteratorNext(iteratorRecord);
	// 2. Let done be ? IteratorComplete(result).
	var done = IteratorComplete(result);
	// 3. If done is true, return false.
	if (done === true) {
		return false;
	}
	// 4. Return result.
	return result;
}

// _ESAbstract.IteratorValue
/* global Type, Get */
// 7.4.4 IteratorValue ( iterResult )
function IteratorValue(iterResult) { // eslint-disable-line no-unused-vars
	// Assert: Type(iterResult) is Object.
	if (Type(iterResult) !== 'object') {
		throw new Error(Object.prototype.toString.call(iterResult) + 'is not an Object.');
	}
	// Return ? Get(iterResult, "value").
	return Get(iterResult, "value");
}

// _ESAbstract.IterableToList
/* global GetIterator, IteratorStep, IteratorValue */
// 7.4.11 IterableToList ( items [ , method ] )
function IterableToList(items /*, method */) { // eslint-disable-line no-unused-vars
	// 1. If method is present, then
	// 1.a. Let iteratorRecord be ? GetIterator(items, sync, method).
	// 2. Else,
	// 2.a. Let iteratorRecord be ? GetIterator(items, sync).
	var iteratorRecord = arguments.length > 1
		? GetIterator(items, arguments[1])
		: GetIterator(items);
	// 3. Let values be a new empty List.
	var values = [];
	// 4. Let next be true.
	var next = true;
	// 5. Repeat, while next is not false,
	while (next !== false) {
		// 5.a. Set next to ? IteratorStep(iteratorRecord).
		next = IteratorStep(iteratorRecord);
		// 5.b. If next is not false, then
		if (next !== false) {
			// 5.b.i. Let nextValue be ? IteratorValue(next).
			var nextValue = IteratorValue(next);
			// 5.b.ii. Append nextValue to the end of the List values.
			values.push(nextValue);
		}
	}
	// 6. Return values.
	return values;
}

// AggregateError
/* global CreateDataPropertyOrThrow, IterableToList */
(function () {
	function AggregateError (errors, message) {
		var temp = typeof message === 'undefined' ? new Error() : new Error(message);

		CreateDataPropertyOrThrow(this, 'name', 'AggregateError');
		CreateDataPropertyOrThrow(this, 'message', temp.message);
		CreateDataPropertyOrThrow(this, 'stack', temp.stack);

		var errorsList;
		if (Array.isArray(errors)) {
			errorsList = errors.slice();
		} else {
			try {
				errorsList = IterableToList(errors);
			} catch (_error) {
				throw new TypeError('Argument is not iterable');
			}
		}

		CreateDataPropertyOrThrow(this, 'errors', errorsList);
	}

	AggregateError.prototype = Object.create(Error.prototype);
	AggregateError.prototype.constructor = AggregateError;

	self.AggregateError = AggregateError;
})();

// Promise.any
/* global AggregateError, CreateMethodProperty, IterableToList, Promise, Type */
(function () {
	// Based on https://github.com/es-shims/Promise.any/blob/master/implementation.js

	var identity = function (x) {
		return x;
	}

	CreateMethodProperty(Promise, 'any', function any (iterable) {
		var C = this;
		if (Type(C) !== 'object') {
			throw new TypeError('`this` value must be an object');
		}

		var arr;
		if (Array.isArray(iterable)) {
			arr = iterable;
		} else {
			try {
				arr = IterableToList(iterable);
			} catch (_error) {
				return Promise.reject(new TypeError('Argument of Promise.any is not iterable'));
			}
		}

		var thrower = function (value) {
			return C.reject(value);
		};

		var promises = arr.map(function (promise) {
			var itemPromise = C.resolve(promise);
			try {
				return itemPromise.then(thrower, identity);
			} catch (e) {
				return e;
			}
		});

		return C.all(promises).then(function (errors) {
			throw new AggregateError(errors, 'Every promise rejected')
		}, identity);
	});
}());

// _ESAbstract.OrdinaryToPrimitive
/* global Get, IsCallable, Call, Type */
// 7.1.1.1. OrdinaryToPrimitive ( O, hint )
function OrdinaryToPrimitive(O, hint) { // eslint-disable-line no-unused-vars
	// 1. Assert: Type(O) is Object.
	// 2. Assert: Type(hint) is String and its value is either "string" or "number".
	// 3. If hint is "string", then
	if (hint === 'string') {
		// a. Let methodNames be « "toString", "valueOf" ».
		var methodNames = ['toString', 'valueOf'];
		// 4. Else,
	} else {
		// a. Let methodNames be « "valueOf", "toString" ».
		methodNames = ['valueOf', 'toString'];
	}
	// 5. For each name in methodNames in List order, do
	for (var i = 0; i < methodNames.length; ++i) {
		var name = methodNames[i];
		// a. Let method be ? Get(O, name).
		var method = Get(O, name);
		// b. If IsCallable(method) is true, then
		if (IsCallable(method)) {
			// i. Let result be ? Call(method, O).
			var result = Call(method, O);
			// ii. If Type(result) is not Object, return result.
			if (Type(result) !== 'object') {
				return result;
			}
		}
	}
	// 6. Throw a TypeError exception.
	throw new TypeError('Cannot convert to primitive.');
}

// _ESAbstract.StringIndexOf
/* global */
function StringIndexOf(string, searchValue, fromIndex) { // eslint-disable-line no-unused-vars
	// 1. Assert: Type(string) is String.
	// 2. Assert: Type(searchValue) is String.
	// 3. Assert: ! IsNonNegativeInteger(fromIndex) is true.
	// 4. Let len be the length of string.
	var len = string.length;
	// 5. If searchValue is the empty String and fromIndex ≤ len, return fromIndex.
	if (searchValue === "" && fromIndex <= len) {
		return fromIndex;
	}
	// 6. Let searchLen be the length of searchValue.
	var searchLen = searchValue.length;
	// 7. If there exists any integer k such that fromIndex ≤ k ≤ len - searchLen
	// and for all nonnegative integers j less than searchLen, the code unit at
	// index k + j within string is the same as the code unit at index j within searchValue,
	// let pos be the smallest (closest to -∞) such integer. Otherwise, let pos be -1.
	var k = fromIndex;
	var pos = -1;
	while (k + searchLen <= len) {
		var match = true;
		for (var j = 0; j < searchLen; j += 1) {
			if (string[k + j] !== searchValue[j]) {
				match = false;
				break;
			}
		}
		if (match) {
			pos = k;
			break;
		}
		k += 1;
	}
	// 8. Return pos.
	return pos;
}

// _ESAbstract.ToPrimitive
/* global Type, GetMethod, Call, OrdinaryToPrimitive */
// 7.1.1. ToPrimitive ( input [ , PreferredType ] )
function ToPrimitive(input /* [, PreferredType] */) { // eslint-disable-line no-unused-vars
	var PreferredType = arguments.length > 1 ? arguments[1] : undefined;
	// 1. Assert: input is an ECMAScript language value.
	// 2. If Type(input) is Object, then
	if (Type(input) === 'object') {
		// a. If PreferredType is not present, let hint be "default".
		if (arguments.length < 2) {
			var hint = 'default';
			// b. Else if PreferredType is hint String, let hint be "string".
		} else if (PreferredType === String) {
			hint = 'string';
			// c. Else PreferredType is hint Number, let hint be "number".
		} else if (PreferredType === Number) {
			hint = 'number';
		}
		// d. Let exoticToPrim be ? GetMethod(input, @@toPrimitive).
		var exoticToPrim = typeof self.Symbol === 'function' && typeof self.Symbol.toPrimitive === 'symbol' ? GetMethod(input, self.Symbol.toPrimitive) : undefined;
		// e. If exoticToPrim is not undefined, then
		if (exoticToPrim !== undefined) {
			// i. Let result be ? Call(exoticToPrim, input, « hint »).
			var result = Call(exoticToPrim, input, [hint]);
			// ii. If Type(result) is not Object, return result.
			if (Type(result) !== 'object') {
				return result;
			}
			// iii. Throw a TypeError exception.
			throw new TypeError('Cannot convert exotic object to primitive.');
		}
		// f. If hint is "default", set hint to "number".
		if (hint === 'default') {
			hint = 'number';
		}
		// g. Return ? OrdinaryToPrimitive(input, hint).
		return OrdinaryToPrimitive(input, hint);
	}
	// 3. Return input
	return input;
}

// _ESAbstract.ToString
/* global Type, ToPrimitive */
// 7.1.12. ToString ( argument )
// The abstract operation ToString converts argument to a value of type String according to Table 11:
// Table 11: ToString Conversions
/*
|---------------|--------------------------------------------------------|
| Argument Type | Result                                                 |
|---------------|--------------------------------------------------------|
| Undefined     | Return "undefined".                                    |
|---------------|--------------------------------------------------------|
| Null	        | Return "null".                                         |
|---------------|--------------------------------------------------------|
| Boolean       | If argument is true, return "true".                    |
|               | If argument is false, return "false".                  |
|---------------|--------------------------------------------------------|
| Number        | Return NumberToString(argument).                       |
|---------------|--------------------------------------------------------|
| String        | Return argument.                                       |
|---------------|--------------------------------------------------------|
| Symbol        | Throw a TypeError exception.                           |
|---------------|--------------------------------------------------------|
| Object        | Apply the following steps:                             |
|               | Let primValue be ? ToPrimitive(argument, hint String). |
|               | Return ? ToString(primValue).                          |
|---------------|--------------------------------------------------------|
*/
function ToString(argument) { // eslint-disable-line no-unused-vars
	switch(Type(argument)) {
		case 'symbol':
			throw new TypeError('Cannot convert a Symbol value to a string');
		case 'object':
			var primValue = ToPrimitive(argument, String);
			return ToString(primValue); // eslint-disable-line no-unused-vars
		default:
			return String(argument);
	}
}

// String.prototype.replaceAll
/* global CreateMethodProperty, RequireObjectCoercible, ToString, IsRegExp, Get, GetMethod, Call, IsCallable, StringIndexOf, GetSubstitution */

// 21.1.3.18 String.prototype.replaceAll ( searchValue, replaceValue )
CreateMethodProperty(String.prototype, 'replaceAll', function replaceAll(searchValue, replaceValue ) {
	'use strict';
	// 1. Let O be ? RequireObjectCoercible(this value).
	var O = RequireObjectCoercible(this);
	// 2. If searchValue is neither undefined nor null, then
	if (searchValue !== undefined && searchValue !== null) {
		// 2.a. Let isRegExp be ? IsRegExp(searchValue).
		var isRegExp = IsRegExp(searchValue);
		// 2.b. If isRegExp is true, then
		if (isRegExp) {
			// 2.b.i. Let flags be ? Get(searchValue, "flags").
			var flags = Get(searchValue, "flags");

			// IE8 doesn't have RegExp.prototype.flags support, it does have RegExp.prototype.global
			// 2.b.iii. If ? ToString(flags) does not contain "g", throw a TypeError exception.
			if (!('flags' in RegExp.prototype) && searchValue.global !== true) {
				throw TypeError('');
			} else if ('flags' in RegExp.prototype) {
				// 2.b.ii. Perform ? RequireObjectCoercible(flags).
				RequireObjectCoercible(flags)
				// 2.b.iii. If ? ToString(flags) does not contain "g", throw a TypeError exception.
				if (ToString(flags).indexOf('g') === -1) {
					throw TypeError('');
				}
			}
		}
		// 2.c. Let replacer be ? GetMethod(searchValue, @@replace).
		var replacer = 'Symbol' in self && 'replace' in self.Symbol ? GetMethod(searchValue, self.Symbol.replace) : undefined;
		// 2.d. If replacer is not undefined, then
		if (replacer !== undefined) {
			// 2.d.i. Return ? Call(replacer, searchValue, « O, replaceValue »).
			return Call(replacer, searchValue, [ O, replaceValue ]);
		}
	}
	// 3. Let string be ? ToString(O).
	var string = ToString(O);
	// 4. Let searchString be ? ToString(searchValue).
	var searchString = ToString(searchValue);

	// 5. Let functionalReplace be IsCallable(replaceValue).
	var functionalReplace = IsCallable(replaceValue);
	// 6. If functionalReplace is false, then
	if (functionalReplace === false) {
		// 6.a. Set replaceValue to ? ToString(replaceValue).
		replaceValue = ToString(replaceValue);
	}

	// 7. Let searchLength be the length of searchString.
	var searchLength = searchString.length;
	// 8. Let advanceBy be max(1, searchLength).
	var advanceBy = Math.max(1, searchLength);
	// 9. Let matchPositions be a new empty List.
	var matchPositions = [];
	// 10. Let position be ! StringIndexOf(string, searchString, 0).
	var position = StringIndexOf(string, searchString, 0);
	// 11. Repeat, while position is not -1,
	while (position !== -1) {
		// 11.a. Append position to the end of matchPositions.
		matchPositions.push(position);
		// 11.b. Set position to ! StringIndexOf(string, searchString, position + advanceBy).
		position = StringIndexOf(string, searchString, position + advanceBy);
	}

	// 12. Let endOfLastMatch be 0.
	var endOfLastMatch = 0;
	// 13. Let result be the empty String.
	var result = '';
	// 14. For each element position of matchPositions, do
	for (var i = 0; i < matchPositions.length; i++) {
		// 14.a. Let preserved be the substring of string from endOfLastMatch to position.
		var preserved = string.substring(endOfLastMatch, matchPositions[i]);
		// 14.b. If functionalReplace is true, then
		if (functionalReplace) {
			// 14.b.i. Let replacement be ? ToString(? Call(replaceValue, undefined, « searchString, position, string »)).
			var replacement = ToString(Call(replaceValue, undefined, [searchString, matchPositions[i], string]));
			// 14.c. Else,
		} else {
			// 14.c.i. Assert: Type(replaceValue) is String.
			// 14.c.ii. Let captures be a new empty List.
			var captures = [];
			// 14.c.iii. Let replacement be ! GetSubstitution(searchString, string, position, captures, undefined, replaceValue).
			replacement = GetSubstitution(searchString, string, matchPositions[i], captures, undefined, replaceValue);
		}
		// 14.d. Set result to the string-concatenation of result, preserved, and replacement.
		result = result + preserved + replacement;
		// 14.e. Set endOfLastMatch to position + searchLength.
		endOfLastMatch = matchPositions[i] + searchLength;
	}
	// 15. If endOfLastMatch < the length of string, then
	if (endOfLastMatch < string.length) {
		// 15.a. Set result to the string-concatenation of result and the substring of string from endOfLastMatch.
		result = result + string.substring(endOfLastMatch);
	}
	// 16. Return result.
	return result;
});
})
('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});