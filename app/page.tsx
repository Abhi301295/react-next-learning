import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Welcome</h2>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Day 1: UI Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>
            You now have a reusable <span className="font-medium">Button</span>{" "}
            and <span className="font-medium">Card</span>.
          </p>
          <Button>Click Me</Button>
        </CardContent>
      </Card>
    </div>
  );
}