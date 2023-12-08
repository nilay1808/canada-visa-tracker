import { Link } from "@remix-run/react";

interface Path {
  name: string;
  url: string;
}

interface Props {
  path: Path[];
}

export function Breadcrumbs({ path }: Props) {
  return (
    <div className="breadcrumb">
      <ul className="flex">
        {path.map((p, i) => (
          <li className="flex items-center" key={i}>
            <Link to={p.url}>{p.name}</Link>

            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.10876 14L9.46582 1H10.8178L5.46074 14H4.10876Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
          </li>
        ))}
      </ul>
    </div>
  );
}
