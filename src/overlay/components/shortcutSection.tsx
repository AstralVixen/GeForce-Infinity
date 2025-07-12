export const ShortcutSection = () => {
    return (
        <div className="relative border-2 border-gray-400 rounded-lg p-6 w-96 mx-auto mt-10 bg-white/0">
            <div className="absolute -top-3 left-1/5 px-3 text-[#babec4] font-semibold select-none bg-[#23272b]">
                Keyboard Shortcuts
            </div>

            <div className="mt-4 text-[#babec4]">
                <div className="flex justify-between font-mono text-sm mb-2">
                    <span>Ctrl+I</span>
                    <span>Open Sidebar</span>
                </div>
            </div>
        </div>
    );
};
