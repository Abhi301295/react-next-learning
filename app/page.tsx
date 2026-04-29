import Day1 from "./components/playgound/day1";
import Day2 from "./components/playgound/day2";
export default function Home() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Welcome</h2>
      <Day1></Day1>
      <Day2></Day2>
    </div>
  );
}