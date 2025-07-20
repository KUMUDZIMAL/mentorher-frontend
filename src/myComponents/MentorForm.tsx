// components/MentorForm.jsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Form as FormRoot,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, MinusCircle, Loader2 } from "lucide-react";
import ImageUpload from "./ImageUpload";
import MultiSelect from "./MultiSelect";
import FormStepIndicator from "./FormStepIndicator";
import {
  mentorFormSchema,
  defaultMentorFormValues,
  technicalSkillOptions,
  softSkillOptions,
  industryOptions,
  languageOptions,
  areasOfInterestOptions,
} from "@/lib/validation";
import { useRouter } from "next/navigation";

const steps = [
  "Personal Info",
  "Background",
  "Skills",
  "Details",
  "Additional",
];

export default function MentorForm({ onSubmit }) {
  const [step, setStep] = useState(0);
  const [slots, setSlots] = useState([{ day:"",startTime:"",endTime:""}]);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(mentorFormSchema),
    defaultValues: defaultMentorFormValues,
    mode: "onChange"
  });
  const { control, handleSubmit, trigger, setValue, getValues } = form;

  // slot handlers omitted for brevity...

  const goNext = async () => {
    const valid = await trigger(); 
    if (valid) setStep(s => Math.min(s+1, steps.length-1));
  };
  const goBack = () => setStep(s => Math.max(s-1,0));

  const doSubmit = async data => {
    setSubmitting(true);
    await onSubmit(data);
    setSubmitting(false);
    router.push("/mentor-dashboard");
  };

  return (
    <FormRoot {...form}>
      <form
        onSubmit={handleSubmit(doSubmit)}
        className={`
          bg-white shadow-lg rounded-lg
          w-full mx-auto
          px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10
          max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl
          p-3 sm:p-5 md:p-6 lg:p-8
          space-y-6
        `}
      >
        {/* Step Indicator */}
        <div className="overflow-x-auto">
          <FormStepIndicator
            steps={steps}
            currentStep={step}
            onStepClick={i => i < step && setStep(i)}
          />
        </div>

        {/* STEP CONTENT */}
        {step === 0 && (
          <motion.div key="0" className="space-y-6" initial={{opacity:0}} animate={{opacity:1}}>
            {/* Personal Info */}
            <div className="space-y-4">
              {/* Full Name */}
              <FormField
                control={control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base md:text-lg">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Your name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Email & Phone in Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="you@mail.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (opt)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+1 555 1234" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Photo */}
              <FormField
                control={control}
                name="profilePhoto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={file => field.onChange(file)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </motion.div>
        )}

        {/* ...repeat the same fluid grid+typography approach for steps 1–4... */}

        {/* NAV BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button
            variant="outline"
            onClick={goBack}
            disabled={step===0}
            className="w-full sm:w-40"
          >
            Back
          </Button>
          {step < steps.length-1 ? (
            <Button onClick={goNext} className="w-full sm:w-40">
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full sm:w-40 flex justify-center gap-2"
              disabled={submitting}
            >
              {submitting && <Loader2 className="animate-spin" />}
              Submit
            </Button>
          )}
        </div>
      </form>
    </FormRoot>
  );
}
