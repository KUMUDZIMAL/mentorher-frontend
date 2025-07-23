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
import { PlusCircle, MinusCircle, Loader2 } from "lucide-react";
import {
  mentorFormSchema,
  defaultMentorFormValues,
  technicalSkillOptions,
  softSkillOptions,
  industryOptions,
  languageOptions,
  areasOfInterestOptions,
} from "@/lib/validation";
import ImageUpload from "./ImageUpload";
import MultiSelect from "./MultiSelect";
import MentorFieldset from "./MentorFieldset";
import FormStepIndicator from "./FormStepIndicator";
import { useRouter } from "next/navigation";
import type { MentorFormValues } from "@/lib/validation";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<MentorFormValues>({
    resolver: zodResolver(mentorFormSchema),
    defaultValues: { ...defaultMentorFormValues },
    mode: "onChange",
  });

  const { control, handleSubmit, formState: { errors }, trigger, setValue, getValues } = form;

  const addAvailabilitySlot = () => {
    const newSlots = [...availabilitySlots, { day: "", startTime: "", endTime: "" }];
    setAvailabilitySlots(newSlots);
    setValue("availability", newSlots);
  };

  const removeAvailabilitySlot = (index: number) => {
    if (availabilitySlots.length > 1) {
      const newSlots = [...availabilitySlots];
      newSlots.splice(index, 1);
      setAvailabilitySlots(newSlots);
      const current = getValues("availability") || [];
      current.splice(index, 1);
      setValue("availability", current);
    }
  };

  const updateAvailabilitySlot = (index: number, field: string, value: string) => {
    const newSlots = [...availabilitySlots];
    newSlots[index][field] = value;
    setAvailabilitySlots(newSlots);
    const current = [...(getValues("availability") || [])];
    current[index] = { ...newSlots[index] };
    setValue("availability", current);
  };

  const getFieldsForStep = (step: number): (keyof MentorFormValues)[] => {
    switch (step) {
      case 0: return ["fullName", "email", "phone", "profilePhoto"];
      case 1: return ["currentRole", "company", "yearsOfExperience", "education"];
      case 2: return ["technicalSkills", "industrySpecialization", "softSkills"];
      case 3: return ["mentoringGoals", "mentoringStyle", "availability", "mentorshipExperience"];
      case 4: return ["linkedinUrl", "personalBio", "achievements", "languages", "areasOfInterest"];
      case 5: return ["testimonials", "termsAgreed"];
      default: return [];
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
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="step-0" className="space-y-6">
            <MentorFieldset legend="Personal Information" description="Tell us about yourself">
              <FormField control={control} name="fullName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input placeholder="Enter your full name" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl><Input type="email" placeholder="Enter your email" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl><Input placeholder="Enter your phone number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={control} name="profilePhoto" render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Photo</FormLabel>
                  <FormControl><ImageUpload value={field.value} onChange={field.onChange} /></FormControl>
                  <FormDescription>Upload a professional photo to be displayed on your mentor profile</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
            </MentorFieldset>
          </motion.div>
        );
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="step-1" className="space-y-6">
            <MentorFieldset legend="Professional Background" description="Tell us about your professional experience">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={control} name="currentRole" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Role</FormLabel>
                    <FormControl><Input placeholder="e.g. Software Engineer" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={control} name="company" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl><Input placeholder="e.g. Tech Solutions Inc" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={control} name="yearsOfExperience" render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} placeholder="Years of experience" {...field} onChange={e => field.onChange(parseInt(e.target.value)||0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="education" render={({ field }) => (
                <FormItem>
                  <FormLabel>Educational Background</FormLabel>
                  <FormControl><Textarea placeholder="e.g. BS Computer Science from Stanford University" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </MentorFieldset>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="step-2" className="space-y-6">
            <MentorFieldset legend="Areas of Expertise & Skills" description="Share your technical and professional skills">
              <FormField control={control} name="technicalSkills" render={({ field }) => (
                <FormItem>
                  <FormLabel>Technical Skills</FormLabel>
                  <FormControl><MultiSelect options={technicalSkillOptions} selected={field.value||[]} onChange={field.onChange} placeholder="Select technical skills" /></FormControl>
                  <FormDescription>Select the technical skills you're proficient in</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="industrySpecialization" render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry Specialization</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                      <SelectContent>{industryOptions.map(i=><SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Choose the industry where you have the most experience</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="softSkills" render={({ field }) => (
                <FormItem>
                  <FormLabel>Soft Skills</FormLabel>
                  <FormControl><MultiSelect options={softSkillOptions} selected={field.value||[]} onChange={field.onChange} placeholder="Select soft skills" /></FormControl>
                  <FormDescription>Select the soft skills you excel in</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
            </MentorFieldset>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="step-3" className="space-y-6">
            <MentorFieldset legend="Mentorship Specifics" description="Tell us about your mentoring style and availability">
              <FormField control={control} name="mentoringGoals" render={({ field }) => (
                <FormItem>
                  <FormLabel>Mentoring Goals</FormLabel>
                  <FormControl><Textarea placeholder="Describe what you hope to achieve as a mentor" {...field} /></FormControl>
                  <FormDescription>Explain the impact you want to have as a mentor</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="mentoringStyle" render={({ field }) => (
                <FormItem>
                  <FormLabel>Mentoring Style</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select mentoring style" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="structured">Structured (Regular sessions with defined goals)</SelectItem>
                        <SelectItem value="informal">Informal (Flexible availability for questions)</SelectItem>
                        <SelectItem value="hybrid">Hybrid (Mix of structured sessions and ad-hoc 지원)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Choose the mentoring approach that best suits your style</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <FormLabel>Availability</FormLabel>
                  <Button type="button" variant="outline" size="sm" onClick={addAvailabilitySlot} className="h-8 gap-1"><PlusCircle className="h-4 w-4" />Add Time Slot</Button>
                </div>
                <FormDescription>Specify when you're available for mentoring sessions</FormDescription>
                <div className="space-y-3">
                  {availabilitySlots.map((slot, idx) => (
                    <Card key={idx} className="shadow-sm">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
                          <div className="md:col-span-3">
                            <Label htmlFor={`day-${idx}`}>Day</Label>
                            <Select value={slot.day} onValueChange={v=>updateAvailabilitySlot(idx,'day',v)}>
                              <SelectTrigger id={`day-${idx}`} className="w-full mt-1"><SelectValue placeholder="Select day" /></SelectTrigger>
                              <SelectContent>
                                {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(d=><SelectItem key={d} value={d}>{d}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`start-${idx}`}>Start Time</Label>
                            <Input id={`start-${idx}`} type="time" value={slot.startTime} onChange={e=>updateAvailabilitySlot(idx,'startTime',e.target.value)} className="mt-1" />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`end-${idx}`}>End Time</Label>
                            <Input id={`end-${idx}`} type="time" value={slot.endTime} onChange={e=>updateAvailabilitySlot(idx,'endTime',e.target.value)} className="mt-1" />
                          </div>
                          <div className="md:col-span-1 flex items-end">
                            <Button type="button" variant="ghost" size="icon" onClick={()=>removeAvailabilitySlot(idx)} disabled={availabilitySlots.length<=1} className="w-8 h-8 mt-1"><MinusCircle className="h-4 w-4 text-muted-foreground" /></Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {errors.availability && <p className="text-sm font-medium text-destructive">{errors.availability.message}</p>}
              </div>
              <FormField control={control} name="mentorshipExperience" render={({ field })=>(
                <FormItem>
                  <FormLabel>Previous Mentorship Experience (Optional)</FormLabel>
                  <FormControl><Textarea placeholder="Describe any previous experience you have as a mentor" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </MentorFieldset>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="step-4" className="space-y-6">
            <MentorFieldset legend="Online Presence & Additional Details" description="Share your online profiles and additional information">
              <FormField control={control} name="linkedinUrl" render={({ field })=>(
                <FormItem>
                  <FormLabel>LinkedIn Profile URL</FormLabel>
                  <FormControl><Input placeholder="https://linkedin.com/in/yourprofile" {...field} /></FormControl>
                  <FormDescription>Share your LinkedIn profile or portfolio</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="personalBio" render={({ field })=>(
                <FormItem>
                  <FormLabel>Personal Bio</FormLabel>
                  <FormControl><Textarea placeholder="Write a short introduction about yourself" {...field} /></FormControl>
                  <FormDescription>This will be displayed on your mentor profile</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="achievements" render={({ field })=>(
                <FormItem>
                  <FormLabel>Achievements & Awards (Optional)</FormLabel>
                  <FormControl><Textarea placeholder="List any significant achievements or awards" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="languages" render={({ field })=>(
                <FormItem>
                  <FormLabel>Languages Spoken</FormLabel>
                  <FormControl><MultiSelect options={languageOptions} selected={field.value||[]} onChange={field.onChange} placeholder="Select languages" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="areasOfInterest" render={({ field })=>(
                <FormItem>
                  <FormLabel>Areas of Interest for Mentoring (Optional)</FormLabel>
                  <FormControl><MultiSelect options={areasOfInterestOptions} selected={field.value||[]} onChange={field.onChange} placeholder="Select areas of interest" /></FormControl>
                  <FormDescription>Select specific areas where you'd like to focus your mentoring</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <Separator className="my-4" />
            </MentorFieldset>
          </motion.div>
        );
      case 5:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="step-5" className="space-y-6">
            <MentorFieldset legend="Additional Info" description="Share any testimonials and agree to terms">
              <FormField control={control} name="testimonials" render={({ field })=>(
                <FormItem>
                  <FormLabel>Testimonials (Optional)</FormLabel>
                  <FormControl><Textarea placeholder="Share testimonials or references" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="termsAgreed" render={({ field })=>(
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>I agree to the terms and conditions</FormLabel>
                    <FormDescription>By submitting, you agree to our <Button variant="link" className="h-auto p-0">Terms of Service</Button> and <Button variant="link" className="h-auto p-0">Privacy Policy</Button>.</FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />
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
        <FormStepIndicator steps={steps} currentStep={currentStep} handleStepClick={s => { if (s < currentStep) setCurrentStep(s); }} />
        {renderStepContent()}
        <div className="flex justify-between mt-8 pt-4 border-t">
          {currentStep > 0 ? (
            <Button type="button" variant="outline" onClick={handleBack} className="w-24">Previous</Button>
          ) : (
            <div className="w-24" />
          )}
          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={handleNext} className="w-24">Next</Button>
          ) : (
            <Button type="submit" disabled={isSubmitting || isSubmittingExternal} className="w-24">
              {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting</>) : 'Submit'}
            </Button>
          )}
        </div>
      </form>
    </FormRoot>
  );
};

export default MentorForm;
