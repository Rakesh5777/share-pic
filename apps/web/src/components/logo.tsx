import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="inline-block my-4">
      <svg
        width="200"
        height="50"
        viewBox="0 0 200 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform hover:scale-105 transition-transform duration-200"
      >
        <text
          x="0"
          y="40"
          fontFamily="Arial, sans-serif"
          fontSize="40"
          fontWeight="bold"
          fontStyle="italic"
          letterSpacing="-0.05em"
        >
          <tspan fill="#1F2937">Snap</tspan>
          <tspan fill="#2563EB">Linkr</tspan>
        </text>
        <path
          d="M185 10 L190 5 L195 10"
          stroke="#2563EB"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M190 5 L190 15"
          stroke="#2563EB"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </Link>
  );
}
