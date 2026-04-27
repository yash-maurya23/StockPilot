
'use client';

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import FooterLink from "@/components/forms/FooterLink";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signInWithEmail } from "@/lib/actions/auth.actions";


const SignIn = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur'
    });

    const onSubmit = async (data: SignInFormData) => {
        try {
            const result=await signInWithEmail(data);
            if(result.success)router.push('/');
           
        } catch (e) {
            console.error(e);
            toast.error('Sign in failed', {
                description: e instanceof Error ? e.message : 'Failed to sign in.'
            })
        }
    }

    return (
        <>
            <h1 className="form-title">Sign In</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    name="email"
                    label="Email"
                    placeholder="contact@example.com"
                    register={register}
                    error={errors.email}
                    validation={{ required: 'Email is required', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }}
                />

                <InputField
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ required: 'Password is required', minLength: 6 }}
                />

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="auth-button w-full"
                >
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                </Button>
            </form>

            <FooterLink 
                text="Don't have an account?" 
                linkText="Sign Up" 
                href="/sign-up" 
            />
        </>
    )
}

export default SignIn;
