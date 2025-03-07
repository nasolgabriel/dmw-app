"use client";

import dynamic from "next/dynamic";

const AppRouter = dynamic(() => import("../app/AppRouter"), { ssr: false });

export default AppRouter;
