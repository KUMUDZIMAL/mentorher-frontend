"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Form as FormRoot,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, PlusCircle, MinusCircle, Loader2 } from "lucide-react";
import {
  mentorFormSchema,
  defaultMentorFormValues,
  technicalSkillOptions,
  softSkillOptions,
  industryOptions,
  languageOptions,
  areasOfInterestOptions,
} from "@/lib/validation";
import { cn } from "@/lib/utils";
import ImageUpload from "./ImageUpload";
import MultiSelect from "./MultiSelect";
import MentorFieldset from "./MentorFieldset";
import FormStepIndicator from "./FormStepIndicator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import type { MentorFormValues } from "@/lib/validation";

// Define the steps and ensure switch cases match
const steps = [
  "Personal Info",
  "Professional Background",
  "Areas of Expertise",
  "Mentorship Details",
  "Online Presence",
  "Additional Info",
];

export interface MentorFormProps {
  onSubmit: (data: any) => Promise<void>;
  isSubmittingExternal: boolean;
}

const MentorForm: React.FC<MentorFormProps> = ({ onSubmit, isSubmittingExternal }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [availabilitySlots, setAvailabilitySlots] = useState<any[]>([
    { day: "", startTime: "", endTime: "" },
  ]);
  const [experienceSlots, setExperienceSlots] = useState<any[]>([
    { role: "", company: "", duration: "", description: "", current: false },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<MentorFormValues>({
    resolver: zodResolver(mentorFormSchema),
    defaultValues: { ...defaultMentorFormValues },
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    getValues,
  } = form;

  // Availability handlers omitted for brevity...

  const getFieldsForStep = (step: number): (keyof MentorFormValues)[] => {
    switch (step) {
      case 0:
        return ["fullName", "email", "phone", "profilePhoto"];
      case 1:
        return ["currentRole", "company", "yearsOfExperience", "education"];
      case 2:
        return ["technicalSkills", "industrySpecialization", "softSkills"];
      case 3:
        return ["mentoringGoals", "mentoringStyle", "availability", "mentorshipExperience"];
      case 4:
        return ["linkedinUrl", "personalBio", "achievements", "languages", "areasOfInterest"];
      case 5:
        return ["testimonials", "termsAgreed"];
      default:
        return [];
    }
  };

  const onFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    await onSubmit(data);
    setIsSubmitting(false);
    router.push("/mentor-dashboard");
  };

  const handleNext = async () => {
    const fields = getFieldsForStep(currentStep);
    const valid = await trigger(fields);
    if (valid) {
      window.scrollTo(0, 0);
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    window.scrollTo(0, 0);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        // ... Personal Info
        break;
      case 1:
        // ... Professional Background
        break;
      case 2:
        // ... Areas of Expertise & Skills
        break;
      case 3:
        // ... Mentorship Specifics
        break;
      case 4:
        // ... Online Presence & Additional Details (LinkedIn, Bio, Achievements)
        break;
      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            key="step-5"
            className="space-y-6"
          >
            <MentorFieldset
              legend="Additional Info"
              description="Share any testimonials and agree to terms"
            >
              <FormField
                control={control}
                name="testimonials"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Testimonials (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share testimonials or references"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="termsAgreed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I agree to the terms and conditions</FormLabel>
                      <FormDescription>
                        By submitting, you agree to our{' '}
                        <Button variant="link" className="h-auto p-0">
                          Terms of Service
                        </Button>{' '}
                        and{' '}
                        <Button variant="link" className="h-auto p-0">
                          Privacy Policy
                        </Button>.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </MentorFieldset>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <FormRoot {...form}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
        <FormStepIndicator
          steps={steps}
          currentStep={currentStep}
          handleStepClick={(s) => {
            if (s < currentStep) setCurrentStep(s);
          }}
        />
        {renderStepContent()}
        <div className="flex justify-between mt-8 pt-4 border-t">
          {currentStep > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="w-24"
            >
              Previous
            </Button>
          ) : (
            <div className="w-24" />
          )}
          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={handleNext} className="w-24">
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting || isSubmittingExternal}
              className="w-24"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting
                </>
              ) : (
                'Submit'
              )}
            </Button>
          )}
        </div>
      </form>
    </FormRoot>
  );
};

export default MentorForm;
