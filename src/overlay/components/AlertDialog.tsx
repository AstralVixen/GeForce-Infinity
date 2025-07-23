import type { MouseEvent, ReactNode } from "react";

type AlertDialogProps = {
  title: string;
  children?: ReactNode;
  okText?: string; 
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen?: boolean;
  onOk: (event: MouseEvent<HTMLButtonElement>) => void;
};

export const AlertDialog = ({
  title,
  children,
  okText = "Ok",
  setIsOpen,
  isOpen,
  onOk,
}: AlertDialogProps) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#0c1015] text-[#babec4] rounded-lg p-6 max-w-sm w-full shadow-xl text-center border border-gray-600">
            <h2 className="text-lg mb-4">
              {title}
              <br />
              {children}
            </h2>
            <div className="flex justify-center py-4">
              <button
                onClick={onOk}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              >
                {okText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
