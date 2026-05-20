import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, Clock, BarChart3 } from "lucide-react";
import { getCurrentUser } from "@/services/AuthService";
import useAuth from "@/auth/store";
import { useState } from "react";
import type UserT from "@/models/User";
import toast from "react-hot-toast";

function Userhome() {
  const user = useAuth((state: any) => state.user);
  const [user1, setUser1] = useState<UserT | null>(null);

  // backend: GET /users/email/{emailId}
  const getUserData = async () => {
    try {
      const user1 = await getCurrentUser(user?.email);
      setUser1(user1);
      toast.success("you are able to access secured apis");
    } catch (error) {
      toast.error("error in getting data");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-4xl font-bold mb-8">
        My Learning Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          {
            title: "Courses Enrolled",
            value: "8",
            icon: <BookOpen className="w-8 h-8 text-primary" />,
          },
          {
            title: "Overall Progress",
            value: "64%",
            icon: <GraduationCap className="w-8 h-8 text-primary" />,
          },
          {
            title: "Study Hours",
            value: "126",
            icon: <Clock className="w-8 h-8 text-primary" />,
          },
        ].map((stat, i) => (
          <div key={i}>
            <Card className="bg-card/70 backdrop-blur-lg border-border rounded-2xl shadow-lg">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-muted rounded-xl">{stat.icon}</div>
                <div>
                  <p className="text-muted-foreground text-sm">{stat.title}</p>
                  <h3 className="text-2xl font-semibold">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div>
        <Card className="bg-card/70 backdrop-blur-lg border-border rounded-2xl shadow-lg mb-10">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" /> Recent Activity
            </h2>
            {/* backend: GET /users/{userId}/activity */}
            <ul className="space-y-3 text-muted-foreground">
              <li>• Completed Module 3 of "React Masterclass"</li>
              <li>• Submitted assignment for "Data Structures"</li>
              <li>• Joined live session — "System Design Basics"</li>
              <li>• Earned certificate for "JavaScript Fundamentals"</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button onClick={getUserData} className="rounded-2xl px-8 text-lg">
          View My Profile
        </Button>
        <p>{user1?.name}</p>
      </div>
    </div>
  );
}

export default Userhome;
