import { Routes, Route, Navigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TransactionPage from "./pages/TransactionPage";
import NotFound from "./pages/NotFound";
import Header from "./components/ui/Header";

import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query";
import { Toaster } from "./../node_modules/react-hot-toast/src/components/toaster";

function App() {
  const { loading, data } = useQuery(GET_AUTHENTICATED_USER);
  if (loading) return null;
  return (
    <>
      <Toaster />
      {data?.authUser && <Header />}
      <Routes>
        <Route
          path="/"
          element={data?.authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!data?.authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!data?.authUser ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/transaction/:id"
          element={
            data?.authUser ? <TransactionPage /> : <Navigate to="/login" />
          }
        />
        <Route path="*" element={<NotFound />} />{" "}
      </Routes>
    </>
  );
}

export default App;
