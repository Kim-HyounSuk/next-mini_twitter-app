import { Input } from "@components/common";
import Button from "@components/common/Button";
import { useMutation } from "@lib/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface SignIn {
  email: string;
  password: string;
}

const SignIn = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignIn>();
  const [mutation, { loading, data }] = useMutation("/api/auth/sign-in");

  const onValid = (data: SignIn) => {
    if (loading) return;
    mutation(data);
  };

  useEffect(() => {
    if (data) {
      console.log(data);
      if (data.isSuccess) {
        router.push("/");
      } else {
        alert(data.message);
      }
    }
  }, [router, data]);

  return (
    <div>
      <h1>로그인</h1>
      <form onSubmit={handleSubmit(onValid)}>
        <Input
          label="이메일"
          register={register("email", { required: "이메일을 입력하세요." })}
          name="email"
          placeholder="Email"
          type="email"
          kind="text"
          error={errors.email}
        />
        <Input
          label="비밀번호"
          register={register("password", {
            required: "비밀번호를 입력하세요.",
          })}
          name="password"
          placeholder="Password"
          type="password"
          kind="text"
          error={errors.password}
        />
        <Button text={"로그인"} />
      </form>
      <div>
        <Link href={"/create-account"}>
          <span>가입이 필요하신가요?</span>
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
