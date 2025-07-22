import type { MouseEvent, ReactNode } from "react";

type DialogProps = {
    title: string;
    children?: ReactNode;
    confirmText: string;
    cancelText: string;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isOpen?: boolean;
    handleConfirm: (event: MouseEvent<HTMLButtonElement>) => void;
};

export const Dialog = (props: DialogProps) => {
    return (
        <>
            {props.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#0c1015] text-[#babec4] rounded-lg p-6 max-w-sm w-full shadow-xl text-center border border-gray-600">
                        <h2 className="text-lg mb-4">
                            {props.title}
                            <br />
                            {props.children}
                        </h2>
                        <div className="flex justify-center space-x-4 py-4">
                            <button
                                onClick={props.handleConfirm}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                            >
                                {props.confirmText}
                            </button>
                            <button
                                onClick={() => props.setIsOpen(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                            >
                                {props.cancelText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
