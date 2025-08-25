import { cn } from '../cn';

describe('cn utility function', () => {
  it('should combine multiple class names', () => {
    const result = cn('class1', 'class2', 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const isDisabled = false;

    const result = cn(
      'base-class',
      isActive && 'active',
      isDisabled && 'disabled'
    );

    expect(result).toBe('base-class active');
  });

  it('should handle falsy values', () => {
    const result = cn(
      'base-class',
      null,
      undefined,
      false,
      0,
      '',
      'valid-class'
    );

    expect(result).toBe('base-class valid-class');
  });

  it('should handle empty strings', () => {
    const result = cn('class1', '', 'class2');
    expect(result).toBe('class1 class2');
  });

  it('should handle single class', () => {
    const result = cn('single-class');
    expect(result).toBe('single-class');
  });

  it('should handle no arguments', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle mixed types', () => {
    const result = cn('base', 'class1', null, 'class2', undefined, 'class3');

    expect(result).toBe('base class1 class2 class3');
  });

  it('should handle conditional objects', () => {
    const isActive = true;
    const isVisible = false;

    const result = cn('base', {
      active: isActive,
      visible: isVisible,
      always: true,
    });

    expect(result).toBe('base active always');
  });

  it('should handle nested conditionals', () => {
    const userRole = 'admin';
    const isLoggedIn = true;

    const result = cn(
      'base',
      isLoggedIn && 'logged-in',
      userRole === 'admin' && 'admin',
      userRole === 'user' && 'user'
    );

    expect(result).toBe('base logged-in admin');
  });

  it('should handle complex conditional logic', () => {
    const status = 'success';
    const size = 'large';
    const variant = 'primary';

    const result = cn(
      'button',
      `button--${size}`,
      `button--${variant}`,
      status === 'success' && 'button--success',
      status === 'error' && 'button--error',
      status === 'warning' && 'button--warning'
    );

    expect(result).toBe('button button--large button--primary button--success');
  });

  it('should handle arrays of classes', () => {
    const baseClasses = ['base', 'component'];
    const conditionalClasses = ['conditional', 'class'];

    const result = cn(...baseClasses, ...conditionalClasses);
    expect(result).toBe('base component conditional class');
  });

  it('should handle mixed arrays and strings', () => {
    const baseClasses = ['base', 'component'];
    const additionalClass = 'additional';

    const result = cn(...baseClasses, additionalClass);
    expect(result).toBe('base component additional');
  });

  it('should handle empty arrays', () => {
    const result = cn('base', [], 'class');
    expect(result).toBe('base class');
  });

  it('should handle whitespace in class names', () => {
    const result = cn('  class1  ', '  class2  ', '  class3  ');
    expect(result).toBe('class1 class2 class3');
  });

  it('should handle special characters in class names', () => {
    const result = cn(
      'class-with-dash',
      'class_with_underscore',
      'class.with.dot'
    );
    expect(result).toBe('class-with-dash class_with_underscore class.with.dot');
  });

  it('should handle CSS modules style objects', () => {
    const styles = {
      base: 'base-class',
      active: 'active-class',
      disabled: 'disabled-class',
    };

    const isActive = true;
    const isDisabled = false;

    const result = cn(
      styles.base,
      isActive && styles.active,
      isDisabled && styles.disabled
    );

    expect(result).toBe('base-class active-class');
  });

  it('should handle complex conditional objects with CSS modules', () => {
    const styles = {
      button: 'btn',
      primary: 'btn--primary',
      secondary: 'btn--secondary',
      large: 'btn--large',
      small: 'btn--small',
    };

    const variant = 'primary';
    const size = 'large';

    const result = cn(
      styles.button,
      variant === 'primary' && styles.primary,
      variant === 'secondary' && styles.secondary,
      size === 'large' && styles.large,
      size === 'small' && styles.small
    );

    expect(result).toBe('btn btn--primary btn--large');
  });
});
