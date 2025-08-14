import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Adicione esta linha para depuração
    console.log({ session, status });

    if (status === "loading") {
        return <p>Carregando...</p>;
    }

    return;
}