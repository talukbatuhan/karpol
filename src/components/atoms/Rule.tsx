export interface RuleProps {
  className?: string;
}

export function Rule({ className = "" }: RuleProps) {
  return <hr className={`h-px border-0 bg-gold-500 ${className}`} />;
}
