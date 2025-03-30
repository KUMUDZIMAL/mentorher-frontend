"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  menteeFormSchema,
  MenteeFormValues,
  defaultMenteeFormValues,
  currentStatusOptions,
  mentorshipAreaOptions,
  technicalSkillOptions,
  languageOptions,
} from "../lib/menteeValidation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ImageUpload from "./ImageUpload";
import MultiSelect from "./MultiSelect";
import { Separator } from "../components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import FormStepIndicator from "./FormStepIndicator";
import { useRouter } from "next/navigation";

interface StepItem {
  label: string;
  description: string;
}

interface MenteeFormProps {
  onSubmit: (data: MenteeFormValues) => Promise<void> | void;
  isSubmitting: boolean;
}

const MenteeForm = ({ onSubmit, isSubmitting }: MenteeFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const totalSteps = 4;
  const router = useRouter();

  const steps: StepItem[] = [
    { label: "Personal Info", description: "Basic details" },
    { label: "Background", description: "Career & education" },
    { label: "Mentorship", description: "Goals & preferences" },
    { label: "Additional", description: "Final details" },
  ];

  const form = useForm<MenteeFormValues>({
    resolver: zodResolver(menteeFormSchema),
    defaultValues: defaultMenteeFormValues,
    mode: "onChange",
  });

  const onImageUpload = (image: string) => {
    setProfileImage(image);
    form.setValue("profilePhoto", image);
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStepChange(currentStep + 1);
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentStep(currentStep - 1);
  };

  const handleSubmitForm = async (data: MenteeFormValues) => {
    await onSubmit(data);
    router.push("/mentee-dashboard");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          if (currentStep !== totalSteps - 1) {
            e.preventDefault();
            return false;
          }
          form.handleSubmit(handleSubmitForm)(e);
        }}
        className="space-y-6"
      >
        <div className="mb-8">
          <FormStepIndicator
            steps={steps.map((step) => step.label)}
            currentStep={currentStep}
            handleStepClick={handleStepChange}
          />
        </div>

        {/* Step 1: Personal Information */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profilePhoto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Photo</FormLabel>
                  <FormControl>
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="w-32 h-32 border-2 border-primary/20">
                        <AvatarImage src={profileImage || ""} />
                        <AvatarFallback className="text-3xl font-light">
                          {form.watch("fullName")
                            ? form.watch("fullName").charAt(0).toUpperCase()
                            : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <ImageUpload
                        value={profileImage || ""}
                        onChange={onImageUpload}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Step 2: Background & Goals */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="currentStatus"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Current Status</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {currentStatusOptions.map((option) => (
                        <FormItem
                          key={option.value}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={option.value} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {option.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Education</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="BS Computer Science, Stanford University"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your highest level of education and institution
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fieldOfStudy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field of Study (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Computer Science, Business, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="careerGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Career Goals</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What are your short and long-term career goals?"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Step 3: Mentorship Preferences */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="technicalBackground"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technical Background</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your technical experience and background"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="technicalSkills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technical Skills (Optional)</FormLabel>
                  <FormControl>
                    <MultiSelect
                      placeholder="Select your skills"
                      options={technicalSkillOptions.map((skill) => skill)}
                      selected={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Select the technical skills you already have or are learning
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mentorshipGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mentorship Goals</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What do you hope to gain from mentorship?"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredMentorshipAreas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Mentorship Areas</FormLabel>
                  <FormControl>
                    <MultiSelect
                      placeholder="Select areas you need guidance in"
                      options={mentorshipAreaOptions.map((area) => area)}
                      selected={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Collapsible className="border rounded-lg p-4">
              <CollapsibleTrigger className="flex w-full justify-between items-center">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary/70" />
                  <span className="font-medium">Your Availability</span>
                </div>
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="text-muted-foreground mb-4 text-sm">
                  Please add your availability for mentorship sessions. This helps mentors find suitable time slots.
                </div>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-center text-muted-foreground">
                      Availability scheduling will be implemented soon
                    </p>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}

        {/* Step 4: Additional Information */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personalBio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell mentors a bit about yourself, your background, and what drives you"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="challenges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Challenges (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe any specific challenges you're facing in your career or learning journey"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Languages</FormLabel>
                  <FormControl>
                    <MultiSelect
                      placeholder="Select languages you speak"
                      options={languageOptions.map((language) => language)}
                      selected={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="my-6" />

            <FormField
              control={form.control}
              name="termsAgreed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Terms and Conditions</FormLabel>
                    <FormDescription>
                      By checking this box, you agree to our Terms of Service and Privacy Policy for the mentorship program.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex justify-between pt-6">
          {currentStep > 0 ? (
            <Button type="button" variant="outline" onClick={handlePrevious} disabled={isSubmitting}>
              Previous
            </Button>
          ) : (
            <div></div>
          )}

          {currentStep < totalSteps - 1 ? (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default MenteeForm;
