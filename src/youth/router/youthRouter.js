import { Suspense, lazy } from "react";
import { Navigate } from "react-router";

const Loading = <div>Loading....</div>;
const Finance = lazy(() => import("../finance/FinancePage"));
const PolicyDetail = lazy(() => import("../finance/PolicyDetail"));

const youthRouter = () => {
  return [
    // {
    //   path: "",
    //   element: <Navigate replace to="Job" />,
    // },
    { 
      path: "finance",
      element: (
        <Suspense fallback={Loading}>
          <Finance />
        </Suspense>
      ),
    },
    {
      path: "finance/:id",
      element: (
        <Suspense fallback={Loading}>
          <PolicyDetail />
        </Suspense>
      ),
    },
  ];
};

export default youthRouter;