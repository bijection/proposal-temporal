import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import { strict as assert } from 'assert';
const { throws, equal, notEqual } = assert;

import * as Temporal from 'proposal-temporal';
const { MonthDay } = Temporal;

describe('MonthDay', () => {
  describe('Structure', () => {
    it('MonthDay is a Function', () => {
      equal(typeof MonthDay, 'function');
    });
    it('MonthDay has a prototype', () => {
      assert(MonthDay.prototype);
      equal(typeof MonthDay.prototype, 'object');
    });
    describe('MonthDay.prototype', () => {
      it('MonthDay.prototype.equals is a Function', () => {
        equal(typeof MonthDay.prototype.equals, 'function');
      });
      it('MonthDay.prototype.getFields is a Function', () => {
        equal(typeof MonthDay.prototype.getFields, 'function');
      });
      it('MonthDay.prototype.getISOCalendarFields is a Function', () => {
        equal(typeof MonthDay.prototype.getISOCalendarFields, 'function');
      });
    });
  });
  describe('Construction', () => {
    it('Leap day', () => equal(`${new MonthDay(2, 29)}`, '02-29'));
    describe('.from()', () => {
      it('MonthDay.from(10-01) == 10-01', () => equal(`${MonthDay.from('10-01')}`, '10-01'));
      it('MonthDay.from(2019-10-01T09:00:00Z) == 10-01', () =>
        equal(`${MonthDay.from('2019-10-01T09:00:00Z')}`, '10-01'));
      it("MonthDay.from('11-18') == (11-18)", () => equal(`${MonthDay.from('11-18')}`, '11-18'));
      it("MonthDay.from('1976-11-18') == (11-18)", () => equal(`${MonthDay.from('1976-11-18')}`, '11-18'));
      it('MonthDay.from({ month: 11, day: 18 }) == 11-18', () =>
        equal(`${MonthDay.from({ month: 11, day: 18 })}`, '11-18'));
      it('MonthDay.from(11-18) is not the same object', () => {
        const orig = new MonthDay(11, 18);
        const actu = MonthDay.from(orig);
        notEqual(actu, orig);
      });
      it('MonthDay.from({ day: 15 }) throws', () => throws(() => MonthDay.from({ day: 15 }), TypeError));
      it('MonthDay.from({ month: 12 }) throws', () => throws(() => MonthDay.from({ month: 12 }), TypeError));
      it('MonthDay.from({}) throws', () => throws(() => MonthDay.from({}), TypeError));
      it('MonthDay.from(required prop undefined) throws', () =>
        throws(() => MonthDay.from({ month: undefined, day: 15 }), TypeError));
      it('MonthDay.from(number) is converted to string', () =>
        assert(MonthDay.from(1201).equals(MonthDay.from('12-01'))));
      it('basic format', () => {
        equal(`${MonthDay.from('1118')}`, '11-18');
      });
      it('mixture of basic and extended format', () => {
        equal(`${MonthDay.from('1976-11-18T152330.1+00:00')}`, '11-18');
        equal(`${MonthDay.from('19761118T15:23:30.1+00:00')}`, '11-18');
        equal(`${MonthDay.from('1976-11-18T15:23:30.1+0000')}`, '11-18');
        equal(`${MonthDay.from('1976-11-18T152330.1+0000')}`, '11-18');
        equal(`${MonthDay.from('19761118T15:23:30.1+0000')}`, '11-18');
        equal(`${MonthDay.from('19761118T152330.1+00:00')}`, '11-18');
        equal(`${MonthDay.from('19761118T152330.1+0000')}`, '11-18');
        equal(`${MonthDay.from('+001976-11-18T152330.1+00:00')}`, '11-18');
        equal(`${MonthDay.from('+0019761118T15:23:30.1+00:00')}`, '11-18');
        equal(`${MonthDay.from('+001976-11-18T15:23:30.1+0000')}`, '11-18');
        equal(`${MonthDay.from('+001976-11-18T152330.1+0000')}`, '11-18');
        equal(`${MonthDay.from('+0019761118T15:23:30.1+0000')}`, '11-18');
        equal(`${MonthDay.from('+0019761118T152330.1+00:00')}`, '11-18');
        equal(`${MonthDay.from('+0019761118T152330.1+0000')}`, '11-18');
      });
      it('optional parts', () => {
        equal(`${MonthDay.from('1976-11-18T15:23')}`, '11-18');
        equal(`${MonthDay.from('1976-11-18T15')}`, '11-18');
        equal(`${MonthDay.from('1976-11-18')}`, '11-18');
      });
      it('RFC 3339 month-day syntax', () => {
        equal(`${MonthDay.from('--11-18')}`, '11-18');
        equal(`${MonthDay.from('--1118')}`, '11-18');
      });
      describe('Disambiguation', () => {
        const bad = { month: 1, day: 32 };
        it('reject', () => throws(() => MonthDay.from(bad, { disambiguation: 'reject' }), RangeError));
        it('constrain', () => {
          equal(`${MonthDay.from(bad)}`, '01-31');
          equal(`${MonthDay.from(bad, { disambiguation: 'constrain' })}`, '01-31');
        });
        it('throw when bad disambiguation', () => {
          [new MonthDay(11, 18), { month: 1, day: 1 }, '01-31'].forEach((input) => {
            ['', 'CONSTRAIN', 'balance', 3, null].forEach((disambiguation) =>
              throws(() => MonthDay.from(input, { disambiguation }), RangeError)
            );
          });
        });
      });
      describe('Leap day', () => {
        ['reject', 'constrain'].forEach((disambiguation) =>
          it(disambiguation, () => equal(`${MonthDay.from({ month: 2, day: 29 }, { disambiguation })}`, '02-29'))
        );
      });
    });
    describe('getters', () => {
      let md = new MonthDay(1, 15);
      it("(1-15).month === '1'", () => {
        equal(`${md.month}`, '1');
      });
      it("(1-15).day === '15'", () => {
        equal(`${md.day}`, '15');
      });
    });
    describe('.with()', () => {
      const md = MonthDay.from('01-22');
      it('with(12-)', () => equal(`${md.with({ month: 12 })}`, '12-22'));
      it('with(-15)', () => equal(`${md.with({ day: 15 })}`, '01-15'));
    });
  });
  describe('MonthDay.with()', () => {
    it('throws on bad disambiguation', () => {
      ['', 'CONSTRAIN', 'balance', 3, null].forEach((disambiguation) =>
        throws(() => MonthDay.from('01-15').with({ day: 1 }, { disambiguation }), RangeError)
      );
    });
    it('throws on trying to change the calendar', () => {
      throws(() => MonthDay.from('01-15').with({ calendar: 'gregory' }), RangeError);
    });
  });
  describe('MonthDay.equals()', () => {
    const md1 = MonthDay.from('01-22');
    const md2 = MonthDay.from('12-15');
    it('equal', () => assert(md1.equals(md1)));
    it('unequal', () => assert(!md1.equals(md2)));
    it("doesn't cast argument", () => {
      throws(() => md1.equals('01-22'), TypeError);
      throws(() => md1.equals({ month: 1, day: 22 }), TypeError);
    });
    it('takes [[RefISOYear]] into account', () => {
      const iso = Temporal.Calendar.from('iso8601');
      const md1 = new MonthDay(1, 1, iso, 1972);
      const md2 = new MonthDay(1, 1, iso, 2000);
      assert(!md1.equals(md2));
    });
  });
  describe("Comparison operators don't work", () => {
    const md1 = MonthDay.from('02-13');
    const md1again = MonthDay.from('02-13');
    const md2 = MonthDay.from('11-18');
    it('=== is object equality', () => equal(md1, md1));
    it('!== is object equality', () => notEqual(md1, md1again));
    it('<', () => throws(() => md1 < md2));
    it('>', () => throws(() => md1 > md2));
    it('<=', () => throws(() => md1 <= md2));
    it('>=', () => throws(() => md1 >= md2));
  });
  describe('MonthDay.toDate()', () => {
    const md = MonthDay.from('01-22');
    it('takes a number argument', () => {
      equal(`${md.toDate(2002)}`, '2002-01-22');
    });
    it('takes an object argument with year property', () => {
      equal(`${md.toDate({ year: 2002 })}`, '2002-01-22');
    });
    it('needs at least a year property on the object in the ISO calendar', () => {
      throws(() => md.toDate({ something: 'nothing' }), TypeError);
    });
    it('converts a non-object argument to integer', () => {
      equal(`${md.toDate('2002')}`, '2002-01-22');
      equal(`${md.toDate(null)}`, '+000000-01-22');
    });
  });
  describe('monthDay.getFields() works', () => {
    const calendar = Temporal.Calendar.from('iso8601');
    const md1 = MonthDay.from({ month: 11, day: 18, calendar });
    const fields = md1.getFields();
    it('fields', () => {
      equal(fields.month, 11);
      equal(fields.day, 18);
      equal(fields.calendar, calendar);
    });
    it('enumerable', () => {
      const fields2 = { ...fields };
      equal(fields2.month, 11);
      equal(fields2.day, 18);
      equal(fields2.calendar, calendar);
    });
    it('as input to from()', () => {
      const md2 = MonthDay.from(fields);
      assert(md1.equals(md2));
    });
  });
  describe('monthDay.getISOCalendarFields() works', () => {
    const md1 = MonthDay.from('11-18');
    const fields = md1.getISOCalendarFields();
    it('fields', () => {
      equal(fields.month, 11);
      equal(fields.day, 18);
      equal(typeof fields.year, 'number');
    });
    it('enumerable', () => {
      const fields2 = { ...fields };
      equal(fields2.month, 11);
      equal(fields2.day, 18);
      equal(typeof fields2.year, 'number');
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) {
  report(reporter).then((failed) => process.exit(failed ? 1 : 0));
}
