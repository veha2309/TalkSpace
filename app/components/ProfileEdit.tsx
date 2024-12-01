'use client'


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import Input from "@/app/components/Input";

import { CldUploadButton } from 'next-cloudinary';

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";


import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingModal from "@/app/components/LoadingModal";
import ImageUplaod from "./ImageUpload";


interface ProfileEditProps {
    isOpen?: boolean
    onClose: () => void
    currentUser: User
}

interface UploadResult {
    info: {
        secure_url: string
    }
}
const ProfileEdit: React.FC<ProfileEditProps> = ({
    isOpen,
    onClose,
    currentUser,
}) => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isValid, setIsValid] = useState(false);


    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: currentUser?.name,
            image: currentUser?.image,
        }
    });


    const [currentPassword, setCurrentPassword] = useState("");

    const onCancel = () => {
        setCurrentPassword("");
        setIsValid(false);
        setIsLoading(false);
        reset({ password: "" });
        onClose();
    }

    const handleUpload = (result: UploadResult) => {
        setValue('image', result?.info?.secure_url, {
            shouldValidate: true
        })
    }

    const handleValidation = () => {
        setIsLoading(true);
        axios
            .post("/api/settings/validate", { currentPassword })
            .then((response) => {
                if (response.data) {
                    toast.success("Password is correct");
                    setCurrentPassword("")
                    setIsValid(true);
                } else {
                    toast.error("Password is incorrect");
                    setIsValid(false);
                }
            })
            .catch((error) => {
                toast.error(error?.response?.data?.error || "Something went wrong");
                setIsValid(false);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const passwordSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        axios
            .post("/api/settings/password", data)
            .then(() => {
                toast.success("Password Successfully changed");
                reset({ password: "" });
            })
            .catch((error) => {
                toast.error(error?.response?.data?.error || "Something went wrong!");
                reset();
            })
            .finally(() => setIsLoading(false))
    }

    const nameSubmit: SubmitHandler<FieldValues> = (data) => {
        axios
            .post("/api/settings/name", data)
            .then(() => {
                toast.success("Name Successfully changed");
            })
            .catch((error) => {
                toast.error(error?.response?.data?.error || "Something went wrong!");
                reset();
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <>
   
            {isLoading && <LoadingModal />}
            <Dialog open={isOpen}>
                <DialogContent>
                    <DialogTitle>
                        Edit Your Profile
                    </DialogTitle>
                    <Tabs defaultValue="account" className="w-[400px]" >
                        <TabsList>
                            <TabsTrigger value="account">Account</TabsTrigger>
                            <TabsTrigger value="password">Password</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account" className="scale-90">
                            <form onSubmit={handleSubmit(nameSubmit)} className="space-y-6">
                                <Input register={register} id="name" disabled={isLoading} label="Name" placeholder="Change your Name...." />
                                <Button variant="secondary" className="bg-neutral-200" disabled={isLoading}>
                                    Change Name
                                </Button>
                            </form>
                        </TabsContent>
                        <TabsContent value="password" >
                            <form onSubmit={handleSubmit(passwordSubmit)} className="space-y-7 scale-90">
                                <Input onChange={(e) => setCurrentPassword(e.target.value)} id="curent_password" disabled={isLoading} label="Current Password" placeholder="Enter your Current Password...." />
                                <Button variant="secondary" className="bg-neutral-200" disabled={isValid || isLoading ? true : false} onClick={handleValidation}>Validate</Button>
                                <Input register={register} id="password" disabled={isLoading || !isValid ? true : false} label="New Password" placeholder="Enter your New Password...." className={isValid ? "cursor-text" : "cursor-not-allowed"} />
                                <Button variant="secondary" className="bg-neutral-200" disabled={isLoading || !isValid ? true : false}>
                                    Change Password
                                </Button>
                            </form>
                        </TabsContent>
                        <div className="w-full mx-auto mt-16 flex justify-end gap-5">
                            <Button variant="default" type="submit" onClick={()=> {
                                onCancel();
                                toast.success("Changes saved Successfully!")
                            }}>
                                Save Changes
                            </Button>
                            <DialogClose asChild>
                                <Button variant="destructive" onClick={onCancel}>Cancel</Button>
                            </DialogClose>
                        </div>
                    </Tabs>

                </DialogContent>
            </Dialog>
        </>
    );
}

export default ProfileEdit;