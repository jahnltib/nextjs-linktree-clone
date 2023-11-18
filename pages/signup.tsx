import supabase from "@/utils/supabaseClient";
import { useState } from "react";                
export default function Signup() {
    const [email, setEmail] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();
    const [username, setUsername] = useState<string | undefined>();

    async function signUpWithEmail() {
        try {
            if (email && password) {
                const resp = await supabase.auth.signUp({
                    email: email,
                    password: password,
                });
                if (resp.error) throw resp.error;
                const userId = resp.data.user?.id;
                if (userId) {
                await createUser(userId);
                console.log("userId: ", userId);
                }
            }
        } catch (error) {
            console.log("error: ", error);
        }
    }

    async function createUser(userId: string) {
        try {
            const {error} = await supabase
                .from("users")
                .insert({ id: userId, username: username });
            if (error) throw error;
        } catch (error) {
            console.log("error: ", error);
        }
    }

    return (
        <div className="flex flex-col w-full justify-center items-center">

            <label 
                htmlFor="email" 
                className="block text-sm text-gray-500 dark:text-gray-300"
            >
                Email Address
            </label>
            <div className="relative flex items-center mt-2">
                <span className="absolute">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" 
                        className="w-6 h-6 mx-3 text-gray-400 dark:text-gray-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
                    </svg>
                </span>

                <input 
                    type="email" 
                    name="email"
                    id="email"
                    placeholder="john@example.com" 
                    className="block w-full py-2.5 text-gray-700 placeholder-gray-400/70 bg-white border border-gray-200 rounded-lg pl-11 pr-5 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="flex items-center justify-between">
                <label 
                    htmlFor="password" 
                    className="block text-sm text-gray-500 dark:text-gray-300 mt-4"
                >
                    Password
                </label>
            </div>
            <div className="relative flex items-center mt-2">
                <button 
                    className="absolute right-0 focus:outline-none rtl:left-0 rtl:right-auto">
                </button>

                <input 
                    type="password"
                    name="password"
                    id="password"
                    className="block w-full py-2.5 text-gray-700 placeholder-gray-400/70 bg-white border border-gray-200 rounded-lg pl-5 pr-11 rtl:pr-5 rtl:pl-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="********" 
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div className="flex items-center justify-between">
                <label 
                    htmlFor="username" 
                    className="block text-sm text-gray-500 dark:text-gray-300 mt-4"
                >
                    Username
                </label>
            </div>
            
            <div className="relative flex items-center mt-2">
                <button 
                    className="absolute right-0 focus:outline-none rtl:left-0 rtl:right-auto">
                </button>

                <input 
                    type="text" 
                    name="username"
                    id="username"
                    className="block w-full py-2.5 text-gray-700 placeholder-gray-400/70 bg-white border border-gray-200 rounded-lg pl-5 pr-11 rtl:pr-5 rtl:pl-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="username" 
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div className="relative flex items-center mt-2">
                <button
                    type="button" 
                    className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform custom-color1 rounded-lg hover:custom-color1 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 mt-4"
                    onClick={signUpWithEmail}
                >
                    Sign Up
                </button>
            </div>

        </div>
    );
}
