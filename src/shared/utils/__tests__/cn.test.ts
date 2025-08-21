import { cn } from '../cn';

describe('cn utility function', () => {
  it('should combine class names correctly', () => {
    const result = cn('class1', 'class2', 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const isDisabled = false;

    const result = cn(
      'base-class',
      isActive && 'active-class',
      isDisabled && 'disabled-class'
    );

    expect(result).toBe('base-class active-class');
  });

  it('should handle undefined and null values', () => {
    const result = cn('class1', undefined, null, 'class2');
    expect(result).toBe('class1 class2');
  });

  it('should handle empty strings', () => {
    const result = cn('class1', '', 'class2');
    expect(result).toBe('class1 class2');
  });

  it('should handle arrays of classes', () => {
    const result = cn('class1', ['class2', 'class3'], 'class4');
    expect(result).toBe('class1 class2 class3 class4');
  });

  it('should handle objects with boolean values', () => {
    const result = cn('base', {
      active: true,
      disabled: false,
      hidden: true,
    });
    expect(result).toBe('base active hidden');
  });

  it('should handle mixed input types', () => {
    const result = cn(
      'base-class',
      'static-class',
      undefined,
      null,
      false && 'never-show',
      true && 'always-show',
      ['array-class1', 'array-class2'],
      { 'object-class': true, 'object-class-false': false }
    );

    expect(result).toBe(
      'base-class static-class always-show array-class1 array-class2 object-class'
    );
  });

  it('should return empty string for no input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle single class', () => {
    const result = cn('single-class');
    expect(result).toBe('single-class');
  });
});
