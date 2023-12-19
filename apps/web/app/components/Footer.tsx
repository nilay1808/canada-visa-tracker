import { Link } from "@remix-run/react";

export function Footer() {
  return (
    <footer className="container flex items-center justify-center mt-auto">
      <div className="flex items-center text-xs font-light text-gray-400 dark:text-gray-600 mb-4 mt-8">
        Made by&nbsp;
        <Link className="font-normal" to="https://n18.dev">
          Nilay Sadavarte
        </Link>
      </div>
    </footer>
  );
}
