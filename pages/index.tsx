import { useMutation } from "@lib/client";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";

interface UploadTweet {
  text: string;
}

const Home = () => {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<UploadTweet>();
  const [mutation, { loading, data: uploadData }] = useMutation("/api/tweets");
  const [toggleLike] = useMutation("/api/likes");
  const { data: getTweets, mutate } = useSWR("/api/tweets");

  const onValid: SubmitHandler<UploadTweet> = (data) => {
    if (loading) return;
    mutation(data);
    router.reload();
  };

  useEffect(() => {
    if (uploadData) {
      if (uploadData.isSuccess) {
        router.replace("/");
      } else {
        alert(uploadData.message);
      }
    }
  }, [uploadData]);

  const onLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = (e.target as HTMLButtonElement).id;
    mutate({ ...getTweets, [`${id}`]: !getTweets[`${id}`] }, false);
    toggleLike({ id: (e.target as HTMLButtonElement).id });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onValid)}>
        <input
          {...register("text", { required: "내용을 입력해주세요." })}
          type="text"
          placeholder="내용을 입력해주세요."
          required
        />
        <button>등록</button>
      </form>
      <div>
        {getTweets?.data.tweets.map((tweet: any) => (
          <div className="flex w-full ">
            <div className="flex">
              <div className="flex flex-col">
                <span className="text-sm">{tweet.user.name}</span>
                <span className="text-xs">{tweet.user.email}</span>
              </div>
            </div>
            <div>
              <span>{tweet.text}</span>
            </div>
            <button id={tweet.id} onClick={onLikeClick}>
              {tweet.likes.length || getTweets[tweet.id] ? "liked" : "like"}
            </button>
            <div>
              <span className="text-xs">{tweet.createdAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
