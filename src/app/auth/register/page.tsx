"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "./server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import toast from "react-hot-toast";
import Topbar from "@/components/layouts/Topbar";

export default function Register() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function handleRegister(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);

		try {
			const formData = new FormData();
			formData.append("name", name);
			formData.append("email", email);
			formData.append("password", password);

			const result = await register(formData);

			if (result?.error) {
				toast.error(result.error);
				return;
			}

			toast.success("Account created successfully! Please login.");
			router.push("/auth/login");
		} catch {
			toast.error("Failed to register. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-bg-main text-text-primary transition-colors duration-300">
			<Topbar />

			<main className="flex items-center justify-center px-4 py-12">
				<div
					className="
            w-full max-w-md p-8 rounded-2xl border shadow-xl
            bg-surface border-border-muted transition-colors duration-300
          "
				>
					<div className="mb-8 text-center">
						<h2 className="text-3xl font-bold text-text-primary">
							Create Account ✨
						</h2>
						<p className="mt-2 text-sm text-text-secondary">
							Join Heaven.ai to start your journaling journey
						</p>
					</div>

					<form onSubmit={handleRegister} className="space-y-5">
						<div className="space-y-2">
							<label className="text-sm font-medium text-text-secondary ml-1">
								Full Name
							</label>
							<input
								type="text"
								placeholder="Enter your full name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								className="
                  w-full px-4 py-3 rounded-xl border outline-none transition-all
                  bg-bg-main border-border-muted text-text-primary placeholder-text-secondary/50
                  focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20
                "
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-text-secondary ml-1">
								Email 
							</label>
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
							<label className="text-sm font-medium text-text-secondary ml-1">
								Password
							</label>
							<input
								type="password"
								placeholder="Enter your secret password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="
                  w-full px-4 py-3 rounded-xl border outline-none transition-all
                  bg-bg-main border-border-muted text-text-primary placeholder-text-secondary/50
                  focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20
                "
							/>
						</div>

						<Button
							type="submit"
							disabled={loading}
							className="
                w-full h-12 rounded-xl bg-brand-purple hover:bg-brand-purple/90 
                text-white font-semibold shadow-lg shadow-brand-purple/25 
                transition-all active:scale-95 disabled:opacity-50
              "
						>
							{loading ? "Creating Account..." : "Sign Up"}
						</Button>
					</form>

					<p className="mt-6 text-center text-sm text-text-secondary">
						Already have an account?{" "}
						<Link
							href="/auth/login"
							className="text-brand-purple font-semibold hover:underline"
						>
							Login
						</Link>
					</p>
				</div>
			</main>
		</div>
	);
}
