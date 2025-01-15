// Email Signup Form
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";


export function EmailSignUp() {
    const [error, setError] = useState(null);
    const [email, setEmail] = useState(null);
    const [createPassword, setCreatePassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div>
            {error && (
                <Alert variant="destructive" className="my-3">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        { error }
                    </AlertDescription>
                </Alert>
            )}

            <form>
                <div>
                    <Label htmlFor="emailInput">
                        Email
                    </Label>
                    <Input 
                        id="emailInput"
                        type="email"
                        onChange={(e) => console.log(e.target.value.trim())}
                        required
                    />
                </div>
                <div className="mt-3">
                    <Label htmlFor="passOneInput">
                        Create Password
                    </Label>
                    <Input 
                        id="passOneInput"
                        type="password"
                        onChange={(e) => console.log(e.target.value.trim())}
                        required
                    />
                </div>
                <div className="mt-3">
                    <Label htmlFor="passTwoInput">
                        Confirm Password
                    </Label>
                    <Input 
                        id="passTwoInput"
                        type="password"
                        onChange={(e) => console.log(e.target.value.trim())}
                        required
                    />
                </div>
                <div className="mt-3">
                    <Button type="submit" className="w-full md:w-auto">
                        Continue
                    </Button>
                </div>
            </form>
        </div>
    );
}
