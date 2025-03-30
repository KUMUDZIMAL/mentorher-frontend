"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Navbar from "../Navbar"
import Footer from "../Footer"

interface MentorCardProps {
  name: string
  role: string
  company: string
  expertise: string[]
  isAvailable: boolean
  rating: number
  imageUrl: string
  calendarLink: string
  delay?: number
}

function MentorCard(props: MentorCardProps) {
  return (
    <div className="border border-white/30 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/25 backdrop-blur-xl hover:bg-white/35 hover:scale-[1.03] group">
      <div className="w-full h-56 relative mb-5 rounded-lg overflow-hidden shadow-inner">
        <Image
          src={props.imageUrl || "/mentors/default.jpg"}
          alt={props.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <h3 className="text-xl font-semibold text-center">{props.name}</h3>
      <p className="text-center text-sm mt-1">
        {props.role} @ {props.company}
      </p>
      <div className="my-3 p-2 rounded-lg bg-white/30 backdrop-blur-md">
        <p className="text-center text-xs text-gray-700">Expertise: {props.expertise.join(", ")}</p>
      </div>
      <div className="flex justify-between items-center mb-4 px-2">
        <p
          className={`${props.isAvailable ? "text-green-600 bg-green-100/70" : "text-red-500 bg-red-100/70"} px-3 py-1 rounded-full text-sm backdrop-blur-sm`}
        >
          {props.isAvailable ? "Available" : "Not Available"}
        </p>
        <p className="text-yellow-600 bg-yellow-100/70 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
          ⭐ {props.rating}
        </p>
      </div>
      <a
        href={props.calendarLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center bg-purple-600/80 text-white py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm"
      >
        Schedule
      </a>
    </div>
  )
}

const mentors = [
  {
    name: "Sarah Johnson",
    role: "Senior Developer",
    company: "Google",
    expertise: ["React", "TypeScript", "Node.js"],
    isAvailable: true,
    rating: 4.8,
    imageUrl: "/mentors/sarah.png",
    calendarLink: "https://calendar.google.com/",
  },
  {
    name: "Emily Carter",
    role: "UX Designer",
    company: "Airbnb",
    expertise: ["Figma", "UI/UX", "Design Thinking"],
    isAvailable: true,
    rating: 4.9,
    imageUrl: "/mentors/emily.png",
    calendarLink: "https://calendar.google.com/",
  },
  {
    name: "Michael Lee",
    role: "Data Scientist",
    company: "Facebook",
    expertise: ["Python", "TensorFlow", "Machine Learning"],
    isAvailable: false,
    rating: 4.6,
    imageUrl: "/mentors/michael.png",
    calendarLink: "https://calendar.google.com/",
  },
  {
    name: "David Kim",
    role: "DevOps Engineer",
    company: "Amazon",
    expertise: ["AWS", "Docker", "Kubernetes"],
    isAvailable: true,
    rating: 4.7,
    imageUrl: "/mentors/david.png",
    calendarLink: "https://calendar.google.com/",
  },
  {
    name: "Sophia Brown",
    role: "Product Manager",
    company: "Netflix",
    expertise: ["Agile", "Product Strategy", "JIRA"],
    isAvailable: false,
    rating: 4.5,
    imageUrl: "/mentors/sophia.png",
    calendarLink: "https://calendar.google.com/",
  },
  {
    name: "James Wilson",
    role: "Cybersecurity Specialist",
    company: "IBM",
    expertise: ["Cybersecurity", "Network Security", "Penetration Testing"],
    isAvailable: true,
    rating: 4.8,
    imageUrl: "/mentors/james.png",
    calendarLink: "https://calendar.google.com/",
  },
]

export default function SchedulerPage() {
  return (
    <div className="scheduler-container min-h-screen relative overflow-hidden">
      {/* Animated background with more visible soft blurred circles */}
      <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200">
        <div className="absolute -top-40 -left-40 w-[70rem] h-[70rem] bg-purple-500/40 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-0 w-[60rem] h-[60rem] bg-pink-500/40 rounded-full blur-[120px] animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-[70rem] h-[70rem] bg-blue-500/40 rounded-full blur-[120px] animate-pulse-slow animation-delay-4000"></div>
        <div className="absolute top-2/3 right-1/4 w-[55rem] h-[55rem] bg-purple-400/35 rounded-full blur-[120px] animate-pulse-slow animation-delay-3000"></div>
        <div className="absolute top-1/4 left-1/3 w-[40rem] h-[40rem] bg-indigo-400/30 rounded-full blur-[100px] animate-pulse-slow animation-delay-1000"></div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-center">
              Connect with <span className="text-purple-600">Women in Tech</span>
            </h1>
            <p className="text-lg mb-8 text-gray-800 text-center max-w-2xl mx-auto">
              Personalized mentorship to accelerate your career growth. Find the perfect mentor to guide you through
              your tech journey.
            </p>
            <div className="flex justify-center">
              <Button className="bg-purple-600/90 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm px-6 py-6">
                Browse All Mentors <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mentors Grid Section */}
      <section className="relative px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">Our Featured Mentors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentors.map((mentor, index) => (
              <MentorCard key={index} {...mentor} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

