import { Link } from "@remix-run/react";
import { Switch } from "./ui/switch";

interface Props {
  checked?: boolean;
  onCheckedChange: () => void;
}

export function Navbar({ checked, onCheckedChange }: Props) {
  return (
    <div className="container flex items-center justify-between h-20 mb-12">
      <Link className="contents" to="/">
        <h1 className="text-4xl">🇨🇦</h1>
        <h1 className="text-3xl font-medium">Canada Visa</h1>
      </Link>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
