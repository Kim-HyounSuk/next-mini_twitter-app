import { useRouter } from "next/router";

const Tweet = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Tweet({id})</h1>
    </div>
  );
};

export default Tweet;
