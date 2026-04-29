import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'

const Day1 = () => {
  return (
    <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>UI Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>
            You now have a reusable <span className="font-medium">Button</span>{" "}
            and <span className="font-medium">Card</span>.
          </p>
          <div className="test-flex">
            Test Autoprefixer
          </div>
          <Button>Click Me</Button>
        </CardContent>
      </Card>
  )
}

export default Day1;