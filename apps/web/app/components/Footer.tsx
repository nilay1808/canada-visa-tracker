import { Link } from "@remix-run/react";

export function Footer() {
  return (
    <footer className="container flex items-center justify-center mt-auto">
      <div className="flex items-center text-sm font-light text-gray-600 dark:text-gray-400 mb-2 mt-4">
        Made with ❤️ by&nbsp;
        <Link className="font-medium" to="https://n18.dev">
          Nilay
        </Link>
      </div>
    </footer>
  );
}
