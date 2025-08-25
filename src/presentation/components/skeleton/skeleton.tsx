import React from 'react';
import { SkeletonProps } from './skeleton.interface';
import { useSkeletonLogic } from './skeleton.logic';

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width,
  height,
}) => {
  const { getSkeletonClasses } = useSkeletonLogic();

  return (
    <div
      data-testid="skeleton"
      className={getSkeletonClasses(className)}
      style={{
        width: width,
        height: height,
      }}
    />
  );
};

export const MetricCardSkeleton: React.FC = () => {
  const { getMetricCardSkeletonClasses } = useSkeletonLogic();
  const classes = getMetricCardSkeletonClasses();

  return (
    <div data-testid="metric-card-skeleton" className={classes.container}>
      <div className={classes.header}>
        <Skeleton className={classes.title} />
        <Skeleton className={classes.icon} />
      </div>
      <Skeleton className={classes.value} />
      <Skeleton className={classes.subtitle} />
    </div>
  );
};
