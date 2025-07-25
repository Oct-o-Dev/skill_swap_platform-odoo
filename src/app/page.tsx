// pages/index.tsx
"use client";
import { useEffect, useState } from "react";

// components
import Navbar from "../components/Navbar";
import SkillCard from "../components/SkillCard";
import Pagination from "../components/Pagination";
import LoginModal from "../components/LoginModal";
import { useSession } from "next-auth/react";

const dummyProfiles = [
	{
		name: "Marc Demo",
		skillsOffered: ["JavaScript", "Python"],
		skillsWanted: ["Backend developer"],
		rating: 3.9,
		isPublic: true,
		photoUrl: "/avatar1.jpeg",
		availability: "Weekends",
	},
	{
		name: "Michell",
		skillsOffered: ["JavaScript"],
		skillsWanted: ["Graphic designer"],
		rating: 2.5,
		isPublic: true,
		photoUrl: "/avatar1.jpeg",
		availability: "Weekends",
	},
	{
		name: "Joe Wills",
		skillsOffered: ["Linux"],
		skillsWanted: ["Frontend developer"],
		rating: 4.0,
		isPublic: true,
		photoUrl: "/avatar1.jpeg",
		availability: "Weekends",
	},
	{
		name: "Anna Smith",
		skillsOffered: ["React", "Node.js"],
		skillsWanted: ["UI/UX designer"],
		rating: 4.5,
		isPublic: true,
		photoUrl: "/avatar1.jpeg",
		availability: "Evenings",
	},
	{
		name: "John Doe",
		skillsOffered: ["C++", "Java"],
		skillsWanted: ["Project manager"],
		rating: 3.2,
		isPublic: true,
		photoUrl: "/avatar1.jpeg",
		availability: "Weekends",
	},
	{
		name: "Emily Clark",
		skillsOffered: ["Go", "Rust"],
		skillsWanted: ["DevOps"],
		rating: 4.8,
		isPublic: true,
		photoUrl: "/avatar1.jpeg",
		availability: "Evenings",
	},
	{
		name: "Michael Lee",
		skillsOffered: ["PHP", "Laravel"],
		skillsWanted: ["SEO specialist"],
		rating: 3.7,
		isPublic: true,
		photoUrl: "/avatar1.jpeg",
		availability: "Weekends",
	},
	{
		name: "Sara Kim",
		skillsOffered: ["Swift", "iOS"],
		skillsWanted: ["Android developer"],
		rating: 4.1,
		isPublic: true,
		photoUrl: "/avatar1.jpeg",
		availability: "Evenings",
	},
];

export default function Home() {
	const { data: session, status } = useSession();
	const isLoggedIn = !!session;
	const [showModal, setShowModal] = useState(false);
	const [search, setSearch] = useState("");
	const [mode, setMode] = useState(() => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("mode") || "light";
		}
		return "light";
	});
	const [availability, setAvailability] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const profilesPerPage = 5;

	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("mode", mode);
			document.documentElement.classList.remove("dark", "light");
			document.documentElement.classList.add(mode);
		}
	}, [mode]);

	const filteredProfiles = dummyProfiles.filter(
		(profile) =>
			profile.isPublic &&
			profile.skillsWanted.some((skill) =>
				skill.toLowerCase().includes(search.toLowerCase())
			) &&
			(availability === "" || profile.availability === availability)
	);

	const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);
	const paginatedProfiles = filteredProfiles.slice(
		(currentPage - 1) * profilesPerPage,
		currentPage * profilesPerPage
	);

	return (
		<div className={`min-h-screen ${mode} transition-colors duration-300`}>
			<Navbar
				onLoginClick={() => setShowModal(true)}
				mode={mode}
				setMode={setMode}
			/>
			<div className="max-w-4xl mx-auto py-8 px-4">
				<div className="flex items-center gap-4 mb-6">
					<select
						className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 px-3 py-2 rounded"
						value={availability}
						onChange={(e) => {
							setAvailability(e.target.value);
							setCurrentPage(1);
						}}
					>
						<option value="">Availability</option>
						<option value="Weekends">Weekends</option>
						<option value="Evenings">Evenings</option>
					</select>
					<input
						type="text"
						placeholder="Search skills..."
						className="flex-1 bg-gray-800 dark:bg-gray-200 px-4 py-2 rounded text-white dark:text-gray-900"
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setCurrentPage(1);
						}}
					/>
					<button className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500 px-4 py-2 rounded text-white dark:text-gray-900">
						Search
					</button>
				</div>
				<div className="space-y-4">
					{paginatedProfiles.map((profile, idx) => (
						<SkillCard
							key={idx}
							profile={profile}
							isLoggedIn={isLoggedIn}
							onRequest={() => {
								if (!isLoggedIn) setShowModal(true);
							}}
						/>
					))}
				</div>
				<Pagination
					totalPages={totalPages}
					currentPage={currentPage}
					onPageChange={setCurrentPage}
				/>
			</div>
			<LoginModal isOpen={showModal} onClose={() => setShowModal(false)} />
		</div>
	);
}
