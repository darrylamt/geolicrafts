/**
 * KenteDivider — a decorative kente cloth stripe used between sections.
 * Inspired by the traditional Kente weaving of the Ashanti people of Ghana.
 */
export default function KenteDivider({ height = 10, className = '' }) {
  return (
    <div
      className={`w-full ${className}`}
      style={{
        height: `${height}px`,
        background: `repeating-linear-gradient(
          90deg,
          #000000 0px, #000000 3px,
          #F5A200 3px, #F5A200 16px,
          #006B3F 16px, #006B3F 28px,
          #CE1126 28px, #CE1126 31px,
          #F5A200 31px, #F5A200 44px,
          #000000 44px, #000000 47px,
          #006B3F 47px, #006B3F 56px,
          #F5A200 56px, #F5A200 68px,
          #CE1126 68px, #CE1126 71px,
          #F5A200 71px, #F5A200 80px
        )`,
      }}
      aria-hidden="true"
    />
  )
}
