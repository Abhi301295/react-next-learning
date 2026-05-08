import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";

const Day1Client = () => {
  return (
    <section aria-label="Day 1 UI Components">
      <h1 className="mb-3 text-display-sm font-semibold text-brand-600">
        Day 1 - UI Components
      </h1>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>UI Components</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <p>
            You now have a reusable <span className="font-medium">Button</span> and{" "}
            <span className="font-medium">Card</span>.
          </p>

          <Button>Click Me</Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default Day1Client;
