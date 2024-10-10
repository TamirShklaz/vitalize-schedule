import {cn} from "@/lib/utils";

type Props = { className?: string };

function Page({className}: Props) {
    return (
        <div className={cn(className)}>
            <h1 className={"text-2xl"}>Vitalise</h1>
        </div>
    );
}

export default Page;
