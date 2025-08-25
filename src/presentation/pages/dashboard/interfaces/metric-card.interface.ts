export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export interface MetricCardLogic {
  cardClassName: string;
  changeTextClassName: string;
  changeText: string;
}
