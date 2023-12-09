import { Outlet } from "@remix-run/react";
import { Breadcrumbs } from "../components/Breadcrumbs";

export default function VisaLayout() {
  return (
    <>
      <Breadcrumbs />
      <Outlet />
    </>
  );
}
