import React from "react";

export const XcloudSettings: React.FC = () => {
	return (
		<>
			<h2 className="text-xl font-semibold mb-4">Xcloud Settings</h2>
			<p className="text-gray-400 mb-4 text-sm">
				Map your keyboard keys to Xbox controller inputs. <br />
				These mappings only apply to Xcloud sessions.
			</p>

			<div className="grid grid-cols-1 gap-4">
				{/* Face buttons */}
				<div className="p-4 bg-gray-800 rounded-lg">
					<h3 className="text-lg font-semibold mb-2">Face Buttons</h3>
					{["A", "B", "X", "Y"].map((btn) => (
						<label
							key={btn}
							className="flex items-center justify-between mb-2">
							<span>{btn} Button</span>
							<select className="rounded p-1 bg-[#23272b] border border-gray-600 text-white">
								<option>Unassigned</option>
								<option>W</option>
								<option>A</option>
								<option>S</option>
								<option>D</option>
								<option>Space</option>
								<option>Enter</option>
							</select>
						</label>
					))}
				</div>

				{/* D-Pad */}
				<div className="p-4 bg-gray-800 rounded-lg">
					<h3 className="text-lg font-semibold mb-2">D-Pad</h3>
					{["Up", "Down", "Left", "Right"].map((dir) => (
						<label
							key={dir}
							className="flex items-center justify-between mb-2">
							<span>{dir}</span>
							<select className="rounded p-1 bg-[#23272b] border border-gray-600 text-white">
								<option>Unassigned</option>
								<option>Arrow Up</option>
								<option>Arrow Down</option>
								<option>Arrow Left</option>
								<option>Arrow Right</option>
							</select>
						</label>
					))}
				</div>

				{/* Triggers & Bumpers */}
				<div className="p-4 bg-gray-800 rounded-lg">
					<h3 className="text-lg font-semibold mb-2">
						Triggers & Bumpers
					</h3>
					{[
						"Left Bumper",
						"Right Bumper",
						"Left Trigger",
						"Right Trigger",
					].map((btn) => (
						<label
							key={btn}
							className="flex items-center justify-between mb-2">
							<span>{btn}</span>
							<select className="rounded p-1 bg-[#23272b] border border-gray-600 text-white">
								<option>Unassigned</option>
								<option>Q</option>
								<option>E</option>
								<option>Shift</option>
								<option>Ctrl</option>
							</select>
						</label>
					))}
				</div>

				{/* Misc buttons */}
				<div className="p-4 bg-gray-800 rounded-lg">
					<h3 className="text-lg font-semibold mb-2">Misc</h3>
					{[
						"Start",
						"Select",
						"Left Stick Click",
						"Right Stick Click",
					].map((btn) => (
						<label
							key={btn}
							className="flex items-center justify-between mb-2">
							<span>{btn}</span>
							<select className="rounded p-1 bg-[#23272b] border border-gray-600 text-white">
								<option>Unassigned</option>
								<option>Tab</option>
								<option>Esc</option>
								<option>Caps Lock</option>
								<option>Alt</option>
							</select>
						</label>
					))}
				</div>
			</div>
		</>
	);
};
