import FreeShelf from "../components/FreeShelf";
import Manifesto from "../components/Manifesto";
import StoryExperience from "../components/StoryExperience";

export default function Home() {
  return (
    <div id="top">
      <StoryExperience />
      <FreeShelf />
      <Manifesto />
    </div>
  );
}
