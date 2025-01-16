// Account Recover/Password Reset Form
"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";



export function RecoverForm() {
    const [createPassword, setCreatePassword] = useState(null);
    const [repeatPassword, setRepeatPassword] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handlePasswordReset = async (e) => {
        e.preventDefault();
    }

    return (
        <div>
            {/* Rendering Success Messages */}
            {successMessage && (
                <Alert variant="success" className="my-3">
                <AlertCircle className="h-4 w-4" color="#2ecc71" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
            )}

            {/* Rendering Error Messages */}
            {error && (
                <Alert variant="destructive" className="my-3">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handlePasswordReset}>
                <div className="mt-2">
                    <Label htmlFor="passwordOne">
                        Create Password
                    </Label>
                    <Input 
                        id="passwordOne"
                        type="password"
                        onChange={(e) => setCreatePassword(e.target.value.trim())}
                        required
                    />
                </div>
                <div className="mt-2">
                    <Label htmlFor="passwordTwo">
                        Repeat Password
                    </Label>
                    <Input 
                        id="passwordTwo"
                        type="password"
                        onChange={(e) => setRepeatPassword(e.target.value.trim())}
                        required
                    />
                </div>
                <div className="mt-3">
                    {isLoading ? (
                        <Button className="w-full" disabled>
                        <Loader2 className="animate-spin" />
                        Loading..
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full">
                            Submit
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}
