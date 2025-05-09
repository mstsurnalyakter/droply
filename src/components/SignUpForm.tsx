
"usel client"
import React, { useState } from 'react'
import {useForm} from "react-hook-form";
import { useSignUp } from '@clerk/nextjs';
import {set, z} from "zod";

//zod custom schema
import { signUpSchema } from '@/schemas/signUpSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
 
const SignUpForm = () => {
    const router = useRouter();
    const [verifying,setVerifying] = useState(false);
    const {signUp,isLoaded,setActive} = useSignUp();
    const [isSubmitting,setIsSubmitting] = useState(false);
    const [authError,setAuthError] = useState<string | null>(null);
    const [verificationError,setVerificationError] = useState<string | null>(null);
    const [verficationCode,setVerficationCode] = useState("");


    const {
        register,
        handleSubmit,
        formState:{errors}
    } = useForm<z.infer<typeof signUpSchema>>({
        resolver:zodResolver(signUpSchema),
        defaultValues:{
            email:"",
            password:"",
            passwordConfirmation:""
        }
    })

    const onSubmit = async (data:z.inter<typeof signUpSchema>) =>{
        if (!isLoaded) return;
        setIsSubmitting(true);
        setAuthError(null);

        try {
          await  signUp.create({
                emailAddress:data.email,
                password:data.password
            })

            await signUp.prepareEmailAddressVerification({
                strategy:"email_code"
            })
            setVerifying(true);
        } catch (error:any) {
            console.error("Signup error:",error);
            setAuthError(
                error.errors?.[0].message || "An error occured during the signup. please try again"
            )
            
        }finally{
            setIsSubmitting(false);
        }

    }


    const handleVerficationSubmit = async (e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if (!isLoaded || !signUp) return;
        setIsSubmitting(true);
        setAuthError(null);

        try {
        const result =    await signUp.attemptEmailAddressVerification({
                code:verficationCode
            })
            console.log(result);
            if (result.status === "complete") {
                await setActive({session:result.createdSessionId});
                router.push("/dashboard")
            }else{
                console.error("verification incomplete",result);
                setVerificationError(
                    "Verification could not be complete"
                )

            }
        } catch (error:any) {
            console.log("Verification could not be complete:",error)
            setVerificationError( error.errors?.[0].message);
        }
    }


    if (verifying) {
        return (
            <h1>Hello</h1>
        )
    }

    return (
        <h1>signup form with email and other field</h1>
    )
  
}

export default SignUpForm