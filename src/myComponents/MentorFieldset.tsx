
import { ReactNode } from "react";

interface MentorFieldsetProps {
  legend: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

const MentorFieldset = ({
  legend,
  description,
  children,
  className = "",
}: MentorFieldsetProps) => {
  return (
    <fieldset className={`animate-scale-in border border-border rounded-xl p-6 shadow-sm ${className}`}>
      <legend className="px-2 font-medium text-lg">{legend}</legend>
      {description && (
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
      )}
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
};

export default MentorFieldset;
