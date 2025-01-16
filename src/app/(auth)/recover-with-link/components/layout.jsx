// Layout for Recover Password Page
import { HeadingTwo } from "@/components/typography/headings";
import { Separator } from "@/components/ui/separator";
import { RecoverForm } from "./recoverForm";



export function RecoverPasswordLayout() {
    return (
        <main className="h-screen">
            <div className="container h-[100%] mx-auto flex flex-col items-center justify-center">
                {/* Centered Content */}
                <div className="w-[80%] sm:w-[50%] md:w-[40%] lg:w-[30%] xl:w-[30%] text-center">
                    <HeadingTwo text="Recover Account" />
                    <Separator />

                    <p className="text-justify mt-3">
                        To regain access to your account, please create a new password below. Once updated, you'll be able to log in with your new credentials.
                    </p>

                    <div className="my-4 text-left">
                        <RecoverForm />
                    </div>
                </div>
            </div>
        </main>
    );
}
