import React from "react";
import useSWR from "swr";

const Home = () => {
  const { data } = useSWR("/api/tweets");
  return <div></div>;
};

export default Home;
