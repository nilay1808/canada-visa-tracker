import { Link } from "@remix-run/react";

export function Navbar() {
  return (
    <div className="flex items-center justify-center h-16 border-b mb-4">
      <Link to="/">
        <h1 className="text-2xl">🇨🇦 Canada Visa</h1>
      </Link>
    </div>
  );
}
