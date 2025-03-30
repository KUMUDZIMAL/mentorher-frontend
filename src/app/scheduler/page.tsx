import Scheduler from "@/myComponents/scheduler/Scheduler";
import RecommendationsPage from "../recommendations/[userId]/page";

export default function SchedulerPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
   <Scheduler />
 <RecommendationsPage/>
    </div>
  );
}
