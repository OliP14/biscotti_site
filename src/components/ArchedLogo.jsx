import { useId } from "react";

export default function ArchedLogo({
  width = "100%",
  color = "#3f5140",
  showEst = false,
}) {
  const uniqueId = useId();
  const pathId = `cadagnolo-arch-${uniqueId.replace(/:/g, "")}`;

  return (
    <svg
      viewBox="0 0 600 250"
      width={width}
      role="img"
      aria-label="Cadagnolo's Kitchen"
      preserveAspectRatio="xMidYMid meet"
      style={{
        display: "block",
        width: "100%",
        height: "auto",
        overflow: "visible",
      }}
    >
      <defs>
        {/* Wider path prevents first/last letters from being cut off */}
        <path
          id={pathId}
          d="M 25 150 Q 300 -15 575 150"
          fill="none"
        />
      </defs>

      {/* Arched CADAGNOLO'S */}
      <text
        fill={color}
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize="58"
        fontWeight="500"
        letterSpacing="7"
      >
        <textPath
          href={`#${pathId}`}
          startOffset="50%"
          textAnchor="middle"
        >
          CADAGNOLO'S
        </textPath>
      </text>

      {/* Straight KITCHEN */}
      <text
        x="300"
        y="195"
        textAnchor="middle"
        fill={color}
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize="46"
        fontWeight="500"
        letterSpacing="8"
      >
        KITCHEN
      </text>

      {/* Optional EST 2025 */}
      {showEst && (
        <text
          x="300"
          y="230"
          textAnchor="middle"
          fill={color}
          fontFamily="Georgia, serif"
          fontSize="14"
          letterSpacing="4"
        >
          EST 2025
        </text>
      )}
    </svg>
  );
}