import github from "../assets/images/github.png";
import linkedin from "../assets/images/linkedin.png";

export default function Credits() {
  return (
    <div className="space-x-4">
      <a
        href="https://github.com/jonkermoo"
        target="_blank"
        rel="noopener noreffer"
      >
        <button className="border-2 rounded-lg w-9 h-9 cursor-pointer">
          <img
            src={github}
            alt="Git"
            className="w-full h-full object-contain"
          />
        </button>
      </a>
      <a
        href="https://www.linkedin.com/in/johnnyzhu0/"
        target="_blank"
        rel="noopener noreffer"
      >
        <button className="border-2 rounded-lg w-9 h-9 cursor-pointer">
          <img
            src={linkedin}
            alt="Git"
            className="w-full h-full object-contain"
          />
        </button>
      </a>
    </div>
  );
}
