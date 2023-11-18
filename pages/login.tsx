import { useRouter } from "next/router";
import { useState } from "react";     
import supabase from "@/utils/supabaseClient";

export default function Login() {
    const [email, setEmail] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();
    const router = useRouter();

    async function signInWithEmail() {
        try {
            if (email && password) {
                const resp = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                });
                if (resp.error) throw resp.error;
                const userId = resp.data.user?.id;
                console.log("userId: ", userId);
                router.push("/username");
            }
        } catch (error) {
            console.log("error: ", error);
        }
    }
    return (
        <div className="flex flex-col w-full justify-center items-center">
            <label 
                htmlFor="email" 
                className="mt-8 block text-sm text-gray-500 dark:text-gray-300"
            >
                Email Address
            </label>

            <div className="relative flex items-center mt-2">
                <span className="absolute">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
                        className="w-6 h-6 mx-3 text-gray-400 dark:text-gray-500">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
                    </svg>
                </span>

                <input 
                    type="email" 
                    placeholder="john@example.com" 
                    className="block w-full py-2.5 text-gray-700 placeholder-gray-400/70 bg-white border border-gray-200 rounded-lg pl-11 pr-5 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="flex items-center justify-between">
                <label htmlFor="password" 
                    className="block text-sm text-gray-500 dark:text-gray-300 mt-4"
                    >
                    Password
                </label>
            </div>

            <div className="relative flex items-center mt-2">
                <button className="absolute right-0 focus:outline-none rtl:left-0 rtl:right-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                        className="w-6 h-6 mx-4 text-gray-400 transition-colors duration-300 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
                        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                        <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clip-rule="evenodd"/>
                    </svg>
                </button>

                <input 
                    type="password" 
                    placeholder="********" 
                    className="block w-full py-2.5 text-gray-700 placeholder-gray-400/70 bg-white border border-gray-200 rounded-lg pl-5 pr-11 rtl:pr-5 rtl:pl-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    onChange={(e) => setPassword(e.target.value)}
                    />
            </div>

            <div className="relative flex items-center mt-2">
                <button
                    type="button" 
                    className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform custom-color1 rounded-lg hover:custom-color1 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 mt-4"
                    onClick={signInWithEmail}
                >
                    Login
                </button>
            </div>

        </div>
    )
}