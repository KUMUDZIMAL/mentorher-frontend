// components/MentorForm.tsx
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
  const [slots, setSlots] = useState([{ day: "", startTime: "", endTime: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(mentorFormSchema),
    defaultValues: defaultMentorFormValues,
    mode: "onChange",
  });
  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    getValues,
    formState,
  } = form;

  // Slot handlers omitted for brevity...

  // Validate only fields for the current step
  const goNext = async () => {
    let fieldsToValidate: (keyof MentorFormValues)[];
  
    if (step === 0) {
      fieldsToValidate = ["fullName","email","phone","profilePhoto"];
    } else if (step === 1) {
      fieldsToValidate = ["currentRole","company","yearsOfExperience","education","careerHistory"];
    } else if (step === 2) {
      fieldsToValidate = ["technicalSkills","industrySpecialization","softSkills"];
    } else if (step === 3) {
      // only validate the two fields you have on screen right now
      fieldsToValidate = ["mentoringGoals","mentoringStyle"];
    } else {
      fieldsToValidate = [
        "availability",
        "mentorshipExperience",
        "linkedinUrl",
        "personalBio",
        "achievements",
        "languages",
        "areasOfInterest",
        "testimonials",
        "termsAgreed",
      ];
    }
  
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const doSubmit = async (data) => {
    setSubmitting(true);
    await onSubmit(data);
    setSubmitting(false);
    router.push("/mentor-dashboard");
  };

  return (
    <FormRoot {...form}>
      <form
        onSubmit={handleSubmit(doSubmit)}
        className="
          bg-white shadow-lg rounded-lg
          w-full mx-auto
          px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10
          max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl
          p-3 sm:p-5 md:p-6 lg:p-8
          space-y-6
        "
      >
        {/* Step Indicator */}
        <div className="overflow-x-auto">
          <FormStepIndicator
            steps={steps}
            currentStep={step}
            onStepClick={(i) => i < step && setStep(i)}
          />
        </div>

        {/* Step 0: Personal Info */}
        {step === 0 && (
          <motion.div
            key="0"
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FormField
              control={control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <FormLabel>Phone (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+1 555 1234" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={control}
              name="profilePhoto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={(file) => field.onChange(file)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        )}

        {/* Step 1: Background */}
        {step === 1 && (
          <motion.div key="1" className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <FormField
              control={control}
              name="currentRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Role</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Senior Engineer" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Acme Corp" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* You can add fields for yearsOfExperience, education, careerHistory similarly */}
          </motion.div>
        )}

        {/* Step 2: Skills */}
        {step === 2 && (
          <motion.div key="2" className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <FormField
              control={control}
              name="technicalSkills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technical Skills</FormLabel>
                  <FormControl>
                    <MultiSelect
                      placeholder="Select skills"
                      options={technicalSkillOptions}
                      selected={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="softSkills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Soft Skills</FormLabel>
                  <FormControl>
                    <MultiSelect
                      placeholder="Select soft skills"
                      options={softSkillOptions}
                      selected={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <motion.div key="3" className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Mentoring Goals */}
            <FormField
              control={control}
              name="mentoringGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mentoring Goals</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="What do you aim to achieve?" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Mentoring Style */}
            <FormField
              control={control}
              name="mentoringStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Style</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="structured">Structured</SelectItem>
                        <SelectItem value="informal">Informal</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Availability slots UI goes here */}
          </motion.div>
        )}

        {/* Step 4: Additional */}
        {step === 4 && (
          <motion.div key="4" className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <FormField
              control={control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://linkedin.com/in/..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="personalBio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Bio</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Tell us about yourself" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="termsAgreed"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 p-4 border rounded">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div>
                    <FormLabel>Agree to terms and conditions</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button variant="outline" onClick={goBack} disabled={step === 0} className="w-full sm:w-40">
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={goNext} className="w-full sm:w-40">
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={submitting} className="w-full sm:w-40 flex justify-center gap-2">
              {submitting && <Loader2 className="animate-spin" />}
              Submit
            </Button>
          )}
        </div>
      </form>
    </FormRoot>
  );
}
