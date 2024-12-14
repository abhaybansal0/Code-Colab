'use client'
import Navbarmeet from "./[slug]/_comps/Navbarmeet";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CodemeetLayout({ children }) {
  return (
      <>
        {/* <Navbarmeet /> */}
        {children}
      </>
  );
}
