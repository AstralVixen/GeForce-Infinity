import {
	FaGithub,
	FaGlobeAmericas,
	FaPatreon,
	FaCloudDownloadAlt,
} from "react-icons/fa";

const githubUrl = "https://github.com/AstralVixen/GeForce-Infinity";
const websiteUrl = "https://geforce-infinity.xyz";
const patreonUrl = "https://www.patreon.com/AstralVixen";
const updatesUrl = "https://github.com/AstralVixen/GeForce-Infinity/releases";

declare const __APP_VERSION__: string;

export const Footer = () => {
	return (
		<footer className="w-full bg-[#0c1015] p-4 font-sans bottom-0 left-0">
			<div className="flex justify-evenly m-4">
				<a
					onClick={() => window.electronAPI.openExternal(githubUrl)}
					target="_blank"
					rel="noopener noreferrer"
					className="flex flex-col items-center text-sm !text-gray-400 !hover:text-white transition cursor-pointer">
					<FaGithub className="text-4xl mb-1" />
					<span>GitHub</span>
				</a>
				<a
					onClick={() => window.electronAPI.openExternal(websiteUrl)}
					target="_blank"
					rel="noopener noreferrer"
					className="flex flex-col items-center text-sm !text-gray-400 !hover:text-white transition cursor-pointer">
					<FaGlobeAmericas className="text-4xl mb-1" />
					<span>Web</span>
				</a>
				<a
					onClick={() => window.electronAPI.openExternal(patreonUrl)}
					target="_blank"
					rel="noopener noreferrer"
					className="flex flex-col items-center text-sm !text-gray-400 !hover:text-white transition cursor-pointer">
					<FaPatreon className="text-4xl mb-1" />
					<span className="text-center">
						Become a
						<br />
						Fusio member!
					</span>
				</a>
				<a
					onClick={() => window.electronAPI.openExternal(updatesUrl)}
					target="_blank"
					rel="noopener noreferrer"
					className="flex flex-col items-center text-sm !text-gray-400 !hover:text-white !transition !cursor-pointer">
					<FaCloudDownloadAlt className="text-4xl mb-1" />
					<span className="flex flex-col items-center text-center">
						Check for
						<br />
						updates
					</span>
				</a>
			</div>

			<div className="text-sm text-gray-400 text-left mt-4">
				Version: {__APP_VERSION__ || "0.0.0"}
			</div>
		</footer>
	);
};
