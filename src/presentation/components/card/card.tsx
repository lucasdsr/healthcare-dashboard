import * as React from 'react';
import { useCardLogic } from './card.logic';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { getCardClasses } = useCardLogic();

  return <div ref={ref} className={getCardClasses(className)} {...props} />;
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { getCardHeaderClasses } = useCardLogic();

  return (
    <div ref={ref} className={getCardHeaderClasses(className)} {...props} />
  );
});
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const { getCardTitleClasses } = useCardLogic();

  return <h3 ref={ref} className={getCardTitleClasses(className)} {...props} />;
});
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { getCardDescriptionClasses } = useCardLogic();

  return (
    <p ref={ref} className={getCardDescriptionClasses(className)} {...props} />
  );
});
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { getCardContentClasses } = useCardLogic();

  return (
    <div ref={ref} className={getCardContentClasses(className)} {...props} />
  );
});
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { getCardFooterClasses } = useCardLogic();

  return (
    <div ref={ref} className={getCardFooterClasses(className)} {...props} />
  );
});
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
