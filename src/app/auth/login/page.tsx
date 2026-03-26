"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "./server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Topbar from "@/components/layouts/Topbar";
import toast from "react-hot-toast";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const router = useRouter();

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);

		try {
			const formData = new FormData();
			formData.append("email", email);
			formData.append("password", password);

			const result = await login(formData);

			if (result?.error) {
				toast.error(result.error);
				return;
			}

			toast.success("Login successful! Welcome back.");
			router.replace("/dashboard");
		} catch {
			toast.error("Something went wrong while signing in");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-bg-main text-text-primary transition-colors duration-300">
			<Topbar />

			<main className="flex items-center justify-center px-4 py-12">
				<div className="w-full max-w-md p-8 rounded-2xl border shadow-xl bg-surface border-border-muted transition-colors duration-300">
					<div className="mb-8 text-center">
						<h2 className="text-3xl font-bold text-text-primary">
							Welcome Back 👋
						</h2>
						<p className="mt-2 text-sm text-text-secondary">
							Continue your journaling journey
						</p>
					</div>

					<form onSubmit={handleLogin} className="space-y-5">
						<div className="space-y-2">
							<label className="text-sm font-medium text-text-secondary ml-1">Email</label>
							<input
								type="email"
								placeholder="johndoe@gmail.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="
									w-full px-4 py-3 rounded-xl border outline-none transition-all
									bg-bg-main border-border-muted text-text-primary placeholder-text-secondary/50
									focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20
								"
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-text-secondary ml-1">Password</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									placeholder="Enter your secret password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									className="
										w-full px-4 py-3 pr-12 rounded-xl border outline-none transition-all
										bg-bg-main border-border-muted text-text-primary placeholder-text-secondary/50
										focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20
									"
								/>

								<button
									type="button"
									onClick={() => setShowPassword((prev) => !prev)}
									className="
										absolute right-3 top-1/2 -translate-y-1/2
										text-text-secondary hover:text-text-primary
										transition-colors
									"
								>
									{showPassword ? (
										<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-5-10-7s4.477-7 10-7c1.284 0 2.509.27 3.625.763M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
										</svg>
									) : (
										<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
										</svg>
									)}
								</button>
							</div>
						</div>

						<Button
							type="submit"
							disabled={loading}
							className="
								w-full h-12 rounded-xl bg-brand-purple hover:bg-brand-purple/90 
								text-white font-semibold shadow-lg shadow-brand-purple/25 
								transition-all active:scale-95 disabled:opacity-50 cursor-pointer font-bold
							"
						>
							{loading ? "Signing in..." : "Login"}
						</Button>
					</form>

					<p className="mt-6 text-center text-sm text-text-secondary">
						Don’t have an account?{" "}
						<Link
							href="/auth/register"
							className="text-brand-purple font-semibold hover:underline"
						>
							Sign Up
						</Link>
					</p>
				</div>
			</main>
		</div>
	);
}
