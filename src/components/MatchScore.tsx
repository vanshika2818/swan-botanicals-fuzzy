import { Progress } from "./ui/progress";

interface MatchScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const MatchScore = ({ score, size = "md", showLabel = true }: MatchScoreProps) => {
  const percentage = Math.round(score * 100);
  
  const getColor = (score: number) => {
    if (score >= 0.8) return "text-primary";
    if (score >= 0.6) return "text-accent-foreground";
    return "text-muted-foreground";
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs h-1.5";
      case "lg":
        return "text-lg h-3";
      default:
        return "text-sm h-2";
    }
  };

  return (
    <div className="space-y-1.5">
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Match Confidence</span>
          <span className={`font-semibold ${getSizeClasses()} ${getColor(score)}`}>
            {percentage}%
          </span>
        </div>
      )}
      <Progress value={percentage} className={getSizeClasses()} />
    </div>
  );
};
