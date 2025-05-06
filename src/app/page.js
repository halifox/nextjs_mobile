'use client';
import {Button} from "antd";

export default function Home() {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
            <Button href={'/xhs'}>xhs</Button>
            <Button href={'/bilibili'}>bilibili</Button>
        </div>
    );
}
