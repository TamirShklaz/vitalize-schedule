import {cn} from "@/lib/utils";
import UserForm from "@/app/vitalize/_components/user-form";

type Props = { className?: string };

function Page({className}: Props) {
    return (
        <div className={cn(className)}>
            <UserForm/>
        </div>
    );
}

export default Page;
