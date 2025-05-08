import * as z from "zod";

export const signInSchema = z
                            .object({
                                identifier:z
                                        .string()
                                        .min(1,{message:"Email is require"})
                                        .email({message:"Please enter a valid email"}),
                                password:z
                                        .string()
                                        .min(1,{message:"Password is require"})
                                        .min(8,{message:"Password must be at last 8 characters."})

                            })