'use client'
import Input from "@/app/components/Input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react"
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import axios from "axios"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation";
import AuthSocialButton from "./AuthSocialButton";
import { BsGoogle } from "react-icons/bs";
import LoadingModal from "@/app/components/LoadingModal";


type Variant = "LOGIN" | "REGISTER"

const AuthForm = () => {
    const { status } = useSession();
    const [isLoading, setLoading] = useState(false);
    const [variant, setVariant] = useState<Variant>("REGISTER");
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/home")
        }
    }, [status, router])

    const {
        register,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            name: '',
            password: ''
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setLoading(true);

        if (variant === 'REGISTER') {
            axios.post('/api/register', data)
                .then(() => {

                    toast.success('Registered Successfully!')
                    signIn('credentials', {
                        ...data,
                        redirect: false
                    })
                })
                .catch(() => toast.error('Something went wrong'))
                .finally(() => {
                    setLoading(false);
                    router.push("/home")
                })
        }
        if (variant === 'LOGIN') {
            signIn('credentials', {

                ...data,
                redirect: false
            })
                .then((callback) => {
                    if (callback?.error) {
                        console.log(callback.error)
                        toast.error('Invalid Credentials')
                    }
                    if (callback?.ok && !callback?.error) {
                        toast.success('Logged In!')
                        router.push("/home")

                    }
                })
                .finally(() => setLoading(false))
        }
    }

    const toggleVartiant = () => {
        setVariant(variant === "REGISTER" ? "LOGIN" : "REGISTER");
    };


    const socialAction = (action: string) => {
       
        setLoading(true);
        signIn(action, { redirect: false ,callbackUrl: '/home' })
            .then((callback) => {
                if (callback?.error) {
                    toast.error('Invalid Credentials');
                }
                if (!callback?.error && callback?.ok) {
                    toast.success('Logged In!');
                    router.push("/home");

                }
            })
    }
    return (
        <>
        {isLoading && <LoadingModal/>}
            <div className="h-full flex flex-col justify-between items-center w-full scale-90 px-10 pb-6 space-y-6">
                <div className="text-3xl font-bold">
                    {variant === "REGISTER" ? "Create An account" : "Welcome Back!"}
                </div>
                <div className="border-b-[1px] border-gray-500 w-3/4" />
                <p className="text-gray-500 text-center text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore consequuntur doloremque iste asperiores, repudiandae quidem dolor? Alias, quia! Minus voluptate quo rerum necessitatibus, iste sunt!
                </p>
                <form className="h-full w-full flex flex-col items-center justify-center gap-10" onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-2/3 mx-auto space-y-6 scale-90">
                        {variant === "REGISTER" && (
                            <Input register={register} required id="name" label="Name" placeholder="Enter Your Name here" errors={errors} disabled={isLoading} />
                        )}
                        <Input register={register} required id="email" label="Email" placeholder="Enter Your Email here" errors={errors} disabled={isLoading} />
                        <Input register={register} required id="password" label="Password" placeholder="Enter Your Password here" errors={errors} disabled={isLoading} />
                    </div>
                    <div className="flex gap-8 w-2/3 h-10">
                        <Button variant="default" className="w-full scale-110" disabled={isLoading}>
                            {variant === "REGISTER" ? "Create Account" : "LogIn"}
                        </Button>
                    </div>
                    <div className="h-full w-full flex items-center justify-center">
                        <div className="border-b-[1px] border-gray-500 w-full" />
                        <p className="text-gray-500 absolute bg-neutral-100">
                            Or Continue with
                        </p>
                    </div>
                    <AuthSocialButton
                        icon={BsGoogle}
                        onClick={() => socialAction('google')}
                    />
                    <div onClick={toggleVartiant} className="cursor-pointer text-blue-400">
                        {variant === "REGISTER" ? "Or login with an existing account" : "Or Create a new account"}
                    </div>
                </form>
            </div>
        </>
    );
}

export default AuthForm;