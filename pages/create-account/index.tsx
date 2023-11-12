import { Input, Button } from "@components/common";
import { useMutation } from "@lib/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface SignUp {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

const SignUp = () => {
  const router = useRouter();
  const [mutation, { loading, data }] = useMutation("/api/auth/sign-up");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUp>();

  const onValid = (data: SignUp) => {
    if (loading) return;
    mutation(data);
  };

  useEffect(() => {
    if (data) {
      if (data.isSuccess) {
        router.push("/log-in");
      } else {
        alert(data.message);
      }
    }
  }, [router, data]);

  const watchPassword = watch("password");
  const validateConfirmPassword = () =>
    watchPassword === watch("confirmPassword");

  return (
    <div>
      <h1>신규 가입</h1>
      <div>
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
            label="이름"
            register={register("name", { required: "이름을 입력하세요." })}
            name="name"
            placeholder="name"
            type="text"
            kind="text"
            error={errors.name}
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
          <Input
            label="비밀번호 확인"
            register={register("confirmPassword", {
              required: "비밀번호를 확인해주세요.",
              validate: () =>
                validateConfirmPassword()
                  ? true
                  : "비밀번호가 일치하지 않습니다.",
            })}
            name="confirmPassword"
            placeholder="Confirm Password"
            type="password"
            kind="text"
            error={errors.confirmPassword}
          />
          <Button text={"가입하기"} />
        </form>
        <div>
          <Link href={"/log-in"}>
            <span>이미 계정이 있으신가요?</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
