
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormStepIndicatorProps {
  steps: string[];
  currentStep: number;
  handleStepClick: (step: number) => void;
}

const FormStepIndicator = ({
  steps,
  currentStep,
  handleStepClick,
}: FormStepIndicatorProps) => {
  return (
    <div className="py-4 px-1 mb-6">
      <div className="flex justify-between relative">
        {/* Progress Bar */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-muted -translate-y-1/2">
          <motion.div
            className="h-full bg-primary origin-left"
            style={{ scaleX: currentStep / (steps.length - 1) }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: currentStep / (steps.length - 1) }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div
              key={index}
              className="flex flex-col items-center relative z-10"
            >
              {/* Step Circle */}
              <button
                type="button"
                onClick={() => handleStepClick(index)}
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 focus-ring",
                  isCompleted 
                    ? "bg-primary border-primary text-white" 
                    : isCurrent 
                      ? "border-primary bg-white text-primary" 
                      : "border-muted bg-secondary text-muted-foreground"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>

              {/* Step Label */}
              <span
                className={cn(
                  "text-xs mt-2 font-medium whitespace-nowrap transition-colors duration-200",
                  isCurrent ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FormStepIndicator;
