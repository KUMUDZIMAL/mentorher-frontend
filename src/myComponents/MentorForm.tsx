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

const steps = [
  "Personal Info",
  "Professional Background",
  "Experience",
  "Expertise & Skills",
  "Mentorship Details",
  "Additional Info",
];

export interface MentorFormProps {
  onSubmit: (data: any) => Promise<void>;
  isSSubmitting: boolean;
}

const MentorForm: React.FC<MentorFormProps> = ({ onSubmit, isSSubmitting }) => {
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

  // --- Availability Handlers ---
  const addAvailabilitySlot = () => {
    const newSlots = [
      ...availabilitySlots,
      { day: "", startTime: "", endTime: "" },
    ];
    setAvailabilitySlots(newSlots);
    setValue("availability", newSlots);
  };

  const removeAvailabilitySlot = (index: number) => {
    if (availabilitySlots.length > 1) {
      const newSlots = [...availabilitySlots];
      newSlots.splice(index, 1);
      setAvailabilitySlots(newSlots);
      const currentAvailability = getValues("availability") || [];
      const newAvailability = [...currentAvailability];
      newAvailability.splice(index, 1);
      setValue("availability", newAvailability);
    }
  };

  const updateAvailabilitySlot = (
    index: number,
    field: "day" | "startTime" | "endTime",
    value: string
  ) => {
    const newSlots = [...availabilitySlots];
    newSlots[index][field] = value;
    setAvailabilitySlots(newSlots);
    const currentAvailability = [...(getValues("availability") || [])];
    if (!currentAvailability[index]) {
      currentAvailability[index] = { day: "", startTime: "", endTime: "" };
    }
    currentAvailability[index][field] = value;
    setValue("availability", currentAvailability);
  };

  // --- Experience Handlers ---
  // (Assuming you have similar handlers for experienceSlots)

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      window.scrollTo(0, 0);
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    window.scrollTo(0, 0);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      window.scrollTo(0, 0);
      setCurrentStep(step);
    }
  };

  // Updated getFieldsForStep with explicit return type.
  const getFieldsForStep = (step: number): (keyof MentorFormValues)[] => {
    switch (step) {
      case 0:
        return ["fullName", "email", "phone", "profilePhoto"];
      case 1:
        return ["currentRole", "company", "yearsOfExperience", "education", "careerHistory"];
  
      case 2:
        return ["technicalSkills", "industrySpecialization", "softSkills"];
      case 3:
        return ["mentoringGoals", "mentoringStyle", "availability", "mentorshipExperience"];
      case 4:
        return ["linkedinUrl", "personalBio", "achievements", "languages", "areasOfInterest", "testimonials", "termsAgreed"];
      default:
        return [];
    }
  };

  const onFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit mentor data");
      }

      if (result.message) {
        console.log(result.message);
      }
      console.log("Submission successful:", result);
      onSubmit?.(data);
      router.push("/mentor-dashboard"); // Redirect after submission
    } catch (error: any) {
      console.error("Submission error:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            key="step-0"
            className="space-y-6"
          >
            <MentorFieldset legend="Personal Information" description="Tell us about yourself">
              <FormField
                control={control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
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
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
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
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your phone number" {...field} />
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
                    <FormLabel>Profile Photo</FormLabel>
                    <FormControl>
                      <ImageUpload value={field.value} onChange={(file) => field.onChange(file)} />
                    </FormControl>
                    <FormDescription>
                      Upload a professional photo to be displayed on your mentor profile
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </MentorFieldset>
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            key="step-1"
            className="space-y-6"
          >
            <MentorFieldset legend="Professional Background" description="Tell us about your professional experience">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="currentRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Role</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Software Engineer" {...field} />
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
                        <Input placeholder="e.g. Tech Solutions Inc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={control}
                name="yearsOfExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="Years of experience"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Educational Background</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g. BS Computer Science from Stanford University" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </MentorFieldset>
          </motion.div>
        );
      
        
         
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            key="step-3"
            className="space-y-6"
          >
            <MentorFieldset legend="Areas of Expertise & Skills" description="Share your technical and professional skills">
              <FormField
                control={control}
                name="technicalSkills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technical Skills</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={technicalSkillOptions}
                        selected={field.value || []}
                        onChange={field.onChange}
                        placeholder="Select technical skills"
                      />
                    </FormControl>
                    <FormDescription>
                      Select the technical skills you're proficient in
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="industrySpecialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry Specialization</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {industryOptions.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the industry where you have the most experience
                    </FormDescription>
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
                        options={softSkillOptions}
                        selected={field.value || []}
                        onChange={field.onChange}
                        placeholder="Select soft skills"
                      />
                    </FormControl>
                    <FormDescription>
                      Select the soft skills you excel in
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </MentorFieldset>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            key="step-4"
            className="space-y-6"
          >
            <MentorFieldset legend="Mentorship Specifics" description="Tell us about your mentoring style and availability">
              <FormField
                control={control}
                name="mentoringGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mentoring Goals</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe what you hope to achieve as a mentor" {...field} />
                    </FormControl>
                    <FormDescription>
                      Explain the impact you want to have as a mentor
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="mentoringStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mentoring Style</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mentoring style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="structured">
                          Structured (Regular sessions with defined goals)
                        </SelectItem>
                        <SelectItem value="informal">
                          Informal (Flexible availability for questions)
                        </SelectItem>
                        <SelectItem value="hybrid">
                          Hybrid (Mix of structured sessions and ad-hoc support)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the mentoring approach that best suits your style
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <FormLabel>Availability</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAvailabilitySlot}
                    className="h-8 gap-1"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    Add Time Slot
                  </Button>
                </div>
                <FormDescription className="mt-0">
                  Specify when you're available for mentoring sessions
                </FormDescription>
                <div className="space-y-3">
                  {availabilitySlots.map((slot, index) => (
                    <Card key={index} className="shadow-sm">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
                          <div className="md:col-span-3">
                            <Label htmlFor={`day-${index}`}>Day</Label>
                            <Select value={slot.day} onValueChange={(value) => updateAvailabilitySlot(index, "day", value)}>
                              <SelectTrigger id={`day-${index}`} className="w-full mt-1">
                                <SelectValue placeholder="Select day" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Monday">Monday</SelectItem>
                                <SelectItem value="Tuesday">Tuesday</SelectItem>
                                <SelectItem value="Wednesday">Wednesday</SelectItem>
                                <SelectItem value="Thursday">Thursday</SelectItem>
                                <SelectItem value="Friday">Friday</SelectItem>
                                <SelectItem value="Saturday">Saturday</SelectItem>
                                <SelectItem value="Sunday">Sunday</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`start-time-${index}`}>Start Time</Label>
                            <Input
                              id={`start-time-${index}`}
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => updateAvailabilitySlot(index, "startTime", e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`end-time-${index}`}>End Time</Label>
                            <Input
                              id={`end-time-${index}`}
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => updateAvailabilitySlot(index, "endTime", e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div className="md:col-span-1 flex items-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeAvailabilitySlot(index)}
                              disabled={availabilitySlots.length <= 1}
                              className="w-8 h-8 mt-1"
                            >
                              <MinusCircle className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {errors.availability && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.availability.message as string}
                  </p>
                )}
              </div>
              <FormField
                control={control}
                name="mentorshipExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Previous Mentorship Experience (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe any previous experience you have as a mentor" {...field} />
                    </FormControl>
                    <FormDescription>
                      Share details about any formal or informal mentoring you've done before
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </MentorFieldset>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            key="step-5"
            className="space-y-6"
          >
            <MentorFieldset legend="Online Presence & Additional Details" description="Share your online profiles and additional information">
              <FormField
                control={control}
                name="linkedinUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Profile URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
                    </FormControl>
                    <FormDescription>
                      Share your LinkedIn profile or portfolio
                    </FormDescription>
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
                      <Textarea placeholder="Write a short introduction about yourself" {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be displayed on your mentor profiletext-white
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="achievements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Achievements & Awards (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List any significant achievements or awards" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="languages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Languages Spoken</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={languageOptions}
                        selected={field.value || []}
                        onChange={field.onChange}
                        placeholder="Select languages"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="areasOfInterest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Areas of Interest for Mentoring (Optional)</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={areasOfInterestOptions}
                        selected={field.value || []}
                        onChange={field.onChange}
                        placeholder="Select areas of interest"
                      />
                    </FormControl>
                    <FormDescription>
                      Select specific areas where you'd like to focus your mentoring
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator className="my-4" />
              <FormField
                control={control}
                name="termsAgreed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I agree to the terms and conditions</FormLabel>
                      <FormDescription>
                        By submitting this form, you agree to our{" "}
                        <Button variant="link" className="h-auto p-0">
                          Terms of Service
                        </Button>{" "}
                        and{" "}
                        <Button variant="link" className="h-auto p-0">
                          Privacy Policy
                        </Button>
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
        <FormStepIndicator steps={steps} currentStep={currentStep} handleStepClick={handleStepClick} />
        {renderStepContent()}
        <div className="flex justify-between mt-8 pt-4 border-t">
          {currentStep > 0 ? (
            <Button type="button" variant="outline" onClick={handleBack} className="w-24">
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
            <Button type="submit" disabled={isSubmitting} className="w-24">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting
                </>
              ) : (
                "Submit"
              )}
            </Button>
          )}
        </div>
      </form>
    </FormRoot>
  );
};

export default MentorForm;
