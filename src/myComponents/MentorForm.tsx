// components/MentorForm.tsx
"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
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
import type { MentorFormValues } from "@/lib/validation";
import { useRouter } from "next/navigation";

const steps = [
  "Personal Info",
  "Background",
  "Skills",
  "Details",
  "Additional",
];

// Fields for each step
const stepFields: Array<Array<keyof MentorFormValues>> = [
  ["fullName", "email", "phone", "profilePhoto"],
  ["currentRole", "company", "yearsOfExperience", "education", "careerHistory"],
  ["technicalSkills", "industrySpecialization", "softSkills"],
  ["mentoringGoals", "mentoringStyle"],
  ["linkedinUrl", "personalBio", "achievements", "languages", "areasOfInterest", "testimonials", "termsAgreed"]
];

export default function MentorForm({ onSubmit }: { onSubmit: (data: MentorFormValues) => Promise<void> }) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<MentorFormValues>({
    resolver: zodResolver(mentorFormSchema),
    defaultValues: defaultMentorFormValues,
    mode: "onChange",
  });

  const { control, handleSubmit, trigger, formState } = form;

  // Navigate to next step after validating current step
  const goNext = async () => {
    const fields = stepFields[step];
    const ok = await trigger(fields, { shouldFocus: true });
    if (ok) setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  // Navigate to previous step
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  // Final submission handler
  const onSubmitForm: SubmitHandler<MentorFormValues> = async (data) => {
    // Validate entire form before submission
    const isValid = await trigger(undefined, { shouldFocus: true });
    if (!isValid) {
      // Find first error and jump to that step
      const errorFields = Object.keys(formState.errors);
      if (errorFields.length > 0) {
        const firstError = errorFields[0] as keyof MentorFormValues;
        for (let i = 0; i < stepFields.length; i++) {
          if (stepFields[i].includes(firstError)) {
            setStep(i);
            return;
          }
        }
      }
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(data);
      router.push("/mentor-dashboard");
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormRoot {...form}>
      <form
        onSubmit={handleSubmit(onSubmitForm)}
        className="
          bg-white shadow-lg rounded-lg
          w-full mx-auto
          px-4 sm:px-6 md:px-8 lg:px-10
          max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl
          py-6
          space-y-6
        "
      >
        {/* Step Indicator */}
        <FormStepIndicator steps={steps} currentStep={step} onStepClick={(i) => i < step && setStep(i)} />

        {/* Step Contents */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <FormField control={control} name="fullName" render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl><Input {...field} placeholder="Your name" /></FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input {...field} type="email" placeholder="you@mail.com" /></FormControl>
                  <FormMessage/>
                </FormItem>
              )}/>
              <FormField control={control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (optional)</FormLabel>
                  <FormControl><Input {...field} placeholder="+1 555 1234" /></FormControl>
                  <FormMessage/>
                </FormItem>
              )}/>
            </div>
            <FormField control={control} name="profilePhoto" render={({ field }) => (
              <FormItem>
                <FormLabel>Photo</FormLabel>
                <FormControl>
                  <ImageUpload value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <FormField control={control} name="currentRole" render={({ field }) => (
              <FormItem>
                <FormLabel>Current Role</FormLabel>
                <FormControl><Input {...field} placeholder="e.g. Senior Engineer" /></FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            <FormField control={control} name="company" render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl><Input {...field} placeholder="e.g. Acme Corp" /></FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            <FormField control={control} name="yearsOfExperience" render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl><Input {...field} type="number" placeholder="e.g. 5" /></FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            <FormField control={control} name="education" render={({ field }) => (
              <FormItem>
                <FormLabel>Education</FormLabel>
                <FormControl><Input {...field} placeholder="e.g. MS Computer Science" /></FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            <FormField control={control} name="careerHistory" render={({ field }) => (
              <FormItem>
                <FormLabel>Career History</FormLabel>
                <FormControl><Textarea {...field} placeholder="Brief career milestones" /></FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <FormField control={control} name="technicalSkills" render={({ field }) => (
              <FormItem>
                <FormLabel>Technical Skills</FormLabel>
                <FormControl>
                  <MultiSelect options={technicalSkillOptions} selected={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            <FormField control={control} name="softSkills" render={({ field }) => (
              <FormItem>
                <FormLabel>Soft Skills</FormLabel>
                <FormControl>
                  <MultiSelect options={softSkillOptions} selected={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            <FormField control={control} name="industrySpecialization" render={({ field }) => (
              <FormItem>
                <FormLabel>Industry Specialization</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <SelectTrigger><SelectValue placeholder="Choose industry" /></SelectTrigger>
                    <SelectContent>
                      {industryOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <FormField control={control} name="mentoringGoals" render={({ field }) => (
              <FormItem>
                <FormLabel>Mentoring Goals</FormLabel>
                <FormControl><Textarea {...field} placeholder="What do you aim to achieve?" /></FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            <FormField control={control} name="mentoringStyle" render={({ field }) => (
              <FormItem>
                <FormLabel>Style</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select style"/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="structured">Structured</SelectItem>
                      <SelectItem value="informal">Informal</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <FormField control={control} name="linkedinUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn URL</FormLabel>
                <FormControl><Input {...field} placeholder="https://linkedin.com/in/..." /></FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            <FormField control={control} name="personalBio" render={({ field }) => (
              <FormItem>
                <FormLabel>Personal Bio</FormLabel>
                <FormControl><Textarea {...field} placeholder="Tell us about yourself" /></FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            <FormField control={control} name="achievements" render={({ field }) => (
              <FormItem>
                <FormLabel>Achievements</FormLabel>
                <FormControl><Textarea {...field} placeholder="List your key achievements" /></FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            <FormField control={control} name="languages" render={({ field }) => (
              <FormItem>
                <FormLabel>Languages</FormLabel>
                <FormControl>
                  <MultiSelect options={languageOptions} selected={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            <FormField control={control} name="areasOfInterest" render={({ field }) => (
              <FormItem>
                <FormLabel>Areas of Interest</FormLabel>
                <FormControl>
                  <MultiSelect options={areasOfInterestOptions} selected={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            <FormField control={control} name="testimonials" render={({ field }) => (
              <FormItem>
                <FormLabel>Testimonials</FormLabel>
                <FormControl><Textarea {...field} placeholder="Any references or testimonials" /></FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            <FormField control={control} name="termsAgreed" render={({ field }) => (
              <FormItem className="flex items-start space-x-3 p-4 border rounded">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <FormLabel>Agree to terms and conditions</FormLabel>
                <FormMessage/>
              </FormItem>
            )}/>
          </motion.div>
        )}

        {/* Nav Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button 
            variant="outline" 
            onClick={goBack} 
            disabled={step === 0} 
            type="button"
            className="w-full sm:w-40"
          >
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button 
              onClick={goNext}
              type="button"
              className="w-full sm:w-40"
            >
              Next
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={submitting} 
              className="w-full sm:w-40 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="animate-spin" />} Submit
            </Button>
          )}
        </div>
      </form>
    </FormRoot>
  );
}