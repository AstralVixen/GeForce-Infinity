import React, { useEffect, useId, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const themeOptions = [
	{
		label: "Default",
		value: "default.zip",
		className: "bg-[#23272b] text-white",
	},
	{
		label: "Metalic",
		value: "metalic.zip",
		className:
			"bg-gradient-to-br from-[#4a4a4a] via-[#2a2a2a] to-[#6e6e6e] text-white",
	},
];

type ThemeSelectProps = {
	value: string;
	onChange: (val: string) => void;
	className?: string;
};

export const ThemeSelect: React.FC<ThemeSelectProps> = ({
	value,
	onChange,
	className,
}) => {
	const id = useId();
	const [open, setOpen] = useState(false);
	const [focusedIndex, setFocusedIndex] = useState<number>(-1);
	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const optionRefs = useRef<Array<HTMLLIElement | null>>([]);

	const selectedIndex = themeOptions.findIndex((o) => o.value === value);
	const selected = themeOptions[selectedIndex] ?? themeOptions[0];

	// Close when clicking outside (bugged)
	useEffect(() => {
		const onDocClick = (e: MouseEvent) => {
			if (!wrapperRef.current) return;
			if (!wrapperRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("click", onDocClick);
		return () => document.removeEventListener("click", onDocClick);
	}, []);

	// Open to selected one
	useEffect(() => {
		if (open) {
			setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
		} else {
			setFocusedIndex(-1);
		}
	}, [open, selectedIndex]);

	useEffect(() => {
		if (focusedIndex >= 0) {
			optionRefs.current[focusedIndex]?.focus();
		}
	}, [focusedIndex]);

	// Button keyboard handling
	const handleButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
		if (!open) {
			if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
				setOpen(true);
				e.preventDefault();
			}
			return;
		}

		if (e.key === "ArrowDown") {
			setFocusedIndex((prev) => (prev + 1) % themeOptions.length);
			e.preventDefault();
		} else if (e.key === "ArrowUp") {
			setFocusedIndex(
				(prev) =>
					(prev - 1 + themeOptions.length) % themeOptions.length,
			);
			e.preventDefault();
		} else if (e.key === "Escape") {
			setOpen(false);
			buttonRef.current?.focus();
			e.preventDefault();
		} else if (e.key === "Enter" || e.key === " ") {
			if (focusedIndex >= 0) {
				onChange(themeOptions[focusedIndex].value);
				setOpen(false);
				buttonRef.current?.focus();
				e.preventDefault();
			}
		}
	};

	return (
		<div
			className={`relative w-48 ${className ?? ""}`}
			ref={wrapperRef}>
			<button
				ref={buttonRef}
				type="button"
				aria-haspopup="listbox"
				aria-expanded={open}
				aria-controls={`${id}-listbox`}
				className={`w-full flex items-center justify-between px-3 py-2 rounded border border-gray-600 ${selected.className}`}
				onClick={() => setOpen((o) => !o)}
				onKeyDown={handleButtonKeyDown}>
				{selected.label}
				<FaChevronDown className="ml-2" />
			</button>

			{open && (
				<ul
					id={`${id}-listbox`}
					role="listbox"
					aria-activedescendant={
						focusedIndex >= 0
							? `${id}-option-${focusedIndex}`
							: undefined
					}
					className="absolute mt-1 w-full rounded border border-gray-600 bg-[#23272b] shadow-lg z-20 max-h-60 overflow-auto">
					{themeOptions.map((option, idx) => (
						<li
							id={`${id}-option-${idx}`}
							key={option.value}
							role="option"
							aria-selected={selected.value === option.value}
							tabIndex={-1}
							ref={(el) => (optionRefs.current[idx] = el)}
							className={`cursor-pointer px-3 py-2 rounded hover:opacity-80 focus:outline-none ${option.className} ${
								focusedIndex === idx
									? "ring-2 ring-blue-500"
									: ""
							}`}
							onClick={(e) => {
								e.stopPropagation();
								onChange(option.value);
								setOpen(false); // auto-exit
								buttonRef.current?.focus();
							}}
							onMouseEnter={() => setFocusedIndex(idx)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									onChange(option.value);
									setOpen(false);
									buttonRef.current?.focus();
									e.preventDefault();
								} else if (e.key === "ArrowDown") {
									setFocusedIndex(
										(idx + 1) % themeOptions.length,
									);
									e.preventDefault();
								} else if (e.key === "ArrowUp") {
									setFocusedIndex(
										(idx - 1 + themeOptions.length) %
											themeOptions.length,
									);
									e.preventDefault();
								} else if (e.key === "Escape") {
									setOpen(false);
									buttonRef.current?.focus();
									e.preventDefault();
								}
							}}>
							{option.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
