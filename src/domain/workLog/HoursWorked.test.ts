import { describe, it, expect } from 'vitest';
import { HoursWorked } from './HoursWorked';
import { DomainError } from '@common/DomainError';

describe('HoursWorked', () => {
  it('should create a valid HoursWorked instance', () => {
    const hours = HoursWorked.create(4);
    expect(hours).toBeDefined();
    expect(hours.value).toBe(4);
  });

  it('should create a valid HoursWorked instance for minimum value', () => {
    const hours = HoursWorked.create(0.5);
    expect(hours.value).toBe(0.5);
  });

  it('should create a valid HoursWorked instance for maximum value', () => {
    const hours = HoursWorked.create(12);
    expect(hours.value).toBe(12);
  });

  it('should throw error for less than 0.5 hours', () => {
    expect(() => HoursWorked.create(0.4)).toThrow(DomainError);
    expect(() => HoursWorked.create(0)).toThrow('Hours worked must be between 0.5 and 12.');
  });

  it('should throw error for more than 12 hours', () => {
    expect(() => HoursWorked.create(12.1)).toThrow(DomainError);
  });

  it('should throw error for invalid number', () => {
    expect(() => HoursWorked.create(NaN)).toThrow(DomainError);
    expect(() => HoursWorked.create(Infinity)).toThrow(DomainError);
  });
});
