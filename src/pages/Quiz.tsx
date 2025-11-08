import { Header } from "@/components/Header";
import { SkinQuiz } from "@/components/SkinQuiz";

const Quiz = () => {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <SkinQuiz />
      </div>
    </div>
  );
};

export default Quiz;
