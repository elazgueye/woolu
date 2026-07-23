import Image from "next/image";

type WooluLogoProps = {
  variant?: "full" | "icon";
  className?: string;
};

export default function WooluLogo({
  variant = "full",
  className = "",
}: WooluLogoProps) {
  if (variant === "icon") {
    return (
      <div
        className={`relative h-11 w-11 overflow-hidden ${className}`}
      >
        <Image
          src="/images/logo-woolu.png"
          alt="Wóolu"
          fill
          priority
          sizes="44px"
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative h-12 w-[145px] ${className}`}
    >
      <Image
        src="/images/logo-woolu.png"
        alt="Wóolu"
        fill
        priority
        sizes="145px"
        className="object-contain object-left"
      />
    </div>
  );
}