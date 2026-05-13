import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { PageHeading } from "../../components/ui/PageHeading";

const Day1Client = () => {
  return (
    <section aria-label="Day 1 UI Components">
      <PageHeading className="mb-3">Day 1 - UI Components</PageHeading>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle as="h2">UI Components</CardTitle>
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
