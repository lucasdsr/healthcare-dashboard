import React from 'react';
import { LoadingSpinnerProps } from './loading-spinner.interface';
import { useLoadingSpinnerLogic } from './loading-spinner.logic';

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text,
  variant = 'purple',
}) => {
  const {
    getSizeClass,
    getVariantClass,
    getContainerClasses,
    getSpinnerClasses,
    getTextClasses,
  } = useLoadingSpinnerLogic();

  const sizeClass = getSizeClass(size);
  const variantClass = getVariantClass(variant);
  const containerClasses = getContainerClasses(className);
  const spinnerClasses = getSpinnerClasses(variantClass, sizeClass);
  const textClasses = getTextClasses();

  return (
    <div data-testid="loading-spinner" className={containerClasses}>
      <div className={spinnerClasses} />
      {text && <p className={textClasses}>{text}</p>}
    </div>
  );
};
