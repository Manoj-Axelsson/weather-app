import Image from "next/image";

export default function Logo({ className }: { className?: string }) {
    return (
        <img
            src="/logo_alpha.png"
            alt="Logo"
            className={className}
        />
    );
}

